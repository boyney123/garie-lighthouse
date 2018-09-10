const express = require('express');
const router = express.Router();
const { getData } = require('../../light-house');
const { saveData } = require('../../influx');
const logger = require('../../utils/logger');
const saveReport = require('../../utils/save-report');

router.post('/', async (req, res, next) => {

    const { body = {} } = req;
    const { url, report = false } = body;

    if (!url) {
        logger.info('/collect missing `url` data');
        return res.sendStatus(400);
    }

    try {

        const { raw, filteredData } = await getData(url) || {};

        await saveData(url, filteredData);

        if (report) {
            await saveReport(url, raw);
        }

        res.status(201).send(filteredData)
    } catch (err) {
        logger.error(`Failed to get or save data for ${url}`, err);
        res.sendStatus(500);
    }


});

module.exports = router;

