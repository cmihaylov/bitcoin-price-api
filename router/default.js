const express = require('express')

var router = express.Router()

// catch all other routes
router.all(/.*/, function (req, res, next) {
    res.json({
        'msg': 'You got lost?',
        'routes': {
            'last value': 'GET /bitcoin/now',
            'last hour values': 'GET /bitcoin/hour',
            'last day hourly avg values': 'GET /bitcoin/day',
            'last week daily avg values': 'GET /bitcoin/week',
            'last month daily avg values': 'GET /bitcoin/month',
            'last year monthly avg values': 'GET /bitcoin/year',
            'all-time monthly avg values': 'GET /bitcoin/all'
        }
    });
});

module.exports = router;
