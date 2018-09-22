const { getData, generateReport } = require('./index');
const { launchChromeAndRunLighthouse, createReport } = require.requireMock('./utils');
const logger = require('../utils/logger');
const mockData = require('../../test/mock-data/lighthouse-test-data.json');

const URL = 'https://www.test.com';

jest.mock('./utils', () => {
    return {
        launchChromeAndRunLighthouse: jest.fn(),
        createReport: jest.fn()
    };
});

jest.mock('../utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn()
}));

describe('reporter', () => {
    beforeEach(() => {
        launchChromeAndRunLighthouse.mockClear();
        createReport.mockClear();
    });

    describe('getData', () => {
        it('opens chrome and runs lighthouse with the given url and default lighthouse configuration', () => {
            getData(URL);
            expect(launchChromeAndRunLighthouse).toBeCalledWith(URL, { extends: 'lighthouse:default' });
        });

        it('returns filtered data when successfully getting data from lighthouse', async () => {
            launchChromeAndRunLighthouse.mockResolvedValue(mockData);

            const { filteredData } = await getData(URL);

            expect(filteredData).toEqual({
                'performance-score': 100,
                'pwa-score': 50,
                'accessibility-score': 88,
                'best-practices-score': 100,
                'seo-score': 89,
                firstContentfulPaint: 780,
                firstMeaningfulPaint: 823,
                firstCPUIdle: 866,
                interactive: 866,
                speedIndex: 903,
                estimatedInputLatency: 13,
                'errors-in-console': 0,
                'time-to-first-byte': 104.07399999999998,
                interactive: 866,
                redirects: 0
            });
        });

        it('returns raw data when successfully getting data from lighthouse', async () => {
            launchChromeAndRunLighthouse.mockResolvedValue(mockData);

            const { raw } = await getData(URL);

            expect(raw).toEqual(mockData.lhr);
        });

        it('logs an error when failing to get data from lighthouse', async () => {
            launchChromeAndRunLighthouse.mockRejectedValue();

            const result = await getData(URL);

            expect(logger.error.mock.calls[0][0]).toBe('Failed to get data for https://www.test.com');
        });
    });

    describe('generateReport', () => {
        it('rejects when failing to create a light house report', async () => {
            createReport.mockRejectedValue();
            return expect(generateReport()).rejects.toMatch('Failed to generate report');
        });

        it('returns the lighthouse report when successfully building one', async () => {
            createReport.mockResolvedValue('<html></html>');

            const report = await generateReport();
            expect(createReport).toHaveBeenCalled();
            expect(report).toEqual('<html></html>');
        });
    });
});
