import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProgressBar from '../../components/ProgressBar';
import { SkeletonCard } from '../../components/Skeleton';
import api, { UPLOADS_URL } from '../../api/axios';

const STATUS_COLORS = {
  enrolled: 'badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'in-progress': 'badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [progresses, setProgresses] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [enrRes, progRes] = await Promise.all([
          api.get('/enrollments/my'),
          api.get('/progress/all'),
        ]);
        setEnrollments(enrRes.data);
        const map = {};
        progRes.data.forEach(p => { map[p.course?._id || p.course] = p; });
        setProgresses(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = filter === 'all'
    ? enrollments
    : enrollments.filter(e => e.completionStatus === filter);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled
              </p>
            </div>
            <Link to="/courses" className="btn-primary self-start sm:self-auto">
              + Browse More
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
            {[
              { value: 'all', label: 'All' },
              { value: 'enrolled', label: 'Not Started' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  filter === tab.value
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.value !== 'all' && (
                  <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-1.5 py-0.5">
                    {enrollments.filter(e => e.completionStatus === tab.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(enr => {
                const prog = progresses[enr.course?._id];
                return (
                  <div key={enr._id} className="card overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                      {enr.course?.thumbnail ? (
                        <img src={`${UPLOADS_URL}${enr.course.thumbnail}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={STATUS_COLORS[enr.completionStatus]}>
                          {enr.completionStatus === 'completed' ? '✅ Done' :
                           enr.completionStatus === 'in-progress' ? '🔄 In Progress' : '📌 Enrolled'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 flex-1">
                        {enr.course?.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        by {enr.course?.instructor?.name || 'Instructor'}
                      </p>
                      <ProgressBar percentage={prog?.percentage || 0} size="sm" />
                      {enr.completionStatus === 'completed' && (
                        <div className="mt-2 text-center text-xs text-green-600 dark:text-green-400 font-medium">
                          🏆 Certificate earned!
                        </div>
                      )}
                      <Link
                        to={`/student/watch/${enr.course?._id}`}
                        className="mt-3 w-full text-center py-2 rounded-lg text-sm font-medium transition-colors
                          bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400
                          hover:bg-blue-100 dark:hover:bg-blue-900/40"
                      >
                        {enr.completionStatus === 'completed' ? '🔄 Review Course' : '▶ Continue Learning'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-16 text-center">
              <p className="text-5xl mb-4">📭</p>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {filter === 'all' ? 'No courses enrolled yet' : `No ${filter.replace('-', ' ')} courses`}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {filter === 'all' ? 'Browse our catalog and find your next skill!' : 'Try a different filter'}
              </p>
              {filter === 'all' && (
                <Link to="/courses" className="mt-4 inline-block btn-primary">Browse Courses</Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
