import { Link } from 'react-router-dom';
import { UPLOADS_URL } from '../api/axios';

const LEVEL_COLORS = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course._id}`} className="group block">
      <div className="card overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 overflow-hidden relative flex-shrink-0">
          {course.thumbnail ? (
            <img
              src={`${UPLOADS_URL}${course.thumbnail}`}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">📚</div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`badge ${LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner}`}>
              {course.level}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {course.category}
          </span>
          <h3 className="mt-1 font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            by {course.instructor?.name || 'Instructor'}
          </p>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {course.duration && <span>⏱ {course.duration}</span>}
            <span>👥 {course.totalStudents || 0} students</span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {course.price === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                `₹${course.price}`
              )}
            </span>
            <span className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full font-medium group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              View course →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
