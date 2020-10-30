const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const chromeFlags = [
	'--disable-gpu',
	'--headless',
	'--no-zygote',
	'--no-sandbox',
	'--headless',
	'--disable-network-throttling',
	'--disable-cpu-throttling',
	'--throttling-method provided',
	'--enable-error-reporting',
	'--max-wait-for-load 80000', 
];

const launchChromeAndRunLighthouse = async (url, config) => {

	const chrome = await chromeLauncher.launch({ chromeFlags });

	const flags = {
		port: chrome.port,
		output: 'json',
	};

	const result = await lighthouse(url, flags, config);
	await chrome.kill();

	return result;
};

const createReport = results => ReportGenerator.generateReportHtml(results);


module.exports = {
	launchChromeAndRunLighthouse,
	createReport
}
