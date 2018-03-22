function emptyFunc() {};

// get current date in YYYY-MM-DD string
function getCurrentDateString() {
    var date = new Date();

    return date.toISOString().slice(0, 10);
}

function getCurrentDatetimeString() {
    var date = new Date();

    return date.toISOString();
}

// get current date in timestamp
function getCurrentTimestamp() {
    var date = new Date();

    return Math.round(date.getTime() / 1000);
}

// get calculated average for data array by a given attribute
function getDataAverage(data, attributeName) {
    var count = data.length;
    var avg = 0.00;
    var sum = 0.00;

    // if no data, return null
    if (count == 0) {
        return null;
    }

    for (var i = 0; i < count; i++) {
        // sum += parseInt(data[i][attributeName]);
        sum += parseFloat(data[i][attributeName]);
    }

    // avg = Math.round(sum / count);
    avg = parseFloat((sum / count).toFixed(2));

    return avg;
}

// get change in percent of two values
function getChangeInPercent(oldValue, newValue) {
    // if invalid data, return null
    if (newValue == null || oldValue == null || oldValue == 0) {
        return null;
    }

    // make sure values are floats
    newValue = parseFloat(newValue);
    oldValue = parseFloat(oldValue);

    var result = 100 * ((newValue - oldValue) / oldValue);

    return parseFloat(result.toFixed(2));
}

// convert Date object's integer month to string
function monthIntToString(value) {
    // int values for month are from 0 to 11, so increment with 1
    value = value + 1;

    value = value.toString();

    return (value.length == 1)
        ? 0 + value
        : value;
}

// exports
module.exports = {
    emptyFunc: emptyFunc,
    getCurrentDateString: getCurrentDateString,
    getCurrentDatetimeString: getCurrentDatetimeString,
    getCurrentTimestamp: getCurrentTimestamp,
    getDataAverage: getDataAverage,
    getChangeInPercent: getChangeInPercent,
    monthIntToString: monthIntToString
};
