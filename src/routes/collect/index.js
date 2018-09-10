const express = require('express');
const router = express.Router();
const { getData } = require('../../light-house');
const { saveData } = require('../../influx');
const logger = require('../../utils/logger');

/* GET home page. */
router.post('/', async (req, res, next) => {

    const { body = {} } = req;
    const { url } = body;

    if (!url) {
        logger.info('/collect missing `url` data');
        return res.sendStatus(400);
    }

    try {
        const data = await getData(url);
        await saveData(url, data);
        res.status(201).send(data)
    } catch (err) {
        logger.error(`Failed to get or save data for ${url}`, err);
        res.sendStatus(500);
    }


});

module.exports = router;

