
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const UAstring = require('./emulationUtils');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const logger = require('../utils/logger');
const request = require('request-promise');
const lhT = require('lighthouse/lighthouse-core/config/constants');

const NoFcp =
	{
		"lhr": {
			"categories": {},
			"audits": {
				"errors-in-console": {
					"rawValue": 99
				},
				"time-to-first-byte": {
					"rawValue": 99999
				},
				"interactive": {
					"rawValue": 99999
				},
				"redirects": {
					"rawValue": 99999
				},
				"dom-size": {
					"rawValue": 999999
				},
				"total-byte-weight": {
					"rawValue": 999999
				},
				"metrics":
					{

						"details": {
							"type": "diagnostic",
							"items": [
								{
									"firstContentfulPaint": 99000,
									"firstMeaningfulPaint": 99000,
									"firstCPUIdle": 99000,
									"interactive": 99000,
									"speedIndex": 99000,
									"estimatedInputLatency": 99000
								}
							]
						}
					}
			}
		}
	};

const launchChromeAndRunLighthouse = async (url, config, device, netmode, port) => {


	try {
		const lhFlags = UAstring.getNetThrottling(netmode);

		if (device !== 'desktop') {
			lhFlags['emulatedFormFactor'] = "mobile";
			lhFlags['disableDeviceEmulation'] = false;

		} else {
			lhFlags['emulatedFormFactor'] = "desktop";
		}

		lhFlags['port'] = port;
		logger.info(`Initiating Lighthouse Run.....`);


		const result = await lighthouse(url, lhFlags, config);
		return result;
	}
	catch (e) {
		if (e.code === "NO_FCP") {
			logger.error(`error NO_FCP:  `, e);
			return NoFcp;
		} else
			logger.error(`error launching and reporting lighthouse for ` + url , e)
	}
};

const createReport = results => ReportGenerator.generateReportHtml(results);


module.exports = {
	launchChromeAndRunLighthouse,
	createReport
}
