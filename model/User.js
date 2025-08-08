const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
	age: {
		type: Number,
		required: [true, 'Age is required!'],
		min: [1, 'Age must be at least 1'],
		validate: {
			validator: Number.isInteger,
			message: 'Age must be a number!',
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
	password: {
		type: String,
		required: true,
		validate: {
			validator(index) {
				return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(
					index
				);
			},
			message: (props) => 'Password requires at least 8 characters, with at least one upcase, a lowercase and a special character! Oss',
		}
	}
}, { strict: 'throw' });

// Removing password of Json body:
userSchema.set('toJSON', {
	transform(doc, ret) { // 2 parameters required by default,
		delete ret.password;
		return ret;
	}
});

// Hashin PASSWORD:
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const newPassword = await bcrypt.hash(this.password, 10);

		this.password = newPassword;
		next();
	} catch (err) {
		next(err);
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
