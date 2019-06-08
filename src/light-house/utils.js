const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const puppeteer = require('puppeteer');
const request = require('request-promise');

const chromeFlags = [
	'--disable-gpu',
	'--headless',
	'--no-zygote',
	'--no-sandbox',
	'--headless',
];

const launchChromeAndRunLighthouse = async (url, config, init) => {

	const chrome = await chromeLauncher.launch({ chromeFlags });

	const flags = {
		port: chrome.port,
		output: 'json',
	};

	if (init) {
		const resp = await request(`http://localhost:${chrome.port}/json/version`);
		const { webSocketDebuggerUrl } = JSON.parse(resp);
		const browser = await puppeteer.connect({
			browserWSEndpoint: webSocketDebuggerUrl
		});
		const page = await browser.newPage();
		await init(url, page);
		await browser.disconnect();
	}

	const result = await lighthouse(url, flags, config);
	await chrome.kill();

	return result;
};

const createReport = results => ReportGenerator.generateReportHtml(results);


module.exports = {
	launchChromeAndRunLighthouse,
	createReport
}
