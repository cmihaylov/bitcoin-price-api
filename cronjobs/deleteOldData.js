/////////////////////////////////////////////////////////////////////
//// cron jobs for deleting old data
/////////////////////////////////////////////////////////////////////

const CronJob = require('cron').CronJob;
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

// cron job every hour at :10 minutes
// remove bitcoin value(s) which are more than 24 hours old
var job1 = new CronJob('00 10 * * * *', function() {
    BitcoinValue.remove({
        timestamp: {
            $lte: tools.getCurrentTimestamp() - (24 * 3600)
        }
    }, mongoCallback);
}, null, true, 'UTC');

// cron job every day at 00:15 o'clock
// remove bitcoin hourly avereage value(s) which are more than 3 days old
var job2 = new CronJob('00 15 00 * * *', function() {
    BitcoinValueHourlyAvg.remove({
        timestamp: {
            $lte: tools.getCurrentTimestamp() - (3 * 24 * 3600)
        }
    }, mongoCallback);
}, null, true, 'UTC');

// cron job every day at 00:20 o'clock
// remove bitcoin daily avereage value(s) which are more than 90 days old
var job3 = new CronJob('00 20 00 * * *', function() {
    BitcoinValueDailyAvg.remove({
        timestamp: {
            $lte: tools.getCurrentTimestamp() - (90 * 24 * 3600)
        }
    }, mongoCallback);
}, null, true, 'UTC');

// exports
module.exports = {
    deleteOldValues: job1,
    deleteOldHourlyValues: job2,
    deleteOldDailyValues: job3
};
