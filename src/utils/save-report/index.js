const fs = require('fs-extra');
const path = require('path');
const logger = require('../../utils/logger');
const { generateReport } = require('../../light-house');
const { generatePath } = require('./utils')

module.exports = async (url, data, tags) => {
    try {
        const report = await generateReport(url, data);
        const outFilePath =  generatePath(path.join(__dirname, '../../../reports'), url, tags)
        return fs.outputFile( outFilePath, report);
    } catch (err) {
        logger.error(`Failed to generate report for ${url}`, err);
        return Promise.reject('Failed to generate report');
    }
};
