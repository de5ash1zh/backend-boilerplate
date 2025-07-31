Here’s the **complete `README.md` content** including everything in one professionally formatted markdown file.

---

````markdown
# 🔐 Secure User Authentication API (Node.js + MongoDB)

This project is a boilerplate backend setup for building a secure, maintainable, and scalable authentication system using **Node.js**, **Express**, and **MongoDB**. It supports user registration, email verification, and secure password handling using modern development practices.

---

## 📦 Dependencies

### Installed Packages

- **[express](https://expressjs.com/)**: Lightweight web framework for routing and middleware.
- **[mongoose](https://mongoosejs.com/)**: MongoDB ODM for schema-based data modeling.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Loads environment variables from `.env` file.
- **[cors](https://www.npmjs.com/package/cors)**: Middleware to enable Cross-Origin Resource Sharing.
- **[nodemon](https://www.npmjs.com/package/nodemon)** _(dev dependency)_: Auto-restarts server on file changes.

### `package.json` Highlights

- Scripts include:
  ```json
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
  ```
````

---

## ⚙️ Environment Configuration

### `.env` File

Stores environment-specific secrets and variables:

```env
PORT=5000
MONGO_URL=your_mongo_connection_string
BASE_URL=http://localhost:3000
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_username
SMTP_PASS=your_password
```

### `.env.sample`

A template for `.env` to ensure consistency across environments.

---

## 🗄️ MongoDB Database Setup

### `db.js` Utility

Handles database connection logic with:

- `mongoose.connect()`
- Success & error logging
- Configurable connection options (e.g., retries, pool size)

---

## 👤 User Model

### `User.model.js`

Defines schema fields:

| Field                  | Type    | Required | Description                                  |
| ---------------------- | ------- | -------- | -------------------------------------------- |
| `name`                 | String  | ✅       | User's full name                             |
| `email`                | String  | ✅       | Unique email for login                       |
| `password`             | String  | ✅       | Hashed before storage                        |
| `role`                 | String  | ❌       | e.g., "admin", "user" (optional)             |
| `isVerified`           | Boolean | ❌       | Email verification status (default: `false`) |
| `verificationToken`    | String  | ❌       | Token used for verifying email               |
| `resetPasswordToken`   | String  | ❌       | Token for password reset                     |
| `resetPasswordExpires` | Date    | ❌       | Expiration time for reset token              |

### Schema Options

- `timestamps: true` → Adds `createdAt` and `updatedAt` automatically.

---

## 🔑 Password Hashing (Pre-save Hook)

### Why?

- Never store plaintext passwords.
- Hashing protects user data even if DB is compromised.

### How?

```js
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

- `this.isModified("password")`: Prevents re-hashing on unrelated updates.
- `bcrypt.hash()`: Securely hashes password with salt.

---

## 👥 User Registration Controller

### `registerUser` Flow

1. **Extract Input**:

   - From `req.body`: `{ name, email, password }`

2. **Validate**:

   - Ensures all fields are provided

3. **Check Duplicate**:

   - `User.findOne({ email })` → If exists, return 400 error

4. **Create User**:

   - Uses `User.create()`
   - Password gets hashed via pre-save hook

5. **Generate Verification Token**:

   ```js
   const token = crypto.randomBytes(32).toString("hex");
   ```

6. **Save Token** to user record
7. **Send Verification Email** via **nodemailer**
8. **Respond** with success message

---

## ✅ Email Verification Logic

### `verifyUser` Flow

1. Extract `token` from URL params
2. Find user by `verificationToken`
3. If found:

   - Set `isVerified = true`
   - Remove `verificationToken`
   - Save user

4. Respond with verification success

---

## 🧭 Routing Setup

### `user.routes.js`

| Method | Route            | Description          |
| ------ | ---------------- | -------------------- |
| `POST` | `/register`      | Registers a new user |
| `GET`  | `/verify/:token` | Verifies user email  |

---

## 🚀 Server Initialization (`index.js`)

### Responsibilities:

- Import and configure:

  - Express app
  - Middleware (`cors`, `express.json()`, `urlencoded`)
  - Environment variables
  - Database connection (`db.js`)

- Register routes:

  ```js
  app.use("/api/v1/users", userRoutes);
  ```

- Start server:

  ```js
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  ```

---

## 📥 Request Object Overview

| Property      | Description                                   |
| ------------- | --------------------------------------------- |
| `req.body`    | Incoming data from POST requests              |
| `req.query`   | Query parameters from URL (e.g., `?search=1`) |
| `req.params`  | Dynamic URL segments (`/user/:id`)            |
| `req.cookies` | Cookies (requires cookie-parser)              |

---

## 🛡️ Security Best Practices

- ✅ Use `.env` for sensitive data
- ✅ Never store plain passwords
- ✅ Use high-entropy tokens with `crypto`
- ✅ Handle errors gracefully
- ✅ Optional: Implement token expiry fields
- ✅ Use `Joi` or `Zod` for strong validation (recommended)

---

## 🧠 Mongoose Pre-save Explained

### 🔁 Lifecycle Hook

```js
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

- Triggers before saving user to DB
- Hashes password only when modified
- `next()` continues execution

### ⚠️ Notes

- Doesn’t trigger on:

  - `updateOne()`
  - `findByIdAndUpdate()`

- For those, use custom logic or Mongoose post hooks.

---

## 🔐 JWT Token Generation

```js
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  {
    expiresIn: "24h",
  }
);
```

### Breakdown

| Part       | Purpose                              |
| ---------- | ------------------------------------ |
| Payload    | `{ id, role }` → Identifies the user |
| Secret     | `.env`-protected string for signing  |
| Expiration | Token lifetime (`24h`, `7d`, etc.)   |

### Flow

1. Token created on login
2. Sent to client
3. Included in `Authorization` header on future requests
4. Verified using `jwt.verify()` on server

---

## 📄 Sample JWT Format

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Header**
- **Payload**
- **Signature**

---

## 🧪 JWT Use Cases

| Action                | Token Required |
| --------------------- | -------------- |
| Access private routes | ✅             |
| Login/Register        | ❌             |
| Reset password        | ✅ (via email) |

---

## 📁 Project Structure

```
.
├── controllers/
│   └── user.controller.js
├── models/
│   └── User.model.js
├── routes/
│   └── user.routes.js
├── config/
│   └── db.js
├── index.js
├── .env
├── .env.sample
├── package.json
└── README.md
```

---

## 📬 Want to Add Login or Password Reset?

Let me know! I can walk you through:

- JWT token verification using `jwt.verify()`
- Building secure login endpoints
- Implementing password reset flows

---

## ✅ To Get Started

1. Clone the repo
2. Run `npm install`
3. Setup `.env` using `.env.sample`
4. Start dev server:

   ```bash
   npm run dev
   ```

5. Register a user and check your email!

---

## 🛠️ Future Enhancements

- ✅ Email verification ✅
- ⏳ Login & JWT auth
- ⏳ Forgot/reset password
- ⏳ Role-based access control
- ⏳ Rate limiting / brute-force protection
- ⏳ Unit & integration tests

---

**Built with 💙 by Developers, for Developers.**

```

---
```
