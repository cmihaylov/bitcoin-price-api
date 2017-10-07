/////////////////////////////////////////////////////////////////////
//// cron jobs for updating/fetching data
/////////////////////////////////////////////////////////////////////

const CronJob = require('cron').CronJob;
const blockchainApi = require('./../lib/blockchain-info-api');
const BitcoinValue = require('./../model/BitcoinValue.js');
const BitcoinValueHourlyAvg = require('./../model/BitcoinValueHourlyAvg.js');
const BitcoinValueDailyAvg = require('./../model/BitcoinValueDailyAvg.js');
const BitcoinValueMonthlyAvg = require('./../model/BitcoinValueMonthlyAvg.js');
const tools = require('./../lib/tools');

var mongoCallback = function(error, data) {
  if(error)
    console.log(error);
  // else
  //   console.log(data);
}

// cron job every 15 minutes
// var job1 = new CronJob('00 */5 * * * *', function() {
var job1 = new CronJob('00 00,15,30,45 * * * *', function() {
    blockchainApi.fetchCurrentPrice(function (body) {
        BitcoinValue.create({
            value: body.USD.last,
            timestamp: tools.getCurrentTimestamp()
        }, mongoCallback);
    });
}, null, true, 'UTC');

// cron job every hour at :05 minutes
// calc and write avg bitcoin value for previous hour
var job2 = new CronJob('00 05 * * * *', function() {
    // current timestamp in UTC
    var UTCtimestamp = parseInt(new Date().getTime() / 1000);
    // current rouned hour timestamp in UTC
    var roundHourUTCtimestamp = UTCtimestamp - (UTCtimestamp % 3600);
    // previous rouned hour timestamp in UTC
    var prevHourUTCtimestamp = roundHourUTCtimestamp - 3600;

    // get all values for past hour
    // if it's 14:05, then get values between 13:00 and 14:00 (UTC)
    BitcoinValue.find({
        timestamp: {
            $gte: prevHourUTCtimestamp,
            $lte: roundHourUTCtimestamp
        }
    }, function(error, data) {
        // error check
        if(error) {
          console.log(error);
          return false;
        }

        var hourAvg = tools.getDataAverage(data, 'value');

        // skip update if avarage is null
        if (hourAvg === null) return;

        // write hourly avg value to db
        BitcoinValueHourlyAvg.create({
            value: hourAvg,
            timestamp: prevHourUTCtimestamp
        }, mongoCallback);
    });

}, null, true, 'UTC');

// cron job every hour at :59 minutes
// calc and write avg bitcoin value for current day up to this moment
var job3 = new CronJob('00 59 * * * *', function() {

    // // proceed only if it's 0 Hours UTC (12 AM)
    // if (new Date().getUTCHours() != 0) {
    //     return;
    // }

    // current timestamp in UTC
    var UTCtimestamp = parseInt(new Date().getTime() / 1000);
    // current rouned day timestamp in UTC
    var roundDayUTCtimestamp = UTCtimestamp - (UTCtimestamp % (24 * 3600));

    // // previous rouned day timestamp in UTC
    // var prevDayUTCtimestamp = roundDayUTCtimestamp - (24 * 3600);

    // get all hourly average values for past day
    // and calc the average value
    BitcoinValueHourlyAvg.find({
        timestamp: {
            $gte: roundDayUTCtimestamp,
            $lte: UTCtimestamp
        }
    }, function(error, data) {
        // error check
        if(error) {
          console.log(error);
          return false;
        }

        var dailyAvg = tools.getDataAverage(data, 'value');

        // skip update if avarage is null
        if (dailyAvg === null) return;

        // check if there is a daily avg value with this timestamp
        // update/create accordingly
        BitcoinValueDailyAvg.update({
            timestamp: roundDayUTCtimestamp
        },
        { value: dailyAvg},
        function (err, raw) {
            if(err) {
              console.log(err);
            }

            // if not matching object exist,
            // then create new with these values
            if (raw.n == 0) {
                BitcoinValueDailyAvg.create({
                    value: dailyAvg,
                    timestamp: roundDayUTCtimestamp
                }, mongoCallback);
            }
        });
    });

}, null, true, 'UTC');

// cron job every day at 23:55 minutes
// calc and write avg bitcoin value for current month up to this moment
var job4 = new CronJob('00 55 23 * * *', function() {
    // get current year and month
    // build monthly string like '2017-07-01' and convert it to timestamp
    var year = new Date().getUTCFullYear();
    var monthString = tools.monthIntToString(new Date().getUTCMonth());
    var monthlyTimestamp = new Date(
        year + '-' + monthString + '-01'
    ).getTime() / 1000;

    // get all daily average values for past month
    BitcoinValueDailyAvg.find({
        timestamp: {
            $gte: monthlyTimestamp,
        }
    }, function(error, data) {
        // error check
        if(error) {
          console.log(error);
          return false;
        }

        var monthlyAvg = tools.getDataAverage(data, 'value');

        // skip update if avarage is null
        if (monthlyAvg === null) return;

        // check if there is a monthly avg value with this timestamp
        // update/create accordingly
        BitcoinValueMonthlyAvg.update({
            timestamp: monthlyTimestamp
        },
        { value: monthlyAvg},
        function (error, raw) {
            if(error) {
              console.log(error);
              return false;
            }

            // if not matching object exist,
            // then create new with these values
            if (raw.n == 0) {
                BitcoinValueMonthlyAvg.create({
                    value: monthlyAvg,
                    timestamp: monthlyTimestamp
                }, mongoCallback);
            }
        });
    });

}, null, true, 'UTC');

// exports
module.exports = {
    fetchCurrentValue: job1,
    updateHourlyValue: job2,
    updateDailyValue: job3,
    updateMonthlyValue: job4
};
