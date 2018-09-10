const cron = require('cron');
const { main } = require('./');
const influx = require('./influx');
const config = require('../lighthouse-config');
const lightHouse = require('./light-house');

jest.mock('./influx', () => {
    return {
        init: jest.fn()
    }
});

jest.mock('../lighthouse-config', () => {
    return {
        cron: '*/2 * * * *',
        urls: [
            { url: 'https://www.test.com' }
        ]
    }
});

jest.mock('./light-house', () => {
    return {
        getData: jest.fn()
    }
});

jest.mock('cron', () => {
    return {
        CronJob: jest.fn()
    }
});


describe('main', () => {

    beforeEach(() => {

        influx.init.mockClear();
        cron.CronJob.mockClear();
        lightHouse.getData.mockClear();

    });

    it('calls to bootstrap the influx setup', async () => {

        await main();
        expect(influx.init).toBeCalled();

    });

    it('creates a cron job when cron is enabled', async () => {

        await main();

        const cronJobArgs = cron.CronJob.mock.calls[0];

        const cronValue = cronJobArgs[0];
        const timeZone = cronJobArgs[4];
        const startCronOnLoad = cronJobArgs[6];

        expect(cronValue).toEqual('*/2 * * * *');
        expect(timeZone).toEqual('Europe/London');
        expect(startCronOnLoad).toEqual(true);


    });

});

