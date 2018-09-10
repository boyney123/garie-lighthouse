const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../../light-house');
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
        res.send(201, data);
    } catch (err) {
        logger.error(`Failed to get or save data for ${url}`)
        res.sendStatus(500);
    }


});

module.exports = router;

