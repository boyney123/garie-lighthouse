/**
 * Insert all key value pairs into the DB
 * @param {String} url - Url from the peroformance data to save
 * @param {*} data - Data to save
 */

const logger = require('../utils/logger');
const lhT = require('lighthouse/lighthouse-core/config/constants');

const Nexus5 = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3694.0 Mobile Safari/537.36 Chrome-Lighthouse';
const IphoneX = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 [FBAN/FBIOS;FBDV/iPhone11,6;FBMD/iPhone;FBSN/iOS;FBSV/12.0;FBSS/3;FBCR/AT&T;FBID/phone;FBLC/en_US;FBOP/5;FBRV/0]';
const Onplus7 = 'Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.132 Mobile Safari/537.36 Instagram 110.0.0.16.119 Android (28/9; 420dpi; 1080x2134; OnePlus; GM1903; OnePlus7; qcom; nl_NL; 171727795)';

const wifi = {
    logLevel: 'error',
    // change loglevel to verbose
    // maxWaitForLoad: 45000,
    // maxWaitForFcp: 30000,
    throttling: {
        "rttMs": 70,
        "throughputKbps": 12 * 1024,
        "requestLatencyMs": 70 * lhT.throttling.DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
        "downloadThroughputKbps": 12 * 1024 * lhT.throttling.DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
        "uploadThroughputKbps": 12 * 1024 * lhT.throttling.DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
        "cpuSlowdownMultiplier": 4
    },
    throttlingMethod: "devtools",
    // deviceScreenEmulationMethod: "provided",
    channel: "devtools",
    output: 'json'
};

function getNetThrottling(mode) {

    logger.info("getting net throttling object for: " + mode);
    try {
        switch (mode) {
            case 'WIFI':
                return wifi;
            case '3G':
                return {
                    logLevel: 'error',
                    maxWaitForLoad: 45000,
                    maxWaitForFcp: 30000,
                    throttlingMethod: "simulate",
                    // deviceScreenEmulationMethod: "provided",
                    channel: "devtools",
                    output: 'json'
                };
            case '4G':
                return {
                    logLevel: 'error',
                    maxWaitForLoad: 45000,
                    maxWaitForFcp: 30000,
                    throttling: lhT.throttling.mobileSlow4G,
                    throttlingMethod: "provided",
                    // deviceScreenEmulationMethod: "provided",
                    channel: "devtools",
                    output: 'json'
                };
            default:
                return null;
        }
    }
    catch (err) {
        logger.error(`Failed to initialize  network throttling object for  ${mode}`, err)
    }

}

function getUAString(device) {

    try {
        logger.info("getting user agent string for device: " + device);


        switch (device) {
            case 'Nexus 5':
                return Nexus5;
            case 'Apple IphoneX':
                return IphoneX;
            case 'OnePlus 7':
                return Onplus7;
            default:
                return null;
        }
    }
    catch (err) {
        logger.error(`Failed to initialize user agent  ${device}`, err)
    }

}

module.exports = {
    getUAString,
    getNetThrottling
};
