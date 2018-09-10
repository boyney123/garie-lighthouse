const request = require('supertest');
const express = require('express');
const router = express.Router();
const { getData } = require('../../light-house');
const { saveData } = require('../../influx');
const saveReport = require('../../utils/save-report');

const { app } = require('../../');

jest.mock('../../light-house', () => {
    return {
        getData: jest.fn(() => Promise.resolve())
    }
});

jest.mock('../../influx', () => {
    return {
        saveData: jest.fn(() => Promise.resolve())
    }
});

jest.mock('../../utils/save-report', () => jest.fn());

describe('webhooks', () => {

    beforeEach(() => {
        getData.mockClear();
        saveData.mockClear();
        saveReport.mockClear();
    })

    describe('/collect', () => {

        it('returns a 400 when no url is given in the payload', async () => {

            await request(app)
                .post('/collect')
                .set('Accept', 'application/json')
                .expect(400);

        });

        it('returns a 500 when trying to getData from lighthouse but it fails', async () => {

            getData.mockRejectedValue();

            await request(app)
                .post('/collect')
                .send({ url: 'https://www.example.co.uk' })
                .set('Accept', 'application/json')
                .expect(500);

        });

        it('returns a XXX when trying to save lighthouse data into influxdb but it fails', async () => {

            saveData.mockRejectedValue();

            await request(app)
                .post('/collect')
                .send({ url: 'https://www.example.co.uk' })
                .set('Accept', 'application/json')
                .expect(500);

        });

        it('returns a 201 with lighthouse data and creates a report if report is set to true and getting and saving lighthouse data is successful', async (done) => {

            saveData.mockResolvedValue();
            getData.mockResolvedValue();

            request(app)
                .post('/collect')
                .send({ url: 'https://www.example.co.uk', report: true })
                .set('Accept', 'application/json')
                .expect(201)
                .end((err) => {
                    expect(saveReport).toHaveBeenCalled();
                    done();
                });

        });


        it('returns 201 with the lighthouse data when successfully getting and saving lighthouse data and create no report by default', async (done) => {

            saveData.mockResolvedValue();
            getData.mockResolvedValue();

            request(app)
                .post('/collect')
                .send({ url: 'https://www.example.co.uk' })
                .set('Accept', 'application/json')
                .expect(201)
                .end(err => {
                    expect(saveReport).not.toHaveBeenCalled();
                    done();
                })

        });


    });

});


