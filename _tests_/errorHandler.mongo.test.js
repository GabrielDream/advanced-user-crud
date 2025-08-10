const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');

const { MongoMemoryServer } = require('mongodb-memory-server');
const errorHandler = require('../middlewares/errorHandler');
const AppError = require('../middlewares/AppError');

// Creating an simple user Schema to test:
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		validate: {
			validator(value) {
				return typeof value === 'string' && /^[^\d]+$/.test(value.trim());
			},
			message: 'Name must not containg numbers!',
		},
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			'Please, insert a valid email!',
		],
	},
});

const User = mongoose.model('UniqueUser', userSchema);

describe('Error Handler - MongoMemoryServer', () => {
	let app; let
		mongoServer;

	// Creating a simple local DB to test errorHandler middleware function
	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	});

	// Destroying local Mongo-mongoose db:
	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	afterEach(async () => {
		await User.deleteMany({});
	});

	// Making important conditions before tests:
	beforeEach(() => {
		app = express();
		app.use(express.json());

		// simple creating user route
		app.post('/user', async (req, res, next) => {
			try {
				const user = await User.create(req.body);
				res.status(200).json({ user });
			} catch (err) {
				next(err);
			}
		});

		// Broken route to simulate a crash:
		app.get('/crash', async (req, res, next) => {
			try {
				const boom = undefined;
				boom.something; // TypeError;
			} catch (err) {
				next(err);
			}
		});
	});

	it('should handler AppError properly', async () => {
		app.get('/costum-error', (req, res, next) => {
			next(new AppError(
				'Custom AppError triggered',
				403,
				'email',
				'ERR_CUSTOM_APP')
			);
		});
		app.use(errorHandler); // Calling error middleware ErrorHander always at the end

		const response = await request(app).get('/costum-error');

		expect(response.status).toBe(403);
		expect(response.body.status).toBe('Error'); // compatível com teu handler atual
		expect(response.body.message).toBe('Custom AppError triggered');
		expect(response.body.field).toBe('email');
		expect(response.body.code).toBe('ERR_CUSTOM_APP');
		expect(response.body.errors).toEqual([]); // handler devolve [] se não vier array
	});

	it('should handle AppError defaults when extras not provided', async () => {
		app.get('/custom-error-defaults', (req, res, next) => {
			next(new AppError('Boom')); // statusCode=500, field=null, code='ERR_GENERIC', errors=null
		});

		app.use(errorHandler);

		const res = await request(app).get('/custom-error-defaults');

		expect(res.status).toBe(500);
		expect(res.body.status).toBe('Error');
		expect(res.body.message).toBe('Boom');
		expect(res.body.field).toBe(null);
		expect(res.body.code).toBe('ERR_GENERIC');
		expect(res.body.errors).toEqual([]);
	});

	// Dealing with VALIDATION ERROR:
	it('should aggregate multiple validation errors', async () => {
		// Route already defined in beforeEach: POST /user (creates a user)
		// We will send a body that triggers more than one validation error at once:
		// - missing "name"
		// - invalid "email"

		// Register error handler after all routes
		app.use(errorHandler);

		// Perform request with multiple invalid fields
		const res = await request(app).post('/user')
			.send({ email: 'invalid-email@' }); // missing name + invalid email

		// Assertions
		expect(res.status).toBe(400);
		expect(res.body.status).toBe('error'); // matches current handler branch
		expect(res.body.message).toBe('VALIDATION ERROR'); // aggregated validation error
		expect(Array.isArray(res.body.errors)).toBe(true);
		expect(res.body.errors).toEqual(
			expect.arrayContaining([
				'Name is required',
				'Please, insert a valid email!',
			])
		);
	});

	// Dealing with 11000 Mongoose erros:
	it('should handle duplicate key error with field, value and code', async () => {
		// Create a first user to occupy the unique email field
		await User.create({ name: 'John Doe', email: 'duplicate@example.com' });

		// Create a route that will attempt to insert a duplicate email
		app.post('/duplicate-email', async (req, res, next) => {
			try {
				await User.create({ name: 'Jane Doe', email: 'duplicate@example.com' });
				res.status(201).json({}); // This line should never be reached
			} catch (err) {
				next(err); // Forward error to the errorHandler
			}
		});

		// Always register the error handler after all routes
		app.use(errorHandler);

		// Perform request to trigger duplicate key error
		const res = await request(app).post('/duplicate-email');

		// Assertions
		expect(res.status).toBe(400);
		expect(res.body.status).toBe('error'); // Matches current handler branch
		expect(res.body.field).toBe('email'); // Field causing duplication
		expect(res.body.value).toBe('duplicate@example.com'); // Value that caused duplication
		expect(res.body.code).toBe('ERR_EMAIL_IN_USE'); // Custom error code from handler
	});

	// Dealing with UNKNOWN errors:
	it('should handle unknown errors and return 500 status', async () => {
		// Create a route that will throw a generic error not handled by other branches
		app.get('/unknown-error', (req, res, next) => {
			// This will create a ReferenceError (variable not defined)
			nonExistentFunction(); // Just for test
		});

		// Always register the error handler after all routes
		app.use(errorHandler);

		// Perform request to trigger the unknown error
		const res = await request(app).get('/unknown-error');

		// Assertions
		expect(res.status).toBe(500);
		expect(res.body.success).toBe(false); // Matches handler's 'Unknown error' branch
		expect(res.body.status).toBe('Unknown error');
		expect(res.body.message).toBe('INTERNAL SERVER ERROR!');
		expect(typeof res.body.error).toBe('string'); // The actual error message
	});

	// Dealing with async route errors without try/catch:
	it('should handle async route errors without try/catch', async () => {
		// Create an async route that throws an error without being caught
		app.get('/async-throw', async (req, res) => {
			throw new Error('Async oops!'); // Will be passed to errorHandler automatically
		});

		// Always register the error handler after all routes
		app.use(errorHandler);

		// Perform request to trigger the async error
		const res = await request(app).get('/async-throw');

		// Assertions
		expect(res.status).toBe(500);
		expect(res.body.success).toBe(false); // Matches handler's 'Unknown error' branch
		expect(res.body.status).toBe('Unknown error');
		expect(res.body.message).toBe('INTERNAL SERVER ERROR!');
		expect(typeof res.body.error).toBe('string'); // The actual error message from the thrown error
	});
});
