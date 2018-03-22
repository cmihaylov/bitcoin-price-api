const config = require('./config');
const express = require('express');
const cors = require('cors');
const importer = require('./middleware/importer');
const mongoose = require('mongoose');
const dbHelper = require('./lib/db');
const tools = require('./lib/tools');

// import routers
const bitcoinRouter = require('./router/bitcoin');
const defaultRouter = require('./router/default');

// activate configured cron jobs
const updateDataCronJobs = require('./cronjobs/updateData');
const deleteOldDataCronJobs = require('./cronjobs/deleteOldData');

// create Express server
var server = express();

// add CORS middleware
server.use(cors());

// connect to MongoDB
var mongoDbUri = dbHelper.getMongoDbUri(config.dbParams);
var mongoDbOptions = {
    useMongoClient: true
};
mongoose.connect(mongoDbUri, mongoDbOptions);

// Check if there is a need for data import/sync initiation
// (initiated if number of months is more than the monthly averages in the DB)
importer.checkDBcompleteness();

// log time and ip address of request
server.use(function(req, res, next) {
    console.log(tools.getCurrentDatetimeString(), req.ip);
    next();
});

// apply /bitcoin routes
server.use(config.urlPrefix + '/bitcoin', bitcoinRouter);

// apply default router to catch ANY other requested route
server.use(config.urlPrefix + '/', defaultRouter);

// start the server
server.listen(config.serverPort, function () {
    console.log('Server is running on port: ' + config.serverPort);
});
