# 🎓 LearnHub — Full-Stack LMS Platform

> A Learning Management System built with the **MERN stack** (MongoDB · Express · React · Node.js), fully containerised with **Docker** for one-command setup.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Option A — Docker (Recommended)](#-option-a--docker-recommended)
  - [Development](#development-hot-reload)
  - [Production](#production-nginx--optimised-build)
- [Option B — Local Setup (Without Docker)](#-option-b--local-setup-without-docker)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Common Docker Commands](#-common-docker-commands)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🧑‍🎓 Student
- Browse & search/filter courses by category and level
- Enroll in courses with one click
- Watch video lectures in a full-screen player with sidebar navigation
- Auto-resume from last watched lecture
- Mark lectures complete (manually or automatically on video end)
- Track progress with a live percentage bar
- Download PDF notes per lecture
- Completion certificate displayed at 100%

### 👨‍🏫 Instructor
- Create courses with thumbnail, price, level, and category
- Organise content into Sections → Lectures
- Upload video (up to 500 MB) and PDF per lecture
- Edit or delete courses, sections, and lectures
- Analytics dashboard (students enrolled, revenue, ratings)

### 🎨 UI / UX
- Dark / Light mode toggle (persisted across sessions)
- Fully responsive — works on mobile, tablet, and desktop
- Loading skeleton screens
- Toast notifications for all actions

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router 6, Axios, React Toastify |
| **Backend** | Node.js 20, Express 4, Mongoose 8 |
| **Database** | MongoDB 7 |
| **Auth** | JWT (30-day tokens), bcryptjs (12 rounds) |
| **Uploads** | Multer → local `uploads/` directory |
| **Container** | Docker, Docker Compose, Nginx |

---

## 📁 Project Structure

```
lms/
├── docker-compose.yml          ← Development (hot-reload)
├── docker-compose.prod.yml     ← Production (Nginx + optimised build)
│
├── backend/
│   ├── Dockerfile              ← Production image
│   ├── Dockerfile.dev          ← Development image (nodemon)
│   ├── .env.example            ← Template for environment variables
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/                ← Stored files (gitignored)
│   └── server.js
│
└── frontend/
    ├── Dockerfile              ← Multi-stage: Vite build → Nginx (~30 MB)
    ├── Dockerfile.dev          ← Development image (Vite HMR)
    ├── nginx.conf              ← Proxies /api & /uploads → backend
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/
        └── pages/
            ├── public/         ← Home, Courses, CourseDetail, Login, Register
            ├── student/        ← Dashboard, MyCourses, WatchCourse
            └── instructor/     ← Dashboard, CreateCourse, ManageCourses, UploadLectures
```

---

## 🔧 Prerequisites

Choose the path that suits you:

| Requirement | Docker path | Local path |
|---|---|---|
| [Docker Desktop](https://docs.docker.com/get-docker/) ≥ 24 | ✅ Required | ❌ Not needed |
| [Docker Compose](https://docs.docker.com/compose/) plugin | ✅ Required (bundled with Desktop) | ❌ Not needed |
| Node.js ≥ 20 | ❌ Not needed | ✅ Required |
| MongoDB ≥ 7 (local or Atlas) | ❌ Not needed (included in Docker) | ✅ Required |
| Git | ✅ | ✅ |

---

## 🐳 Option A — Docker (Recommended)

The quickest way to run the entire stack (frontend + backend + MongoDB) with **zero manual setup**.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/lms.git
cd lms
```

### 2. Create the backend environment file

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set your `JWT_SECRET` to a long random string.  
Everything else is pre-configured to work with Docker out of the box.

```bash
# Generate a secure secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Development (hot-reload)

Starts Vite dev server + Nodemon + MongoDB. **Any code change** in `frontend/src` or `backend/` will instantly reflect in the browser.

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| 🌐 Frontend (Vite) | http://localhost:5173 |
| ⚙️ Backend (Express) | http://localhost:5000 |
| 🍃 MongoDB | localhost:27017 |

> **First run?** Docker will pull the base images and install all npm dependencies inside the containers. This takes ~2–3 minutes. Subsequent starts are near-instant.

To run in the background (detached):
```bash
docker compose up --build -d
```

To stop:
```bash
docker compose down
```

---

### Production (Nginx + optimised build)

Builds an optimised React bundle, serves it via Nginx on port **80**, and keeps MongoDB **off** the public network.

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

| Service | URL |
|---|---|
| 🌐 App (Nginx) | http://localhost |
| 🍃 MongoDB | Internal only (not exposed) |

> **How it works:** Nginx serves the static React build on port 80. All requests to `/api/*` and `/uploads/*` are reverse-proxied to the backend container — the backend is never directly exposed.

To stop:
```bash
docker compose -f docker-compose.prod.yml down
```

---

## 💻 Option B — Local Setup (Without Docker)

Use this if you prefer to run services directly on your machine.

### Step 1 — Clone

```bash
git clone https://github.com/your-username/lms.git
cd lms
```

### Step 2 — Backend

```bash
cd backend

# Install dependencies
npm install

# Create and configure environment file
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET (see Environment Variables below)

# Create the uploads directory
mkdir -p uploads

# Start development server (nodemon)
npm run dev
```

Backend runs at: **http://localhost:5000**

### Step 3 — Frontend

Open a **new terminal tab**:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Step 4 — MongoDB

Make sure MongoDB is running locally:

```bash
# macOS/Linux (with Homebrew)
brew services start mongodb-community

# or start mongod directly
mongod --dbpath /usr/local/var/mongodb
```

Or use [MongoDB Atlas](https://www.mongodb.com/atlas) and set your `MONGO_URI` to the connection string from Atlas.

---

## 🔑 Environment Variables

All backend configuration lives in `backend/.env`. Copy from the template:

```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `MONGO_URI` | `mongodb://localhost:27017/lms` | MongoDB connection string (auto-overridden in Docker) |
| `JWT_SECRET` | *(must set)* | Secret for signing JWT tokens — use a long random string |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Comma-separated list of allowed CORS origins |

> ⚠️ **Never commit `backend/.env`** — it is listed in `.gitignore`.

**Generating a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user (`name`, `email`, `password`, `role`) |
| `POST` | `/api/auth/login` | ❌ | Login and receive a JWT token |
| `GET` | `/api/auth/profile` | ✅ | Get the authenticated user's profile |
| `PUT` | `/api/auth/profile` | ✅ | Update name, bio, or profile image |

### Courses

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/courses` | ❌ | — | List all published courses (supports `?search=`, `?category=`, `?level=`) |
| `GET` | `/api/courses/:id` | ❌ | — | Get full course with sections and lectures |
| `GET` | `/api/courses/instructor/my` | ✅ | instructor | Get the logged-in instructor's courses |
| `POST` | `/api/courses` | ✅ | instructor | Create a new course (multipart/form-data with `thumbnail`) |
| `PUT` | `/api/courses/:id` | ✅ | instructor | Update course details |
| `DELETE` | `/api/courses/:id` | ✅ | instructor | Delete a course |

### Lectures & Sections

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/lectures/section` | ✅ instructor | Create a section in a course |
| `PUT` | `/api/lectures/section/:id` | ✅ instructor | Update a section title |
| `DELETE` | `/api/lectures/section/:id` | ✅ instructor | Delete a section |
| `POST` | `/api/lectures/section/:sectionId` | ✅ instructor | Add a lecture (with optional `video` + `pdf` files) |
| `PUT` | `/api/lectures/:id` | ✅ instructor | Update lecture metadata |
| `DELETE` | `/api/lectures/:id` | ✅ instructor | Delete a lecture |

### Enrollments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/enrollments/buy/:courseId` | ✅ student | Enroll in a course |
| `GET` | `/api/enrollments/my` | ✅ student | Get all enrollments for the logged-in student |
| `GET` | `/api/enrollments/check/:courseId` | ✅ student | Check if the student is enrolled in a course |

### Progress

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/progress/mark` | ✅ student | Mark a lecture as complete (recalculates percentage) |
| `GET` | `/api/progress/:courseId` | ✅ student | Get progress for a specific course |
| `GET` | `/api/progress/all` | ✅ student | Get all progress records for the student |

---

## 🐋 Common Docker Commands

```bash
# Start (development) — foreground
docker compose up --build

# Start (development) — background
docker compose up --build -d

# Start (production)
docker compose -f docker-compose.prod.yml up --build -d

# View logs (all services)
docker compose logs -f

# View logs for a single service
docker compose logs -f backend
docker compose logs -f frontend

# Stop containers (keep volumes/data)
docker compose down

# Stop and DELETE all data (⚠️ irreversible — wipes MongoDB)
docker compose down -v

# Rebuild a single service after changing its Dockerfile
docker compose up --build backend

# Open a shell inside the backend container
docker compose exec backend sh

# Open a shell inside the MongoDB container
docker compose exec mongo mongosh
```

---

## 🗄️ Data Persistence

| Data | Storage | Notes |
|---|---|---|
| MongoDB documents | `mongo-data` Docker named volume | Survives `docker compose down` |
| Uploaded files (videos, PDFs, images) | `./backend/uploads/` (dev) or `uploads-data` named volume (prod) | Survives restarts |
| User session / JWT | Browser `localStorage` | Cleared on logout or 401 |

---

## 🔐 User Roles

| Role | How to get it | Access |
|---|---|---|
| `student` | Select on Register page (default) | Enroll, watch, track progress |
| `instructor` | Select on Register page | Create & manage courses |

---

## 🛠️ Troubleshooting

### Port already in use
```bash
# Find what's using port 5000
lsof -i :5000      # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Then kill it or change the port in docker-compose.yml
```

### Frontend can't reach the backend (CORS error)
- Make sure `ALLOWED_ORIGINS` in `backend/.env` includes your frontend's origin (e.g. `http://localhost:5173`).
- In production, set it to your domain: `https://yourdomain.com`.

### MongoDB won't connect
- **Docker:** Check that the `mongo` service is healthy before the backend starts (`depends_on: condition: service_healthy` is already configured).
- **Local:** Ensure `mongod` is running and `MONGO_URI` in `.env` is correct.

### File uploads fail
- **Max size:** Videos up to 500 MB, images up to 50 MB.
- **Docker:** The `uploads/` directory on the host is bind-mounted into the backend container — confirm the folder exists: `ls backend/uploads/`.

### Hot-reload not working in Docker
- Already handled — `vite.config.js` has `watch.usePolling: true` for Docker volume compatibility.
- If you still see issues, try: `docker compose restart frontend`.

### Full reset (nuclear option)
```bash
docker compose down -v --rmi all
docker compose up --build
```

---

## 📝 Notes

- Uploaded files (`uploads/`) are stored locally and **gitignored** — they won't appear after a fresh clone. In production, consider migrating to **AWS S3** or **Cloudinary**.
- JWT tokens expire in **30 days**. There is no refresh-token flow currently.
- The `uploads/` directory is auto-created by the Dockerfiles if it doesn't exist.

---

*Built with ❤️ using the MERN stack · Containerised with Docker*
