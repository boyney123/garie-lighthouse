const CronJob = require('cron').CronJob;
const express = require('express');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');

const collect = require('./routes/collect');
const logger = require('./utils/logger');
const saveReport = require('./utils/save-report');
// const config = require('../config');
const config = require('../config-dev.json');

const { getData,getDatanew } = require('./light-house');
const chromeLauncher = require('chrome-launcher');
const { init, saveData } = require('./influx');
const UAstring = require('./light-house/emulationUtils');
const app = express();
app.use(bodyParser.json());

const {urls, cron, devices, networks} = config

// const { urls, cron } = config;

app.use('/collect', collect);
app.use('/reports', express.static('reports'), serveIndex('reports', { icons: true }));

const chromeFlags = [
    '--disable-gpu',
    // '--disable-component-extensions-with-background-pages',
    '--disable-gpu-sandbox',
    // '--disable-default-apps',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-notifications ',
    // '--disable-web-security',
    // '--disable-extensions-except=\"/home/osboxes/4_40_0_0" ',
    '--disable-background-networking',
    // '--disable-extensions',
    '--disable-sync',
    '--no-zygote',
    '--enable-experimental-extension-apis',
    '--whitelisted-extension-id=gighmmpiobklfepjocnamgkkbiglidom',
    '--allow-legacy-extension-manifests',

    '--load-extension=/home/osboxes/4_40_0_0 ',
    '--no-sandbox',
    // '--headless',
    '--ignore-certificate-errors',
    '--no-default-browser-check',
    '--mute-audio',
    '--no-first-run',
    '--enable-error-reporting',
    '--max-wait-for-load 60000'
    // '--headless'
];

const getDataForAllUrls = async () => {
    // Run lighthouse tests 1 after another.... maybe parallel one day?
    console.time(`Per execution`);
    for (const item of urls) {

        for (const speed of networks) {

            for (const hardware of devices) {
                try {
                    const uaString = UAstring.getUAString(hardware);
                    if (uaString !== null) {
                        const ui = '--user-agent=' + uaString;
                        chromeFlags.push(ui);
                    }
                    console.time(`~~~Per url~~~~~~`);
                    logger.info("launching chrome");
                    const chrome = await chromeLauncher.launch({chromeFlags});
                    logger.info("launched chrome on port " + chrome.pid);

                    const {url, plugins = []} = item;

                    const pluginConfig = plugins.find(({name}) => {
                        return name === 'lighthouse';
                    });

                    const {report, config} = pluginConfig || {};

                    // const {raw, filteredData} = (await getData(item.url, config)) || {};

                    const {raw, filteredData} = (await getDatanew(url, {}, hardware, speed,
                        chrome.port)) || {};

                    // await saveData(item.url, filteredData);
                    saveData(url, filteredData, hardware, speed);
                    console.timeEnd(`~~~Per url~~~~~~`);
                    if (report) {
                        await saveReport(url, raw);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
    console.timeEnd(`Per execution`);

    logger.info('Finished processed all CRON urls');
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
    app.listen(3002, async () => {
        console.log('Application listening on port 3000');
        await main();
    });
}

module.exports = {
    main,
    app
};
