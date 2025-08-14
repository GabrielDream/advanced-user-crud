// ==== CONFIG ====
const BASE_URL = `${window.location.origin}/api`;

// -------------------------
// CHECK EMAIL
// -------------------------
async function checkEmailExists(email) {
  const data = await safeFetch(BASE_URL + "/api/checkEmail/" + encodeURIComponent(email), {}, {
    showLoading: false,
    onError: function () { console.warn("Failed to check email."); }
  });
  return (data && typeof data.exists === "boolean") ? data.exists : false;
}

// -------------------------
// REGISTER
// -------------------------
async function registerUser(event) {
  event.preventDefault();

  var name = document.getElementById('name').value.trim();
  var age = document.getElementById('age').value.trim();
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value.trim();

  if (!name || !age || !email || !password) return alert("ALL FIELDS NEED TO BE FILLED!");

  if (typeof validateName === "function" && !validateName(name)) return alert("INVALID NAME!");
  if (typeof validateAge === "function" && !validateAge(age)) return alert("INVALID AGE!");

  if (typeof validateAge !== "function") {
    var ageNumberQuick = Number(age);
    if (!Number.isInteger(ageNumberQuick) || ageNumberQuick < 1 || ageNumberQuick > 100) return alert("INVALID AGE!");
  }
  var ageNumber = Number(age);

  if (!validateEmail(email)) return alert("INVALID EMAIL FORMAT!");
  if (!validatePassword(password)) return alert("INVALID PASSWORD!");

  var emailExists = await checkEmailExists(email);
  if (emailExists) return alert("EMAIL IS ALREADY IN USE!");

  await safeFetch(BASE_URL + "/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, age: ageNumber, email: email, password: password })
  }, {
    onSuccess: function () {
      alert("USER REGISTERED!");
      userList();
      document.getElementById('name').value = "";
      document.getElementById('age').value = "";
      document.getElementById('email').value = "";
      document.getElementById('password').value = "";
    },
    onError: function (err) {
      console.warn("Registration Failed:", err && err.message ? err.message : err);
    }
  });
}

// -------------------------
// LIST
// -------------------------
async function userList () {
  const resp = await safeFetch(BASE_URL + "/api/checkUsers", {}, {
    showLoading: false,
    wantAlert: false,
    onError: function () { console.warn("FAILED TO LOAD USERS!"); }
  });

  if (!resp) return;

  // novo formato: { data: [...] } | legado: [...]
  const users = Array.isArray(resp) ? resp : resp.data;

  if (!Array.isArray(users)) {
    console.warn("Resposta inesperada de /checkUsers:", resp);
    return;
  }

  const listEl = document.getElementById('userList');
  listEl.innerHTML = "";

  users.forEach(function (user) {
    const li = document.createElement('li');
    li.textContent = user.name + " - " + user.age + " - " + user.email;

    const delButton = document.createElement('button');
    delButton.textContent = "DELETE!";
    delButton.onclick = function () { deleteUser(user._id); };

    const updButton = document.createElement('button');
    updButton.textContent = "UPDATE!";
    updButton.onclick = function () {
      updateUser(user._id, user.name, user.age, user.email); // ❌ não passar password
    };

    listEl.appendChild(li);
    li.appendChild(delButton);
    li.appendChild(updButton);
  });
}

// -------------------------
// DELETE
// -------------------------
async function deleteUser(id) {
  if (!confirm("DELETE THIS?")) return;

  await safeFetch(BASE_URL + "/api/deleteUser/" + encodeURIComponent(id), { method: 'DELETE' }, {
    onSuccess: function (data) {
      alert(data && data.message ? data.message : "USER DELETED!");
      userList();
    },
    onError: function (err) {
      console.error("DELETE FAILED", err && err.message ? err.message : err);
      alert("FAILED TO DELETE USER!");
    }
  });
}

// -----------------------
// DELETE BY ID
// -----------------------
// -----------------------
// DELETE BY ID (usa a rota existente /deleteUser/:id)
// -----------------------
async function deleteById() {
  var idInput = document.getElementById("deleteById").value.trim();
  if (!idInput) return alert("PUT A VALID ID!");

  // (opcional) valida formato de ObjectId para evitar 400 desnecessário
  var isHex24 = /^[a-fA-F0-9]{24}$/.test(idInput);
  if (!isHex24) return alert("INVALID ID FORMAT!");

  if (!confirm("DELETE USER WITH ID " + idInput + "?")) return;

  await safeFetch(BASE_URL + "/api/deleteUser/" + encodeURIComponent(idInput), {
    method: 'DELETE'
  }, {
    onSuccess: function (data) {
      alert(data && data.message ? data.message : "USER DELETED BY ID!");
      userList();
      document.getElementById('deleteById').value = "";
    },
    onError: function (err) {
      console.error("DELETE FAILED!", err && err.message ? err.message : err);
      alert("ERROR TO DELETE USER BY ID!");
    }
  });
}

// -------------------------
// UPDATE
// -------------------------
async function updateUser(usersId, currentName, currentAge, currentEmail) {
  var existingDiv = document.querySelector('.upd-div');
  if (existingDiv) return alert("THERE'S AN UPDATING BEING MADE!");

  // Inputs
  var nameInput = document.createElement('input');
  nameInput.type = "text";
  nameInput.value = currentName;

  var ageInput = document.createElement('input');
  ageInput.type = "number";
  ageInput.value = currentAge;

  var emailInput = document.createElement('input');
  emailInput.type = "email";
  emailInput.value = currentEmail;

  var passwordInput = document.createElement('input');
  passwordInput.type = "password";
  passwordInput.placeholder = "new password";

  var updNowButton = document.createElement('button');
  updNowButton.textContent = "UPDATE NOW!";

  var cancelUpdate = document.createElement('button');
  cancelUpdate.textContent = "CANCEL UPDATE!";

  // Overlay + container
  var overlay = document.createElement('div');
  overlay.classList.add('overlay');

  var newDiv = document.createElement('div');
  newDiv.classList.add('upd-div', 'fadeSlideIn');

  newDiv.appendChild(nameInput);
  newDiv.appendChild(ageInput);
  newDiv.appendChild(emailInput);
  newDiv.appendChild(passwordInput);
  newDiv.appendChild(updNowButton);
  newDiv.appendChild(cancelUpdate);

  overlay.appendChild(newDiv);
  document.body.appendChild(overlay);

  var escClose = function (e) {
    if (e.key === 'Escape') {
      newDiv.classList.remove('fadeSlideIn');
      newDiv.classList.add('fadeSlideOut');
      newDiv.addEventListener('animationend', function () {
        overlay.remove();
        document.removeEventListener('keydown', escClose);
      }, { once: true });
    }
  };
  document.addEventListener('keydown', escClose);

  cancelUpdate.onclick = function () {
    newDiv.classList.remove('fadeSlideIn');
    newDiv.classList.add('fadeSlideOut');
    newDiv.addEventListener('animationend', function () {
      overlay.remove();
      document.removeEventListener('keydown', escClose);
    }, { once: true });
  };

  overlay.onclick = function (e) {
    if (e.target === overlay) {
      newDiv.classList.remove('fadeSlideIn');
      newDiv.classList.add('fadeSlideOut');
      newDiv.addEventListener('animationend', function () {
        overlay.remove();
        document.removeEventListener('keydown', escClose);
      }, { once: true });
    }
  };

  // Update action
  updNowButton.onclick = async function () {
    var newName = nameInput.value.trim();
    var newAge = ageInput.value.trim();
    var newEmail = emailInput.value.trim();
    var newPassword = passwordInput.value.trim();
    var ageNumber = newAge ? Number(newAge) : NaN;

    if (!newName && isNaN(ageNumber) && !newEmail && !newPassword) {
      alert("At least one field must be filled!");
      return;
    }

    // Age validation
    if (newAge) {
      if (typeof validateAge === "function") {
        if (!validateAge(newAge)) return alert("INVALID AGE!");
      } else {
        if (!isNaN(ageNumber) && ageNumber < 1) return alert("INVALID AGE!");
      }
    }

    // Email format + existência só se mudou
    if (newEmail && newEmail !== currentEmail) {
      if (!validateEmail(newEmail)) return alert("INVALID EMAIL FORMAT!");
      var exists = await checkEmailExists(newEmail);
      if (exists) return alert("EMAIL IN USE!");
    }

    if (newPassword && !validatePassword(newPassword)) return alert("INVALID PASSWORD FORMAT!");

    var updateData = {};
    if (newName && newName !== currentName) updateData.name = newName;
    if (!isNaN(ageNumber) && ageNumber !== currentAge) updateData.age = ageNumber;
    if (newEmail && newEmail !== currentEmail) updateData.email = newEmail;
    if (newPassword) updateData.password = newPassword;

    if (Object.keys(updateData).length === 0) {
      alert("NOTHING HAS CHANGED!");
      return;
    }

    try {
      await safeFetch(BASE_URL + "/api/updateUser/" + encodeURIComponent(usersId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      }, {
        onSuccess: function () {
          alert("✅ USER SUCCESSFULLY UPDATED!");
          overlay.remove();
          document.removeEventListener('keydown', escClose);
          userList();
        },
        onError: function (err) {
          console.log("❌ Update failed:", err && err.message ? err.message : err);
        }
      });
    } catch (err) {
      alert("❌ Update failed: " + (err && err.message ? err.message : err));
    }
  };
}

// Run once on load
userList();
