const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const userRoutes = require('../routes/emailCheckRoutes');
const User = require('../model/User');

const successHandler = require('../middlewares/successHandler');
const errorHandler = require('../middlewares/errorHandler');

// Express server just for test:
const app = express();
app.use(express.json());
app.use(successHandler);
app.use('/api', userRoutes);
app.use(errorHandler);

let mongoServer;

describe('User Route to check Email', () => {
	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();
		await mongoose.connect(uri);
	});

	afterEach(async () => {
		await User.deleteMany();
		jest.restoreAllMocks();
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	describe('GET /api/checkEmail/:email', () => {
		describe('✅SUCCESS CASES: ', () => {
			it('✅ Should return false if email is not found', async () => {
				const res = await request(app).get(
					'/api/checkEmail/exist@example.com'
				);
				expect(res.statusCode).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.exists).toBe(false); // Email not found
			});

			it('✅ Should return true if email exists', async () => {
				await new User({
					name: 'Existing User',
					age: 30,
					email: 'exist@example.com',
					password: 'Test@1234',
				}).save();

				const res = await request(app).get(
					'/api/checkEmail/exist@example.com'
				);
				expect(res.statusCode).toBe(200);
				expect(res.body.success).toBe(true);
				expect(res.body.data.exists).toBe(true); // Email exists
				console.log(res.body); // Debugging (can be removed after verifying)
			});
		});

		describe('❌ ERROR CASES: ', () => {
			it('❌ should return 400 if email has invalid format', async () => {
				const res = await request(app).get('/api/checkEmail/notanemail');

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe('EMAIL IS INVALID!');
			});

			it('❌ should return 500 if db failures', async () => {
				const spy = jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Database failure'));

				const res = await request(app).get(
					'/api/checkEmail/test@example.com'
				);

				expect(res.statusCode).toBe(500);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe('ERROR TO CHECK EMAIL!');

				spy.mockRestore();
			});
		});
	});
});
