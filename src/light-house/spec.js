const { getData } = require('./index');
const { launchChromeAndRunLighthouse } = require.requireMock('./utils');
const logger = require('../utils/logger');
const mockData = require('../../test/mock-data/lighthouse-test-data.json');

const URL = 'https://www.test.com';

jest.mock('./utils', () => {
	return {
		launchChromeAndRunLighthouse: jest.fn()
	}
});

jest.mock('../utils/logger', () => ({
	error: jest.fn(),
	info: jest.fn(),
}));


describe('reporter', () => {

	beforeEach(() => {
		launchChromeAndRunLighthouse.mockClear();
	});


	describe('getData', () => {

		it('opens chrome and runs lighthouse with the given url and default lighthouse configuration', () => {

			getData(URL);
			expect(launchChromeAndRunLighthouse).toBeCalledWith(URL, { "extends": "lighthouse:default" });

		});

		it('returns filtered data when successfully getting data from lighthouse', async () => {

			launchChromeAndRunLighthouse.mockResolvedValue(mockData);

			const result = await getData(URL);

			expect(result).toEqual({
				"performance-score": 100,
				"pwa-score": 50,
				"accessibility-score": 88,
				"best-practices-score": 100,
				"seo-score": 89,
				"firstContentfulPaint": 780,
				"firstMeaningfulPaint": 823,
				"firstCPUIdle": 866,
				"interactive": 866,
				"speedIndex": 903,
				"estimatedInputLatency": 13
			});


		});

		it('logs an error when failing to get data from lighthouse', async () => {

			launchChromeAndRunLighthouse.mockRejectedValue();

			const result = await getData(URL);

			expect(logger.error).toHaveBeenCalledWith('Failed to get data for https://www.test.com');
			

		});

	});

});
