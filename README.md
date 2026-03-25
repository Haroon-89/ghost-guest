# Ghost-Guest — Digital Estate & Subscription Manager

A full-stack web app that securely stores your digital accounts and automatically releases them to a trusted legacy contact if you go inactive.

---

## Project Structure

```
GHOST_GUEST/
├── be/               # Backend — Node.js, Express, MongoDB
├── fe_user/          # User Frontend — React + Vite
├── fe_admin/         # Admin Frontend — (coming soon)
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Backend   | Node.js, Express.js, MongoDB (Mongoose)   |
| Auth      | JWT + bcryptjs                            |
| Encryption| AES-256-CBC (Node.js `crypto`)            |
| Scheduler | node-cron                                 |
| Email     | Nodemailer (Gmail)                        |
| Frontend  | React 19, Vite, React Router, Axios       |

---

## Getting Started

### 1. Backend

```bash
cd be
npm install
npm run dev
```

Create `be/.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=exactly_32_characters_long_here!
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
SWITCH_MONTHS=3
```

> `ENCRYPTION_KEY` must be exactly 32 characters.
> Use a Gmail App Password, not your regular password.

---

### 2. User Frontend

```bash
cd fe_user
npm install
npm run dev
```

Runs on `http://localhost:5173` by default.

---

## Features

- Register / Login with JWT auth
- Encrypted vault (AES-256) for subscriptions, social, banking, photos
- Set a legacy contact who receives your vault if you go inactive
- Dead Man's Switch — daily cron job sends up to 3 verification emails, then releases vault
- Magic link to confirm you're still alive
- Admin panel to manage users and manually release vaults

---

## API Routes

| Method | Route                          | Access        | Description                  |
|--------|--------------------------------|---------------|------------------------------|
| POST   | /api/auth/register             | Public        | Register new user            |
| POST   | /api/auth/login                | Public        | Login, returns JWT           |
| GET    | /api/auth/me                   | Protected     | Get current user profile     |
| GET    | /api/auth/verify-alive/:token  | Public        | Magic link to reset activity |
| POST   | /api/vault                     | Protected     | Add vault item               |
| GET    | /api/vault                     | Protected     | Get all vault items          |
| PUT    | /api/vault/:id                 | Protected     | Update vault item            |
| DELETE | /api/vault/:id                 | Protected     | Delete vault item            |
| POST   | /api/legacy                    | Protected     | Set legacy contact           |
| GET    | /api/admin/users               | Admin only    | Get all users                |
| GET    | /api/admin/users/:id           | Admin only    | Get user + vault items       |
| PUT    | /api/admin/users/:id/release   | Admin only    | Manually release vault       |
| GET    | /api/admin/notifications       | Admin only    | Get all notifications        |
