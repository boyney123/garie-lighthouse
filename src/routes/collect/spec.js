const request = require('supertest');
const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../../light-house');

const { app } = require('../../');

jest.mock('../../light-house', () => {
    return {
        getData: jest.fn(Promise.resolve()),
        saveData: jest.fn()
    }
});

describe('webhooks', () => {

    beforeEach(() => {
        getData.mockClear();
        saveData.mockClear();
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

        it('returns 201 with the lighthouse data when successfully getting and saving lighthouse data', async () => {

            request(app)
                .post('/collect')
                .send({ url: 'https://www.example.co.uk' })
                .set('Accept', 'application/json')
                .expect(201);

        });

    });

});


