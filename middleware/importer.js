const blockchainApi = require('./../lib/blockchain-info-api');
const tools = require('./../lib/tools');
const BitcoinValue = require('./../model/BitcoinValue.js');
const BitcoinValueHourlyAvg = require('./../model/BitcoinValueHourlyAvg.js');
const BitcoinValueDailyAvg = require('./../model/BitcoinValueDailyAvg.js');
const BitcoinValueMonthlyAvg = require('./../model/BitcoinValueMonthlyAvg.js');

var mongoCallback = function(error, data) {
  if(error)
    console.log(error);
  // else
  //   console.log(data);
}

// Check if there is a need for data import/sync initiation
// (initiated if number of months is more than the monthly averages in the DB)
function checkDBcompleteness() {
    var currentDate = new Date();
    var startYear = 2010;
    var currentYear = currentDate.getUTCFullYear();
    var currentMonth = currentDate.getUTCMonth();
    var passedMonths = 12 * (currentYear - startYear) + currentMonth;

    BitcoinValueMonthlyAvg.find({}, {}, {sort: {timestamp: -1}}, function (error, data) {
        if (error) {
            console.log(error);
        }
        else if (data.length < passedMonths) {
            console.log('Data in DB is not complete. Data import initiated.');

            for (var year = startYear; year <= currentYear; year++) {
                calcMonthlyAverages(year);
            }
        }
    });
}

function calcMonthlyAverages(year) {
    // cleanup db collections
    BitcoinValue.remove({}, mongoCallback);
    BitcoinValueHourlyAvg.remove({}, mongoCallback);
    BitcoinValueDailyAvg.remove({}, mongoCallback);
    BitcoinValueMonthlyAvg.remove({}, mongoCallback);

    // convert int to string
    year = year.toString();

    var startDate = year + '-01-01';

    // last 60 days timestamp boundary
    var lastNdaysBoundary = tools.getCurrentTimestamp() - (60 * 24 * 3600);

    var dailyBitcoinValue;

    blockchainApi.fetchPriceCharts(startDate, function (body) {
        var data = body.values;

        var count = data.length;

        var sum = 0.00;
        var prevMonthSum;

        var prevItemMonth = null;
        var currItemMonth = null;

        var currMonthDays = 0;
        var bitcoinValue;

        var dataToWrite = [];

        if (count == 0) {
            return;
        }

        for (var i = 0; i < count; i++) {
            currItemMonth = new Date(data[i].x * 1000).getUTCMonth();

            if (currItemMonth === prevItemMonth) {
                sum += parseFloat(data[i].y);
                currMonthDays++;
            } else {
                if (prevItemMonth !== null && currMonthDays > 0) {
                    bitcoinValue = getMonthlyAvgValue(year, sum, currMonthDays, prevItemMonth);

                    dataToWrite.push(bitcoinValue);
                }

                sum = parseFloat(data[i].y);
                currMonthDays = 1;
            }

            // keep the item's month value for the next iteration
            prevItemMonth = currItemMonth;

            // writing last N days average values to DB
            if (data[i].x > lastNdaysBoundary) {

                dailyBitcoinValue = {
                    value: data[i].y,
                    timestamp: data[i].x
                };

                // check if there is a daily avg value with this timestamp
                // (using a closure to pass 'dailyBitcoinValue')
                (function(dailyBitcoinValue){

                    BitcoinValueDailyAvg.update({
                        timestamp: dailyBitcoinValue.timestamp
                    },
                    { value: dailyBitcoinValue.value},
                    function (error, raw) {
                        if(error) {
                          console.log(error);
                          return false;
                        }

                        // if no matching object exist,
                        // then create new with these values
                        if (raw.n == 0)
                            BitcoinValueDailyAvg.create(
                                dailyBitcoinValue,
                                function(error, data) {
                                  if(error)
                                    console.log(error);
                                }
                            );
                    });

                })(dailyBitcoinValue);

            }

        }

        bitcoinValue = getMonthlyAvgValue(year, sum, currMonthDays, prevItemMonth);

        dataToWrite.push(bitcoinValue);

        // write monthly avg values to db
        BitcoinValueMonthlyAvg.create(dataToWrite, function(error, data) {
          if(error)
            console.log(error);
        });
    });
}

// get calculated monthly average Bitcoin value
function getMonthlyAvgValue(year, sum, currMonthDays, prevItemMonth) {
    var avg;
    var monthString;
    var monthlyTimestamp;
    var bitcoinValue;

    avg = parseFloat((sum / currMonthDays).toFixed(2));

    monthString = tools.monthIntToString(prevItemMonth);
    monthlyTimestamp = new Date(
        year + '-' + monthString + '-01'
    ).getTime() / 1000;

    return {
        value: avg,
        timestamp: monthlyTimestamp
    };
}

// exports
module.exports = {
    checkDBcompleteness: checkDBcompleteness
};
