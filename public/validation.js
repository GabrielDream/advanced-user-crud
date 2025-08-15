//Validate name (at least 2 non-space chars)
function validateName(name) {
	if (typeof name !== "string") return false;
	return name.trim().length >= 2;
}

//Validate age as positive integer
function validateAge(age) {
	var n = Number(age);
	if (!Number.isInteger(n)) return false;
	if (n < 1) return false;
	if (n > 100) return false;
	return true;
}

// Validate email format (simple and practical)
function validateEmail(email) {
	if (typeof email !== "string") return false;
	var value = email.trim().toLowerCase();
	if (!value) return false;
	var rexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return rexEmail.test(value);
}

// Validate password strength (>=8, at least 1 lowercase, 1 uppercase, 1 special)
function validatePassword(password) {
	if (typeof password !== "string") return false;
	var value = password.trim();
	if (value.length < 8) return false;
	var rexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
	return rexPassword.test(value);
}




