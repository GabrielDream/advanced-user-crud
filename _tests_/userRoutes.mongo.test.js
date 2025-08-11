const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');

const userRoutes = require('../routes/userRoutes');
const User = require('../model/User');

const successHandler = require('../middlewares/successHandler');
const errorHandler = require('../middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use(successHandler);
app.use('/api', userRoutes);
app.use(errorHandler);

let mongoServer;

describe('User Routes', () => {
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

	describe('POST /api/register', () => {
		describe('✅SUCCESS CASES: ', () => {
			it('✅ should create a user with valid data', async () => {
				const res = await request(app).post('/api/register').send({
					name: 'Test User',
					age: 25,
					email: 'test@example.com',
					password: 'Valiadsfadfd@123!',
				});

				expect(res.statusCode).toBe(201);
				expect(res.body.success).toBe(true);
				expect(res.body.message).toBe('SUCCESSFULLY REGISTERED!');
			});

			it("✅ Should accept age as a numeric string like '25'", async () => {
				const res = await request(app).post('/api/register').send({
					name: 'Valid Name',
					age: '25', // ← string numérica válida
					email: 'only@anexemple.com',
					password: 'Valid@123',
				});

				expect(res.statusCode).toBe(201);
				expect(res.body.success).toBe(true);
				expect(res.body.message).toBe('SUCCESSFULLY REGISTERED!');
			});
		});

		describe('❌ ERROR CASES: ', () => {
			it('❌ Should return 400 if required fields are missing', async () => {
				const res = await request(app).post('/api/register').send({
					name: '',
					age: '',
					email: '',
					password: '',
				});

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe('ALL FIELDS NEED TO BE FILLED!');
			});

			it('❌ should return 400 if password is weak', async () => {
				const res = await request(app).post('/api/register').send({
					name: 'name',
					age: 3,
					email: 'valid@email.com',
					password: '123', // senha inválida
				});

				expect(res.statusCode).toBe(400);
				expect(res.body.errors).toEqual(
					expect.arrayContaining([
						expect.stringMatching(/password.*upcase.*lowercase.*special/i),
					])
				);
			});

			it('❌ should return 400 if extra parameters are sent', async () => {
				const res = await request(app).post('/api/register').send({
					name: 'User Extra',
					age: 30,
					email: 'extra@example.com',
					password: 'Valid@123',
					extraParam: 'notAllowed',
				});

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.code).toBe('ERR_EXTRA_FIELDS');
				expect(res.body.message).toMatch("EXTRA FIELDS ARE NOT ALLOWED: extraParam");
			});

			it('❌ should handle internal server erros', async () => {
				jest.spyOn(User.prototype, 'save').mockImplementation(() => {
					throw new Error('DB error');
				});

				const res = await request(app).post('/api/register').send({
					name: 'Test User',
					age: 25,
					email: 'test4@example.com',
					password: 'Valid@123',
				});

				expect(res.statusCode).toBe(500);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe(
					'UNEXPECTED ERROR IN REGISTER FUNCTION!'
				);
			});

			describe("NAME FIELD:", () => {
				it('❌ should return 400 if name is not a String', async () => {
					const res = await request(app).post('/api/register').send({
						name: 2,
						age: 30,
						email: 'only@anexemple.com',
						password: 'Valid@123',
					});

					expect(res.statusCode).toBe(400);
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe('ADD FUNCTION: INVALID NAME!');
				});

				it('❌ should return 400 if name is a number', async () => {
					const res = await request(app).post('/api/register').send({
						name: 5,
						age: 3,
						email: 'valid@email.com',
						password: 'Password@123',
					});

					expect(res.statusCode).toBe(400);
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe('ADD FUNCTION: INVALID NAME!');
				});
			})

			describe("AGE FIELD:", () => {
				it('❌ Should return 400 if age is not a valid number', async () => {
					const res = await request(app).post('/api/register').send({
						name: 'Invalid name',
						age: 'abc', // Invalid data type for age
						email: 'only@anexemple.com',
						password: 'Valid@123',
					});

					expect(res.statusCode).toBe(400);
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe('ADD FUNCTION: INVALID AGE!');
					expect(res.body.code).toBe('ERR_INVALID_AGE');
				});

				it('❌ Should return 400 if age is less than 1', async () => {
					const res = await request(app).post('/api/register').send({
						name: 'Too Young',
						age: -5, // Invalid age
						email: 'young@example.com',
						password: 'Valid@123',
					});

					expect(res.statusCode).toBe(400);
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe('ADD FUNCTION: INVALID AGE!');
					expect(res.body.code).toBe('ERR_INVALID_AGE');
				});

				it('❌ Should return 400 if age is higher than 100', async () => {
					const res = await request(app).post('/api/register').send({
						name: 'Too Young',
						age: 300, // Invalid age
						email: 'young@example.com',
						password: 'Valid@123',
					});

					expect(res.statusCode).toBe(400);
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe('ADD FUNCTION: INVALID AGE!');
					expect(res.body.code).toBe('ERR_INVALID_AGE');
				});
			});

			describe("EMAIL FIELD:", () => {
				it('❌ should return 400 if email is in use', async () => {
					await User.create({
						name: 'Invalid name',
						age: 3,
						email: 'only@anexemple.com',
						password: 'Valid@123',
					});

					const res = await request(app).post('/api/register').send({
						name: 'Invalid name',
						age: 3,
						email: 'only@anexemple.com',
						password: 'Valid@123',
					});

					expect(res.statusCode).toBe(400);
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe('EMAIL ALREADY IN USE!');
				});

				it('❌ should return 400 if email has invalid format', async () => {
					const res = await request(app).post('/api/register').send({
						name: 'name',
						age: 3,
						email: 'invalidEmailcom',
						password: 'Valid@123',
					});

					expect(res.statusCode).toBe(400);
					expect(res.body.errors).toEqual(
						expect.arrayContaining([
							expect.stringMatching(/Please, insert a valid email/i),
						])
					);
				});
			});

			describe("EMAIL FIELD:", () => {

			});

		});
	});

	describe("GET /api/checkUsers", () => {
		describe("✅SUCCESS CASES: ", () => {
			it("✅ should return 200 if the users could be found!", async () => {
				await User.create([
					{
						name: "User One",
						age: 25,
						email: "user1@example.com",
						password: "Valid@123",
					},
					{
						name: "User Two",
						age: 30,
						email: "user2@example.com",
						password: "Valid@123",
					},
				]);

				const res = await request(app).get("/api/checkUsers");

				expect(res.statusCode).toBe(200);
				expect(res.body.message).toBe(
					"CHECKUSER FUNCTION: SUCCESSFULY SHOWN!"
				);
				expect(Array.isArray(res.body.data)).toBe(true);
				expect(res.body.data.length).toBeGreaterThan(0);
			});
			it("✅ should return 200 if theres no users, with an empty list!", async () => {
				await User.deleteMany();

				const res = await request(app).get("/api/checkUsers");

				expect(res.statusCode).toBe(200);
				expect(res.body.message).toBe(
					"CHECKUSER FUNCTION: NO USERS TO SHOWN"
				);
				expect(Array.isArray(res.body.data)).toBe(true);
				expect(res.body.data.length).toBe(0);
			});

			it("✅ should return each user with name, age and email, without exposing password", async () => {
				await User.create([
					{
						name: "User One",
						age: 25,
						email: "user1@example.com",
						password: "Valid@123",
					},
					{
						name: "User Two",
						age: 30,
						email: "user2@example.com",
						password: "Valid@123",
					},
				]);

				const res = await request(app).get("/api/checkUsers");

				expect(res.statusCode).toBe(200);
				expect(Array.isArray(res.body.data)).toBe(true);
				expect(res.body.data.length).toBeGreaterThan(0);

				// 🔍 Valida campos essenciais e ausência de password
				res.body.data.forEach(user => {
					expect(user).toHaveProperty("name");
					expect(user).toHaveProperty("age");
					expect(user).toHaveProperty("email");
					expect(user).not.toHaveProperty("password"); // segurança
				});
			});
		});

		describe("❌ ERROR CASES: ", () => {
			it("❌ should return 500 if there's a server error while fetching user", async () => {
				jest.spyOn(User, "find").mockImplementation(() => {
					throw new Error("DB Error");
				});

				const res = await request(app).get("/api/checkUsers");

				expect(res.statusCode).toBe(500);
				expect(res.body.message).toBe(
					"UNEXPECTED ERROR IN FETCHING USERS FUNCTION!"
				);
			});
		});
	});

	describe("DELETE /api/delete", () => {
		describe("✅ SUCCESS CASES: ", () => {
			it("✅ should delete user with valid id", async () => {
				const newUser = await User.create({
					name: "User",
					age: 30,
					email: "user1@example.com",
					password: "Password@123",
				});

				const id = newUser._id;

				const res = await request(app).delete(`/api/deleteUser/${id}`);

				expect(res.statusCode).toBe(200);
				expect(res.body.message).toBe("SUCCESSFULLY DELETED!");
			});
		});
		describe("❌ ERROR CASES: ", () => {
			it("❌ Should return 400 if id has invalid format", async () => {
				const res = await request(app).delete(
					"/api/deleteUser/not-an-valid-id"
				);

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("INVALID USER ID!");
			});

			it("❌ should return 404 if ID do not exist in db", async () => {
				const nonExistedId = new mongoose.Types.ObjectId();
				const res = await request(app).delete(
					`/api/deleteUser/${nonExistedId}`
				);

				expect(res.statusCode).toBe(404);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("USER NOT FOUND!");
			});

			it("❌ should handle internal server error", async () => {
				const user = await User.create({
					name: "Internal Error User",
					age: 40,
					email: "internal@example.com",
					password: "Password@123",
				});

				// Forçando erro ao tentar deletar
				jest.spyOn(User, "findById").mockImplementation(() => {
					throw new Error("DB error");
				});

				const res = await request(app).delete(
					`/api/deleteUser/${user._id}`
				);

				expect(res.statusCode).toBe(500);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toMatch(/unexpected|internal/i);

				// Importante: restaurar função original
				jest.restoreAllMocks();
			});
		});
	});

	describe("PUT /api/put", () => {
		let user;
		let userId;

		beforeEach(async () => {
			user = await User.create({
				name: "Example",
				age: 30,
				email: "example@example.com",
				password: "Password@1234",
			});
			userId = user._id;
		});

		describe("✅ SUCCESS CASES: ", () => {
			it("✅ should update users with valid datas:", async () => {
				const newPassword = "Password@skq!!#";

				const res = await request(app)
					.put(`/api/updateUser/${userId}`)
					.send({
						name: "Sam",
						age: 23,
						email: "example@example.com",
						password: newPassword,
					});

				expect(res.statusCode).toBe(200);
				expect(res.body.message).toBe("SUCCESSFULY UPDATED!");

				// Buscar usuário atualizado direto no banco
				const updatedUser = await User.findById(userId);

				// Conferir se o nome, idade e email foram atualizados corretamente
				expect(updatedUser.name).toBe("Sam");
				expect(updatedUser.age).toBe(23);
				expect(updatedUser.email).toBe("example@example.com");

				// Validar se a senha foi realmente atualizada (hash bate com senha nova)
				const isPasswordValid = await bcrypt.compare(
					newPassword,
					updatedUser.password
				);
				expect(isPasswordValid).toBe(true);
			});

			it("✅ should persist the update in the database", async () => {
				const newName = "PersistentName";

				await request(app).put(`/api/updateUser/${user._id}`).send({
					name: newName,
				});

				const updateUser = await User.findById(user._id);

				expect(updateUser.name).toBe(newName);
			});
		});

		describe("❌ ERROR CASES: ", () => {
			it("❌ should return 404 if user is not found", async () => {
				const unsavedId = new mongoose.Types.ObjectId();

				const res = await request(app)
					.put(`/api/updateUser/${unsavedId}`)
					.send({
						/*Empty body*/
					});

				console.log("Status Code:", res.statusCode);
				console.log("Response Body:", res.body);

				expect(res.statusCode).toBe(404);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe(
					"UPDATE FUNCTION : USER NOT FOUND"
				);
			});

			it("❌ should return 404 if all fiels are empty", async () => {
				const res = await request(app)
					.put(`/api/updateUser/${user._id}`)
					.send({
						/*Empty body*/
					});

				expect(res.statusCode).toBe(404);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe(
					"UPDATE FUNCTION : AT LEAST ONE FIELD NEED TO BE FILLED!"
				);
			});

			it("should return an error if extra fields are provided", async () => {
				const res = await request(app)
					.put(`/api/updateUser/${userId}`)
					.send({
						name: "John",
						age: 28,
						role: "admin", // 👈 Extra field not allowed
					});

				expect(res.statusCode).toBe(400);
				expect(res.body).toHaveProperty("code", "ERR_EXTRA_FIELDS");
				expect(res.body.message).toMatch(/^EXTRA FIELDS ARE NOT ALLOWED:/i);
			});

			it("❌ should return 400 if ID is invalid/malformed", async () => {
				const res = await request(app)
					.put(`/api/updateUser/invalidId`)
					.send({});

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe(
					"UPDATE FUNCTION: INVALID USER ID FORMAT!"
				);
			});

			it("❌ should return 400 if it is an invalid age (non-number)", async () => {
				const res = await request(app)
					.put(`/api/updateUser/${user._id}`)
					.send({
						name: "Example",
						age: "asg",
						email: "example@example.com",
						password: "Password@1234",
					});

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("UPDATE FUNCTION: INVALID AGE!");
			});

			it("❌ should return 400 if age ir an empty string", async () => {
				const res = await request(app)
					.put(`/api/updateUser/${user._id}`)
					.send({
						age: "",
					});

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe("UPDATE FUNCTION: INVALID AGE!");
			});

			it("❌ should return 400 if email is in use", async () => {
				const userWithSameEmail = await User.create({
					name: "Example",
					age: 30,
					email: "example1@example.com",
					password: "Password@1234",
				});

				const userWithSameEmailId = userWithSameEmail._id;

				const res = await request(app)
					.put(`/api/updateUser/${userWithSameEmailId}`)
					.send({
						email: "example@example.com",
					});

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe(
					"UPDATE FUNCTION: EMAIL IS ALREADY IN USE!"
				);
			});

			it("❌ should return 400 if the passoword is invalid", async () => {
				const res = await request(app)
					.put(`/api/updateUser/${userId}`)
					.send({
						password: "password", //to weak
					});

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe(
					"UPDATE FUNCTION: INVALID PASSWORD!"
				);
			});

			it("❌ should return 400 if nothing has change", async () => {
				const res = await request(app)
					.put(`/api/updateUser/${userId}`)
					.send({
						name: "Example",
						age: 30,
						email: "example@example.com",
						password: "Password@1234",
					});

				expect(res.statusCode).toBe(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe(
					"UPDATE FUNCTION: ANYTHING HAS CHANGED!"
				);
			});

			it("❌ should return 500 if an unexpected server error occurs", async () => {
				jest.spyOn(User, "findById").mockImplementation(() => {
					throw new Error("DB Error");
				});
				const res = await request(app)
					.put(`/api/updateUser/${userId}`)
					.send({
						name: "Whatever",
					});

				expect(res.statusCode).toBe(500);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toBe(
					"UPDATE FUNCTION: INTERNAL SERVER ERROR!"
				);
			});
		});
	});
});
