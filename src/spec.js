const main = require('./');
const influx = require('./influx');
const config = require('../lighthouse-config');

jest.mock('./influx', () => {
	return {
        init: jest.fn()
	}
});

jest.mock('../lighthouse-config', () => {
	return {
        cron: true
	}
});


describe('main', () => {

    beforeEach(() => {

        influx.init.mockClear();
        
    });

    it('bootstraps the influx database', async () => {

        await main();
        expect(influx.init).toBeCalled();

    });


});

// TODO: Finish the tests here...
