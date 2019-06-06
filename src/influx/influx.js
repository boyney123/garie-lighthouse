const Influx = require('influx');

module.exports =
	process.env.INFLUXDB_URL ?
		new Influx.InfluxDB( process.env.INFLUXDB_URL )
		: new Influx.InfluxDB({
			host: process.env.HOST || 'localhost',
			database: 'lighthouse'
		});
