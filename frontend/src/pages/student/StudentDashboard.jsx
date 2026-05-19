import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProgressBar from '../../components/ProgressBar';
import { SkeletonCard, SkeletonStat } from '../../components/Skeleton';
import api, { UPLOADS_URL } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progresses, setProgresses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [enrRes, progRes] = await Promise.all([
          api.get('/enrollments/my'),
          api.get('/progress/all'),
        ]);
        setEnrollments(enrRes.data);
        // Map progress by courseId for quick lookup
        const progMap = {};
        progRes.data.forEach(p => { progMap[p.course?._id || p.course] = p; });
        setProgresses(progMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completed = enrollments.filter(e => e.completionStatus === 'completed').length;
  const inProgress = enrollments.filter(e => e.completionStatus === 'in-progress').length;
  const avgProgress = enrollments.length
    ? Math.round(Object.values(progresses).reduce((a, p) => a + (p.percentage || 0), 0) / enrollments.length)
    : 0;

  // Continue watching = most recently updated in-progress
  const continueItem = enrollments
    .filter(e => e.completionStatus !== 'completed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  const stats = [
    { icon: '📚', label: 'Enrolled Courses', value: enrollments.length, color: 'text-blue-600' },
    { icon: '🔄', label: 'In Progress', value: inProgress, color: 'text-yellow-600' },
    { icon: '✅', label: 'Completed', value: completed, color: 'text-green-600' },
    { icon: '📈', label: 'Avg. Progress', value: `${avgProgress}%`, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's what's happening with your learning journey
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonStat key={i} />)
              : stats.map(s => (
                <div key={s.label} className="card p-5">
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
          </div>

          {/* Continue watching */}
          {!loading && continueItem && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">▶ Continue Learning</h2>
              <div className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                  {continueItem.course?.thumbnail ? (
                    <img
                      src={`${UPLOADS_URL}${continueItem.course.thumbnail}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {continueItem.course?.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                    {continueItem.completionStatus}
                  </p>
                  <div className="mt-3 max-w-sm">
                    <ProgressBar
                      percentage={progresses[continueItem.course?._id]?.percentage || 0}
                      size="sm"
                    />
                  </div>
                </div>
                <Link
                  to={`/student/watch/${continueItem.course?._id}`}
                  className="btn-primary flex-shrink-0 flex items-center gap-2"
                >
                  ▶ Resume
                </Link>
              </div>
            </div>
          )}

          {/* All enrollments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h2>
              <Link to="/courses" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Browse more →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : enrollments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments.map(enr => {
                  const progress = progresses[enr.course?._id];
                  return (
                    <div key={enr._id} className="card overflow-hidden flex flex-col">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        {enr.course?.thumbnail ? (
                          <img src={`${UPLOADS_URL}${enr.course.thumbnail}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                          {enr.course?.title}
                        </h3>
                        <div className="mt-3">
                          <ProgressBar percentage={progress?.percentage || 0} size="sm" />
                        </div>
                        <Link
                          to={`/student/watch/${enr.course?._id}`}
                          className="mt-3 w-full text-center btn-primary text-sm py-2"
                        >
                          {enr.completionStatus === 'completed' ? '🏆 Review' : '▶ Continue'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-5xl mb-4">📭</p>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No courses yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  Browse our catalog and enroll in your first course!
                </p>
                <Link to="/courses" className="mt-4 inline-block btn-primary">
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
