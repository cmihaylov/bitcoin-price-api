const config = require('./../config');
const request = require('request');
const tools = require('./tools');

function fetchPriceCharts(startDate, callback) {
    callback = callback || tools.emptyFunc;

    request({
        url: config.blockchainInfoApi.priceCharts,
        qs: {
            rollingAverage: '24hours',
            start: startDate,
            format: 'json'
        },
        method: 'GET',
        json: true
    }, function (error, response, body) {
        callback(body);
    });
}

function fetchCurrentPrice(callback) {
    callback = callback || tools.emptyFunc;

    request({
        url: config.blockchainInfoApi.ticker,
        qs: {},
        method: 'GET',
        json: true
    }, function (error, response, body) {
        callback(body);
    });
}

// exports
module.exports = {
    fetchCurrentPrice: fetchCurrentPrice,
    fetchPriceCharts: fetchPriceCharts
};
