const CronJob = require('cron').CronJob;

const logger = require('./utils/logger');
const config = require('../lighthouse-config');
const { getData } = require('./light-house');
const { init, saveData } = require('./influx');

const { urls, cron } = config;

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
		new CronJob('*/2 * * * *', async () => {
		//	getDataForAllUrls();
		}, null, true, 'Europe/London', null, true);
	}

};

main();

module.exports = main;

