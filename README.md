# 🧠 Advanced User CRUD with Custom Validation and Automated Testing

🔎 **Purpose:** Showcase strong backend skills with a clean, production‑ready Node.js API.

✅ Highlights:

* 🔹 Clean code & modular structure
* 🔹 Manual, rule‑driven validation *(no Joi)*
* 🔹 Custom error handling with `AppError` + global `errorHandler`
* 🔹 Full test coverage with Jest + Supertest
* 🔹 Solid stack: **Node.js + Express + MongoDB (Mongoose)**

🔗 **Live API (base):** `https://advanced-user-crud.onrender.com/api`
🔗 **Repository:** [https://github.com/GabrielDream/advanced-user-crud](https://github.com/GabrielDream/advanced-user-crud)

---

## 📦 Technologies and Tools Used

* 🧰 Node.js
* 🚏 Express
* 🗄️ MongoDB + Mongoose
* 🧩 Custom Middlewares:

  * ⚙️ `res.success`
  * 🚨 `AppError` class
  * 🛡️ Global `errorHandler`
* 🧪 Jest + Supertest
* 🔐 dotenv/bcrypt
* 🎨 chalk (styled logging)
* 🧼 `sanitizeUserInput` (security utility)
* 📨 Postman (manual tests)
* ✅ Linter

---

## 📂 API Routes (base path: `/api`)

| Method | Route                | Description                         |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/checkEmail/:email` | Check if email is already in use    |
| POST   | `/register`          | Register a new user with validation |
| GET    | `/checkUsers`        | List all users                      |
| DELETE | `/deleteUser/:id`    | Delete user by ID                   |
| PUT    | `/updateUser/:id`    | Update user fields                  |

---

## 🧪 Automated Testing

* 🔎 Coverage includes:

  * ❌ Malformed ID
  * ⚠️ Invalid inputs
  * 🔁 Duplicate emails
  * 🗒️ No data change
  * 🔑 Weak passwords
* 🎯 Each test asserts specific error/success messages for precision.

---

## ❗ Why Manual Validation Instead of Joi?

* 🎛️ Total control over logic, flow, and messaging
* 🔌 Seamless fit with custom error structures (`AppError`)
* 🛡️ Useful for restricted environments (fintech, medical, security)
* 🧠 Demonstrates defensive backend programming

> “I know how to use Joi, but in this project I chose manual validation to guarantee full control over business rules and error flow.”

---

## ▶️ How to Run This Project

### 1) 📡 Use the deployed API (no setup)

* 🔗 **Base URL:** `https://advanced-user-crud.onrender.com/api`
  *(First request can be slower due to cold start.)*

**Quick examples**

```bash
# List users (deployed)
curl https://advanced-user-crud.onrender.com/api/checkUsers

# Register a user (deployed)
curl -X POST https://advanced-user-crud.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","age":27,"email":"ana@mail.com","password":"Aa!12345"}'
```

### 2) 🖥️ Run locally

**Prereqs:** Node 18+ and npm. Run with **MongoDB Atlas** (no local DB) or **Local MongoDB**.

**2.1 – Clone & install**

```bash
git clone https://github.com/GabrielDream/advanced-user-crud.git
cd advanced-user-crud
npm install
```

**2.2 – Run with MongoDB Atlas**

```bash
# macOS / Linux
ATLAS_MONGO_URI="mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/<DB>?retryWrites=true&w=majority&appName=<APP>" \
USE_LOCAL_DB=false \
PORT=3051 \
npm start
```

```powershell
# Windows (PowerShell)
$env:ATLAS_MONGO_URI="mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/<DB>?retryWrites=true&w=majority&appName=<APP>";
$env:USE_LOCAL_DB="false";
$env:PORT="3051";
npm start
```

**2.3 – Run with Local MongoDB** *(ensure MongoDB is running)*

```bash
# macOS / Linux
USE_LOCAL_DB=true \
LOCAL_MONGO_URI="mongodb://127.0.0.1:27017/AdvancedCrud" \
PORT=3051 \
npm start
```

```powershell
# Windows (PowerShell)
$env:USE_LOCAL_DB="true";
$env:LOCAL_MONGO_URI="mongodb://127.0.0.1:27017/AdvancedCrud";
$env:PORT="3051";
npm start
```

* 🏠 **Local API base:** `http://localhost:3051/api`
* 🛠️ **Render note:** do not set `PORT` on Render; it injects the port automatically.

---

🙌 Pull requests, forks and feedback are welcome. OSSS 💻🥷
🪄 The frontend README is available in `/public/README.md`.
