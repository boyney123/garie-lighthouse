const chromeLauncher = require('chrome-launcher');
const UAstring = require('./emulationsUtils');
const logger = require('../Utils/logger');

const PORT=9519;
const chromeFlags = [
    '--disable-gpu',
    '--no-zygote',
    '--no-sandbox',
    '--headless'

];

module.exports = {
    launchChrome: async (device = {}) => {
        try {

            logger.info(`launching chrome on Port ${PORT}`);

            const uaString = UAstring.getUAString(device);
            if (uaString !== null) {
                const ui = '--user-agent=' + uaString;
                chromeFlags.push(ui);
            }

            const chrome = await chromeLauncher.launch({
                port: PORT, // Uncomment to force a specific port of your choice.
                chromeFlags: chromeFlags
            });

            logger.info(`Successfully launched chrome processId: ${chrome.pid} , port: ${chrome.port}`);

            return Promise.resolve({
                chrome
            });
        }
        catch (err) {
            logger.error(`Failed to get data for ${url}`, err);
        }
    }
};