const Influx = require('influx');

module.exports = new Influx.InfluxDB({
	host: process.env.HOST || 'localhost',
	database: 'lighthouse'
});
