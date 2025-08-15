# Frontend – Advanced User CRUD (Vanilla HTML/CSS/JS)

A minimal, framework-free UI for the Advanced User CRUD API. Clean UX, client-side validation, and robust API calls via a tiny `safeFetch` wrapper.

**Live UI:** [https://advanced-user-crud.onrender.com/](https://advanced-user-crud.onrender.com/)
**API base:** [https://advanced-user-crud.onrender.com/api](https://advanced-user-crud.onrender.com/api)
**Backend repo:** [https://github.com/GabrielDream/advanced-user-crud](https://github.com/GabrielDream/advanced-user-crud)

---

## What’s inside

* Vanilla **HTML/CSS/JS** (no frameworks)
* `safeFetch` (timeout, loading overlay, unified error handling)
* Client-side validation (name, age, email, password strength, ObjectId check)
* Responsive dark/neon theme + modal for updates

## Endpoints consumed

| Method | Route                | Description                         |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/checkUsers`        | List all users                      |
| GET    | `/checkEmail/:email` | Check if an email is already in use |
| POST   | `/register`          | Register a new user                 |
| DELETE | `/deleteUser/:id`    | Delete by ID                        |
| PUT    | `/updateUser/:id`    | Update user fields                  |

## Files (quick map)

```
public/
├─ index.html             # Main UI
├─ style.css              # Dark theme, responsive, modal animations
├─ fetch.js               # safeFetch (timeout, overlay, error handling)
├─ validation.js          # Client-side validation rules
└─ mainRequisitions.js    # CRUD requests + DOM integration
```

## Configuration

Set the API base URL in `mainRequisitions.js`:

```js
// mainRequisitions.js
const BASE_URL = 'https://advanced-user-crud.onrender.com/api';
// For local backend:
// const BASE_URL = 'http://localhost:3051/api';
```

<details>
<summary>Optional: run locally</summary>

Use any static server or open `public/index.html` directly.

**Node 18+**

```bash
npx http-server public -p 8080
# Browser: http://localhost:8080
```

Ensure the backend is running and `BASE_URL` points to it.

</details>

---

PRs and feedback are welcome.
