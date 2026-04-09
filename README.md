# Survey Application Frontend

<p align="center">
  React frontend for a role-based survey management platform.
</p>

<p align="center">
  <a href="https://survey-frontend-999y.onrender.com/"><img alt="Live on Render" src="https://img.shields.io/badge/Live-Render-2EA44F?style=for-the-badge"></a>
  <a href="https://github.com/manna-rajan/survey-backend"><img alt="Backend Repo" src="https://img.shields.io/badge/Backend-GitHub-24292F?style=for-the-badge"></a>
  <img alt="React" src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=000">
</p>

---

## Quick Links

- Live Frontend: https://survey-frontend-999y.onrender.com/
- Backend Repository: https://github.com/manna-rajan/survey-backend

## Navigation

- [Overview](#overview)
- [Role Features](#role-features)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [Routes](#routes)
- [Application Flow](#application-flow)

## Overview

The project supports two user roles:

- Admin: manages surveyers, reviews submissions, and tracks analytics.
- Surveyer: completes onboarding, submits surveys, and monitors status.

## Role Features

| Role | Capabilities |
|---|---|
| Admin | Sign up/sign in, add surveyers, send invitations, review pending surveys, accept/reject submissions, view dashboard analytics and monthly chart |
| Surveyer | Set password via invite link, sign in, submit move assessment surveys, view personal status metrics and accepted/rejected lists |

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React, React Router, Axios, Bootstrap 5, Nivo Bar Charts, React Icons |
| Backend | Node.js, Express, MongoDB, Mongoose, bcrypt, crypto, Resend, dotenv |

## Local Setup

### Prerequisites

- Node.js 14+
- npm
- MongoDB (local or Atlas)
- Resend API key

### Backend

1. Open the backend folder:

```bash
cd survey-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create survey.env and configure:

```env
MONGO_URL=mongodb://localhost:27017/surveyapp
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
PORT=3001
FRONTEND_URL=http://localhost:3000
```

4. Start the backend:

```bash
node app.js
```

Backend runs on http://localhost:3001 by default.

### Frontend

1. Open the frontend folder:

```bash
cd survey-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create .env and configure:

```env
REACT_APP_BACKEND_URL=http://localhost:3001
```

4. Start the frontend app:

```bash
npm start
```

Frontend runs on http://localhost:3000.

## Routes

| Area | Paths |
|---|---|
| Public | / |
| Surveyer | /surveyer/signin, /surveyer/set-password, /surveyer/dashboard, /surveyer/new-survey |
| Admin | /admin/signin, /admin/signup, /admin/dashboard, /admin/add-surveyer, /admin/review |

## Application Flow

1. Admin signs up or signs in.
2. Admin adds a surveyer and sends an invitation.
3. Surveyer sets password using the invitation link.
4. Surveyer signs in and submits a survey.
5. Admin reviews the pending survey.
6. Admin accepts or rejects the submission.
7. Dashboards update with latest statuses and analytics.
