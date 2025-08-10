const express = require('express');
const { logSuccess } = require('../utils/logger');

const app = express();

const successHandler = require('../middlewares/successHandler');

app.use(successHandler);

// making route to test:
app.use('/success', (req, res, next) => {
	res.success({ message: 'Success worked!' });
});

// Running test server:
const request = require('supertest');

describe('Testing middlawere success function', () => {
	it('should return success response', async () => {
		const response = await request(app).get('/success');
		expect(response.status).toBe(200);
		expect(response.body.status).toBe('Success');
		expect(response.body.message).toBe('Success worked!');
		logSuccess('ALL WORKED!');
	});
});
