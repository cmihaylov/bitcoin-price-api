function getMongoDbUri(dbParams) {
    var uri = 'mongodb://';

    // add username and password
    if (dbParams.username && dbParams.password) {
        uri += dbParams.username + ':' + dbParams.password + '@';
    }

    // add host, port, db name
    uri += dbParams.host + ':' + dbParams.port + '/' + dbParams.dbName;

    return uri;
}

// exports
module.exports = {
    getMongoDbUri: getMongoDbUri
};
