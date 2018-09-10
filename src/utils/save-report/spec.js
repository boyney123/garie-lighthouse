const fsExtra = require('fs-extra');
const fs = require('fs');
const path = require('path');
const { generateReport } = require('../../light-house');
const saveReport = require('./');
const mockData = require('../../../test/mock-data/lighthouse-test-data.json');

jest.mock('../../light-house', () => ({
    generateReport: jest.fn()
}));

describe('save-report', () => {

    beforeAll(() => {
        fsExtra.emptyDirSync(path.join(__dirname, '../../../reports/www.save-report-test.co.uk'));
    })

    afterEach(() => {
        generateReport.mockClear();
        fsExtra.emptyDirSync(path.join(__dirname, '../../../reports/www.save-report-test.co.uk'))
    });

    it('generates a light house report and save it to disk when generateReport is successful', async () => {

        const today = new Date();

        generateReport.mockResolvedValue(`<html></html>`);

        await saveReport('https://www.save-report-test.co.uk', mockData.lhr);

        const filesInFolder = fs.readdirSync(path.join(__dirname, '../../../reports/www.save-report-test.co.uk'));

        const fileMatch = new Date().toISOString().match(/[^T]*/);

        expect(filesInFolder).toHaveLength(1);
        expect(filesInFolder[0].indexOf(fileMatch[0]) > -1).toEqual(true);

    });

    it.only('throws an error if generating the lighthouse report fails', async () => {

        const today = new Date();

        generateReport.mockRejectedValue();

        await expect(saveReport('https://www.save-report-test.co.uk', mockData.lhr)).rejects.toMatch('Failed to generate report');

    });

});