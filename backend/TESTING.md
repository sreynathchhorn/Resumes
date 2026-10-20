# MNC Resume Studio — Test Flow

## 1. Backend

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

Use a MySQL database named `resume_portal_db` and update `.env` if needed. Do not use `migrate:fresh` on a database containing important data.

## 2. Postman

Test: `GET http://127.0.0.1:8000/api/jobs` — it should return seeded jobs.

Login: `POST http://127.0.0.1:8000/api/login` with `candidate@example.com` / `password`. Copy the token and use `Authorization: Bearer <token>` for protected requests.

## 3. Frontend

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, then test Register/Login → Dashboard → Jobs → Apply → My Applications → My Resume → Profile → Settings.
