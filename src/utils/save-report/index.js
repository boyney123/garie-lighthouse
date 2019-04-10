const fs = require('fs-extra');
const path = require('path');
const logger = require('../../utils/logger');
const { generateReport } = require('../../light-house');

module.exports = async (url, data, label) => {
    try {
        const report = await generateReport(url, data);
        const date = new Date();
        const labelPostfix = label ? `~${label}` : '';
        return fs.outputFile(path.join(__dirname, '../../../reports', url.replace(/(^\w+:|^)\/\//, ''), `${date.toISOString()}${labelPostfix}.html`), report);
    } catch (err) {
        logger.error(`Failed to generate report for ${url}`, err);
        return Promise.reject('Failed to generate report');
    }
};
