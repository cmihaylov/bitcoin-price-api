# Bitcoin Price API

This is a simple Bitcoin value API. The idea is to keep as minimum data as required, but enough to provide valuable trend data by keeping both short-term price values, as well as long-term averages.


## Requirements

* node
* npm
* mongoDB


## Installation

Clone the project repository and install dependencies.

```bash
$ npm install
```


## Configuration

Create **config.js** by copying **config.js.dist**

```bash
$ cp config.js.dist config.js
```

Change server port and database parameters in config.js to match your environment.


## Running the project

```bash
$ node index.js
```


## Thank you

Thanks to https://blockchain.info for providing a great API for data source.
