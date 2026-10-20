# MNC Resume Studio — Laravel 12 Backend

This backend powers the React frontend through REST APIs.

## Main API flow
React/Axios → Laravel API → MySQL → JSON → React UI

## Candidate API
- POST `/api/register`
- POST `/api/login`
- POST `/api/logout`
- GET `/api/user`
- GET/PUT `/api/profile`
- GET `/api/jobs`
- GET `/api/jobs/{id}`
- GET `/api/my-applications`
- POST `/api/applications`

## Admin API
Admin role is checked on every `/api/admin/*` request.
- GET `/api/admin/dashboard`
- GET `/api/admin/users`
- DELETE `/api/admin/users/{id}`
- GET `/api/admin/jobs`
- GET `/api/admin/applications`
- GET `/api/admin/activity`
- POST/PUT/DELETE `/api/jobs*` are also admin-only
- PATCH `/api/applications/{id}` is admin-only

## Activity logging
The system records registration, login, logout, job management, application submission, and application status changes in `activity_logs`.

## Setup
1. Copy `.env.example` to `.env`.
2. Set MySQL database to `resume_portal_db` (or your own database).
3. Run `composer install`.
4. Run `php artisan key:generate`.
5. Run `php artisan migrate:fresh --seed` on a TEST database.
6. Run `php artisan storage:link`.
7. Run `php artisan serve`.

Seeded admin:
- Email: `admin@example.com`
- Password: `password`

Seeded candidate:
- Email: `candidate@example.com`
- Password: `password`

Do not use seeded passwords in a real production system.
