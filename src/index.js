const CronJob = require('cron').CronJob;
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const collect = require('./routes/collect');

const logger = require('./utils/logger');
const config = require('../lighthouse-config');
const { getData } = require('./light-house');
const { init, saveData } = require('./influx');

const { urls, cron } = config;

app.use('/collect', collect);

const getDataForAllUrls = async () => {

	// Run lighthouse tests 1 after another.... maybe parallel one day?
	for (const item of urls) {
		const { url } = item;
		const data = await getData(item.url);
		await saveData(item.url, data);
	}

	logger.info('Finished processed all urls');

};

const main = async () => {

	await init();

	if (cron) {
		return new CronJob(cron, async () => {
			getDataForAllUrls();
		}, null, true, 'Europe/London', null, true);
	}

};

app.listen(3000, async () => {
	console.log('Application listening on port 3000');
	await main();
})

module.exports = main;

