import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public
import Home from './pages/public/Home';
import Courses from './pages/public/Courses';
import CourseDetail from './pages/public/CourseDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import WatchCourse from './pages/student/WatchCourse';

// Instructor
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import ManageCourses from './pages/instructor/ManageCourses';
import UploadLectures from './pages/instructor/UploadLectures';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route path="/student" element={
            <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/courses" element={
            <ProtectedRoute role="student"><MyCourses /></ProtectedRoute>
          } />
          <Route path="/student/watch/:courseId" element={
            <ProtectedRoute role="student"><WatchCourse /></ProtectedRoute>
          } />

          {/* Instructor routes */}
          <Route path="/instructor" element={
            <ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>
          } />
          <Route path="/instructor/create" element={
            <ProtectedRoute role="instructor"><CreateCourse /></ProtectedRoute>
          } />
          <Route path="/instructor/courses" element={
            <ProtectedRoute role="instructor"><ManageCourses /></ProtectedRoute>
          } />
          <Route path="/instructor/upload/:courseId" element={
            <ProtectedRoute role="instructor"><UploadLectures /></ProtectedRoute>
          } />

          {/* 404 fallback */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-center">
              <div>
                <p className="text-8xl mb-4">🔍</p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page not found</h1>
                <a href="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">← Go home</a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
