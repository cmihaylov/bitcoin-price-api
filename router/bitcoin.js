const BitcoinValue = require('./../model/BitcoinValue.js');
const BitcoinValueHourlyAvg = require('./../model/BitcoinValueHourlyAvg.js');
const BitcoinValueDailyAvg = require('./../model/BitcoinValueDailyAvg.js');
const BitcoinValueMonthlyAvg = require('./../model/BitcoinValueMonthlyAvg.js');
const tools = require('./../lib/tools');
const express = require('express')

var router = express.Router()

var conditions = {};
var fields = {
    _id: false,
    __v: false
};
var options = {
    sort: {timestamp: -1}
};

var callback = function (res, error, data) {
    if (error) {
        console.log(error);
        res.send('An error has occured.');
    }

    res.json(data);
}

// get last value
router.get('/now', function (req, res, next) {
    BitcoinValue.find(
        {},
        fields,
        {
            sort: {timestamp: -1},
            limit: 1
        },
        function (error, data) {
            callback(res, error, data);
        }
    );
});

// get last hour's values
router.get('/hour', function (req, res, next) {
    BitcoinValue.find(
        {
            timestamp: {$gte: tools.getCurrentTimestamp() - 3600}
        },
        fields,
        options,
        function (error, data) {
            callback(res, error, data);
        }
    );
});

// get last 24 hours' hourly average values
router.get('/day', function (req, res, next) {
    BitcoinValueHourlyAvg.find(
        {
            timestamp: {$gte: tools.getCurrentTimestamp() - (24 * 3600)}
        },
        fields,
        options,
        function (error, data) {
            callback(res, error, data);
        }
    );
});

// get last week's daily average values
router.get('/week', function (req, res, next) {
    BitcoinValueDailyAvg.find(
        {
            timestamp: {$gte: tools.getCurrentTimestamp() - (7 * 24 * 3600)}
        },
        fields,
        options,
        function (error, data) {
            callback(res, error, data);
        }
    );
});

// get last month's daily average values
router.get('/month', function (req, res, next) {
    BitcoinValueDailyAvg.find(
        {
            timestamp: {$gte: tools.getCurrentTimestamp() - (30 * 24 * 3600)}
        },
        fields,
        options,
        function (error, data) {
            callback(res, error, data);
        }
    );
});

// get last year's monthly average values
router.get('/year', function (req, res, next) {
    BitcoinValueMonthlyAvg.find(
        {
            timestamp: {$gte: tools.getCurrentTimestamp() - (12 * 30 * 24 * 3600)}
        },
        fields,
        options,
        function (error, data) {
            callback(res, error, data);
        }
    );
});

// get all-time monthly average values
router.get('/all', function (req, res, next) {
    BitcoinValueMonthlyAvg.find(
        {},
        fields,
        options,
        function (error, data) {
            callback(res, error, data);
        }
    );
});

module.exports = router;
