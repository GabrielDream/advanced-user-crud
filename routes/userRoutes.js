const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();

// Importations:
const User = require('../model/User');
const {
	logInfo,
	logWarn,
	logError,
	logDebug,
	logSuccess,
	logData,
	logTimeStamp
} = require('../utils/logger');
const sanitizeUserInput = require('../utils/sanitize');
const AppError = require('../middlewares/AppError');


// -------------------------
// REGISTER USER
// -------------------------
router.post('/register', async (req, res, next) => {
	try {
		const sanitizedBody = sanitizeUserInput(req.body);

		let { name, age, email, password } = sanitizedBody;
		email = String(email || '').trim().toLowerCase();
		sanitizedBody.email = email;

		logDebug('📥 REGISTER REQUEST BODY: ', sanitizedBody);
		if (!name || !age || !email || !password) {
			logWarn('ALL FIELDS ARE REQUIRED!');
			throw new AppError(
				'ALL FIELDS NEED TO BE FILLED!',
				400,
				'all',
				'ERR_MISSING_FIELDS'
			);
		}

		if (typeof name !== 'string' || /\d/.test(name) || name.trim().length < 1) {
			throw new AppError(
				'ADD FUNCTION: INVALID NAME!',
				400,
				'NAME',
				'ERR_INVALID_NAME'
			);
		}

		const convertedAgeNumber = Number(age);
		if (!Number.isInteger(convertedAgeNumber) || Number.isNaN(convertedAgeNumber) || convertedAgeNumber < 1 || convertedAgeNumber > 100) {
			logWarn('INVALID AGE!');
			throw new AppError(
				'ADD FUNCTION: INVALID AGE!',
				400,
				'age',
				'ERR_INVALID_AGE'
			);
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			logWarn('EMAIL IN USE!');
			throw new AppError(
				'EMAIL ALREADY IN USE!',
				400,
				'EMAIL',
				'ERR_EMAIL_IN_USE'
			);
		}

		// Password has validated in User's schema.

		// Creating user:
		const newUser = new User(sanitizedBody);
		const { _id } = newUser;
		logDebug(`SANITIZED BODY => ${sanitizedBody}`);

		await newUser.save();

		logSuccess(`✅ NEW USER REGISTERED: Name: ${name}, Email: ${email}, Age: ${age}`);

		return res.success({
			statusCode: 201,
			message: 'SUCCESSFULLY REGISTERED!',
			data: {
				_id, name, email, age
			},
		});
	} catch (err) {
		logError('❌ ERROR IN REGISTER FUNCTION!');
		logError(err);
		console.error(err.stack);

		if (err instanceof AppError) return next(err);

		if (err.name === 'ValidationError') {
			const validationMessages = Object.values(err.errors).map(
				(e) => e.message
			);

			const validationError = new AppError(
				'VALIDATION FAILED!',
				400,
				'REGISTER',
				'ERR_MONGOOSE_VALIDATION',
				validationMessages
			);

			return next(validationError);
		}

		return next(
			new AppError(
				'UNEXPECTED ERROR IN REGISTER FUNCTION!',
				500,
				'REGISTER',
				'ERR_REGISTER_FAILED'
			)
		);
	}
});

// -------------------------
// CHECK USER
// -------------------------
router.get("/checkUsers", async (req, res, next) => {
	try {
		logDebug("📄 GETTING ALL USERS");

		const users = await User.find();

		logSuccess("✅ USERS FOUND!");
		logInfo("📄 SHOWING ALL USERS");

		if (users.length === 0) {
			return res.success({
				statusCode: 200,
				message: "CHECKUSER FUNCTION: NO USERS TO SHOWN",
				data: [],
			});
		}

		return res.success({
			statusCode: 200,
			message: "CHECKUSER FUNCTION: SUCCESSFULY SHOWN!",
			data: users,
		})

	} catch (err) {
		logError("❌ ERROR LISTING USERS:", err);

		if (err instanceof AppError) return next(err);

		return next(
			new AppError(
				"UNEXPECTED ERROR IN FETCHING USERS FUNCTION!",
				500,
				"CHECK_USER",
				"ERR_CHECKUSER_FAILED"
			)
		);
	}
});

// -------------------------
// DELETE USER
// -------------------------
router.delete("/deleteUser/:id", async (req, res, next) => {
	try {
		logDebug("🗑️ DELETE FUNCTION CALLED!");

		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			logWarn("❌ INVALID ID FORMAT!");
			throw new AppError(
				"INVALID USER ID!",
				400,
				"id",
				"ERR_INVALID_ID"
			);
		}

		const user = await User.findById(id);
		logInfo(`🗑️ DELETE USER ID: ${id}`);

		if (!user) {
			logWarn(`USER NOT FOUND! ID: ${id}`);
			throw new AppError(
				"USER NOT FOUND!",
				404,
				"id",
				"ERR_USER_NOT_FOUND"
			);
		}

		await User.findByIdAndDelete(id);
		logSuccess(`🗑️ USER DELETED!
			NAME: ${user.name},
			EMAIL: ${user.email},
			AGE: ${user.age}`);

		res.success({
			statusCode: 200,
			message: "SUCCESSFULLY DELETED!",
		});
	} catch (err) {
		logError("❌ DELETE ERROR:", err);


		if (err instanceof AppError) return next(err);

		return next(
			new AppError(
				"UNEXPECTED ERROR IN DELETE USERS FUNCTION!",
				500,
				"DELETE",
				"ERR_DELETE_FAILED"
			)
		);
	}
});

// -------------------------
// UPDATE USER
// -------------------------
router.put("/updateUser/:id", async (req, res, next) => {
	try {
		logDebug("♻️ UPDATE FUNCTION CALLED!");
		const { id } = req.params;

		// 1) Validate ID format first
		if (!mongoose.Types.ObjectId.isValid(id)) {
			logWarn("UPDATE FUNCTION: INVALID ID FORMAT!");
			throw new AppError(
				"UPDATE FUNCTION: INVALID USER ID FORMAT!",
				400,
				"id",
				"ERR_INVALID_ID"
			);
		}

		// 2) Find user before checking body emptiness
		const user = await User.findById(id);
		if (!user) {
			logWarn("USER NOT FOUND!");
			throw new AppError(
				"UPDATE FUNCTION : USER NOT FOUND",
				404,
				"id",
				"ERR_USER_NOT_FOUND"
			);
		}
		const sanitizedBody = sanitizeUserInput(req.body);
		let { name, age, email, password } = sanitizedBody;

		if (!name && age === undefined && !email && !password) {
			logWarn("UPDATE FUNCTION: AT LEAST ONE FIELD NEED TO BE FILLED!");
			throw new AppError(
				"UPDATE FUNCTION : AT LEAST ONE FIELD NEED TO BE FILLED!",
				404,
				"all",
				"ERR_NO_FIELDS_TO_UPDATE"
			);
		}

		if (name !== undefined) {
			if (typeof name !== "string" || /\d/.test(name) || name.trim().length < 1) {
				throw new AppError("UPDATE FUNCTION: INVALID NAME!", 400, "NAME", "ERR_INVALID_NAME");
			}
			name = name.trim();
			sanitizedBody.name = name;
		}

		if (email !== undefined && email !== null && email !== "") {
			const normalizedEmail = String(email).trim().toLowerCase();
			sanitizedBody.email = normalizedEmail;
			email = normalizedEmail;
		}

		if (age !== undefined) {
			if (age === "") {
				logWarn("UPDATE FUNCTION: INVALID AGE!");
				throw new AppError("UPDATE FUNCTION: INVALID AGE!", 400, "AGE", "ERR_INVALID_AGE");
			}
			const ageNum = Number(age);
			if (Number.isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum < 1 || ageNum > 100) {
				logWarn("UPDATE FUNCTION: INVALID AGE!");
				throw new AppError("UPDATE FUNCTION: INVALID AGE!", 400, "AGE", "ERR_INVALID_AGE");
			}
			sanitizedBody.age = ageNum;
			age = ageNum;
		}

		logInfo(`♻️ UPDATE REQUEST FOR ID: ${id}`);
		logInfo("📥 SANITIZED BODY:", sanitizedBody);

		let hasChange = false;

		if (name !== undefined && name !== user.name) {
			user.name = name;
			hasChange = true;
		}

		if (age !== undefined && age !== user.age) {
			user.age = age;
			hasChange = true;
		}

		if (email !== undefined && email && email !== user.email) {
			const existingEmail = await User.findOne({ email });
			if (existingEmail) {
				logWarn("UPDATE FUNCTION: EMAIL IS ALREADY IN USE!");
				throw new AppError(
					"UPDATE FUNCTION: EMAIL IS ALREADY IN USE!",
					400,
					"EMAIL",
					"ERR_EMAIL_IN_USE"
				);
			}
			user.email = email;
			hasChange = true;
		}

		if (password) {
			const isTheSamePassword = await bcrypt.compare(password, user.password);
			if (!isTheSamePassword) {
				const validPassword =
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(password);
				if (!validPassword) {
					logWarn("UPDATE FUNCTION: INVALID PASSWORD!");
					throw new AppError(
						"UPDATE FUNCTION: INVALID PASSWORD!",
						400,
						"PASSWORD",
						"ERR_INVALID_PASSWORD"
					);
				}
				user.password = password;
				hasChange = true;
			} else {
				logInfo("UPDATE FUNCTION: Password unchanged, no update needed.");
			}
		}

		if (!hasChange) {
			throw new AppError(
				"UPDATE FUNCTION: ANYTHING HAS CHANGED!",
				400,
				"ALL",
				"ERR_NO_CHANGES"
			);
		}

		await user.save();
		logSuccess(`♻️ USER UPDATED: ID: ${id}`);
		return res.success({
			statusCode: 200,
			message: "SUCCESSFULY UPDATED!",
		});

	} catch (err) {
		logError("ERROR IN UPDATE FUNCTION!");
		logError(err);
		console.error(err.stack);

		if (err instanceof AppError) return next(err);

		if (err.name === "ValidationError") {
			const validationMessages = Object.values(err.errors).map(e => e.message);
			logWarn("MONGOOSE VALIDATION ERROR:", validationMessages);
			const validationError = new AppError(
				"VALIDATION FAILED!",
				400,
				"UPDATE",
				"ERR_MONGOOSE_VALIDATION"
			);
			validationError.errors = validationMessages;
			return next(validationError);
		}

		if (err.name === "CastError" && err.path === "_id") {
			logWarn("UPDATE FUNCTION: INVALID ID FORMAT!");
			return next(
				new AppError(
					"UPDATE FUNCTION: INVALID USER ID FORMAT!",
					400,
					"id",
					"ERR_INVALID_ID"
				)
			);
		}

		return next(
			new AppError(
				"UPDATE FUNCTION: INTERNAL SERVER ERROR!",
				500,
				"UPDATE",
				"ERR_UPDATE_FAILED"
			)
		);
	}
});

module.exports = router;
