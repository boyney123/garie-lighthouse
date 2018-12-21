const CronJob = require('cron').CronJob;
const express = require('express');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');
const numCPUs = require('os').cpus().length;

const collect = require('./routes/collect');
const logger = require('./utils/logger');
const saveReport = require('./utils/save-report');
const mapAsync = require('./utils/map-async');
const config = require('../config');
const { getData } = require('./light-house');

const { init, saveData } = require('./influx');

const app = express();
app.use(bodyParser.json());

const { urls, cron } = config;

app.use('/collect', collect);
app.use('/reports', express.static('reports'), serveIndex('reports', { icons: true }));

async function runLighthouse(item) {
    try {
        const { url, plugins = [] } = item;

        const pluginConfig = plugins.find(({ name }) => {
            return name === 'lighthouse';
        });

        const { report, config } = pluginConfig || {};

        const { raw, filteredData } = (await getData(item.url, config)) || {};

        await saveData(item.url, filteredData);

        if (report) {
            await saveReport(url, raw);
        }
    } catch (err) {
        console.log(err);
    }
}

const getDataForAllUrls = async () => {
    await mapAsync(urls, item => runLighthouse(item), { concurrency: numCPUs });
    logger.info('Finished processed all CRON urls.');
};

const main = async () => {
    await init();

    try {
        if (cron) {
            return new CronJob(
                cron,
                async () => {
                    getDataForAllUrls();
                },
                null,
                true,
                'Europe/London',
                null,
                true
            );
        }
    } catch (err) {
        console.log(err);
    }
};

if (process.env.ENV !== 'test') {
    app.listen(3000, async () => {
        console.log('Application listening on port 3000');
        await main();
    });
}

module.exports = {
    main,
    app
};
