# 🎓 LearnHub — Full-Stack LMS Platform

A production-ready Learning Management System built with the MERN stack.

## 📁 Project Structure

```
lms/
├── backend/     → Node.js + Express + MongoDB API
└── frontend/    → React + Vite + Tailwind CSS
```

---

## ⚙️ Backend Setup

### 1. Navigate to backend
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Edit `.env` file:
```
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/lms
JWT_SECRET=your_secret_key_here
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials.

### 4. Create uploads folder (if not exists)
```bash
mkdir uploads
```

### 5. Start the backend
```bash
npm run dev
```
Server runs at: **http://localhost:5000**

---

## 🎨 Frontend Setup

### 1. Navigate to frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the frontend
```bash
npm run dev
```
App runs at: **http://localhost:5173**

---

## 🔑 Features

### Authentication
- Register as Student or Instructor
- JWT-based login
- Role-based protected routes

### Student Features
- Browse & search courses
- Enroll in courses (free/paid)
- Watch video lectures in sequence
- Mark lectures as complete
- Track course progress (%)
- Auto-resume from last watched lecture
- Download PDF notes
- Completion certificate

### Instructor Features
- Create courses with thumbnail
- Add sections and lectures
- Upload video + PDF per lecture
- Set price, level, category
- Edit course details
- Delete courses & lectures
- Dashboard with analytics

### UI/UX
- Dark / Light mode toggle
- Fully responsive (mobile-first)
- Toast notifications
- Loading skeletons
- Progress bars

---

## 🗃️ API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get own profile |
| PUT | /api/auth/profile | Update profile |

### Courses
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/courses | Get all (with filters) |
| GET | /api/courses/:id | Get single course |
| POST | /api/courses | Create (instructor) |
| PUT | /api/courses/:id | Update (instructor) |
| DELETE | /api/courses/:id | Delete (instructor) |
| GET | /api/courses/instructor/my | Own courses |

### Lectures & Sections
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/lectures/section | Create section |
| PUT | /api/lectures/section/:id | Update section |
| DELETE | /api/lectures/section/:id | Delete section |
| POST | /api/lectures/section/:sectionId | Add lecture |
| PUT | /api/lectures/:id | Update lecture |
| DELETE | /api/lectures/:id | Delete lecture |

### Enrollments
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/enrollments/buy/:courseId | Enroll in course |
| GET | /api/enrollments/my | My enrollments |
| GET | /api/enrollments/check/:courseId | Check enrollment |

### Progress
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/progress/mark | Mark lecture complete |
| GET | /api/progress/all | All progress records |
| GET | /api/progress/:courseId | Course progress |

---

## 🧠 Tech Stack

**Backend**
- Node.js + Express.js (ES Modules)
- MongoDB + Mongoose
- JWT + bcryptjs
- Multer (file uploads)
- CORS, dotenv

**Frontend**
- React 18 + Vite
- Tailwind CSS 3
- React Router 6
- Axios (with interceptors)
- React Toastify
- Context API

---

## 💡 Tips

- Make sure MongoDB Atlas allows connections from your IP (whitelist 0.0.0.0/0 for dev)
- The `uploads/` folder is gitignored — videos/PDFs are stored locally
- For production, replace local file storage with S3 or Cloudinary
- JWT tokens expire in 30 days
