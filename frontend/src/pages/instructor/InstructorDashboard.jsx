import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { SkeletonStat, SkeletonCard } from '../../components/Skeleton';
import api, { UPLOADS_URL } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/instructor/my')
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((a, c) => a + (c.totalStudents || 0), 0);
  const totalLectures = courses.reduce((a, c) => {
    return a + (c.sections?.reduce((b, s) => b + (s.lectures?.length || 0), 0) || 0);
  }, 0);
  const totalRevenue = courses.reduce((a, c) => a + (c.price * c.totalStudents), 0);

  const stats = [
    { icon: '📚', label: 'Total Courses', value: courses.length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: '👥', label: 'Total Students', value: totalStudents, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: '🎬', label: 'Total Lectures', value: totalLectures, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: '💰', label: 'Est. Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your teaching overview</p>
            </div>
            <Link to="/instructor/create" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
              ➕ Create Course
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonStat key={i} />)
              : stats.map(s => (
                <div key={s.label} className="card p-5">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl mb-4`}>
                    {s.icon}
                  </div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { to: '/instructor/create', icon: '✏️', title: 'Create Course', desc: 'Start a new course from scratch' },
              { to: '/instructor/courses', icon: '📋', title: 'Manage Courses', desc: 'Edit, update or delete courses' },
              { to: '/courses', icon: '🔍', title: 'Browse Catalog', desc: 'See all published courses' },
            ].map(action => (
              <Link key={action.to} to={action.to} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.desc}</p>
              </Link>
            ))}
          </div>

          {/* Courses overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Courses</h2>
              <Link to="/instructor/courses" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Manage all →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.slice(0, 6).map(course => {
                  const lectureCount = course.sections?.reduce((a, s) => a + (s.lectures?.length || 0), 0) || 0;
                  return (
                    <div key={course._id} className="card overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        {course.thumbnail ? (
                          <img src={`${UPLOADS_URL}${course.thumbnail}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{course.title}</h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>👥 {course.totalStudents} students</span>
                          <span>🎬 {lectureCount} lectures</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link
                            to={`/instructor/upload/${course._id}`}
                            className="flex-1 text-center text-xs py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                          >
                            + Lectures
                          </Link>
                          <Link
                            to={`/instructor/courses`}
                            className="flex-1 text-center text-xs py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                          >
                            Manage
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card p-14 text-center">
                <p className="text-5xl mb-4">🎓</p>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No courses yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Create your first course and start teaching!</p>
                <Link to="/instructor/create" className="mt-4 inline-block btn-primary">
                  Create First Course
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
