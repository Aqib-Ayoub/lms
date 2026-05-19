import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CourseCard from '../../components/CourseCard';
import { SkeletonCard } from '../../components/Skeleton';
import api from '../../api/axios';

const features = [
  { icon: '🎥', title: 'HD Video Lessons', desc: 'Stream high-quality video lectures at your own pace, anytime anywhere.' },
  { icon: '📄', title: 'Downloadable PDFs', desc: 'Get lecture notes and resources you can keep forever.' },
  { icon: '📈', title: 'Track Your Progress', desc: 'Visual progress tracking with completion certificates.' },
  { icon: '🏆', title: 'Earn Certificates', desc: 'Complete courses and earn certificates to showcase your skills.' },
  { icon: '👨‍🏫', title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience.' },
  { icon: '📱', title: 'Learn Anywhere', desc: 'Fully responsive — learn on desktop, tablet, or mobile.' },
];

const stats = [
  { value: '10,000+', label: 'Students' },
  { value: '500+', label: 'Courses' },
  { value: '200+', label: 'Instructors' },
  { value: '95%', label: 'Satisfaction' },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then(res => setCourses(res.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-6">
              🚀 Start learning today — free forever
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Unlock Your Potential with{' '}
              <span className="text-yellow-300">Expert-Led</span> Courses
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-xl">
              Join thousands of learners mastering new skills. Browse hundreds of courses taught by industry experts.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses" className="px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                Browse Courses
              </Link>
              <Link to="/register" className="px-6 py-3 bg-white/10 backdrop-blur border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors">
                Become an Instructor →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Hand-picked courses to get you started</p>
          </div>
          <Link to="/courses" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline hidden sm:block">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-lg font-medium">No courses yet. Be the first to create one!</p>
            <Link to="/register" className="mt-4 inline-block btn-primary">Start Teaching</Link>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/courses" className="btn-secondary">View all courses</Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Why Choose LearnHub?</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need to learn and grow</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of students already learning on LearnHub</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="px-8 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
              Get started free
            </Link>
            <Link to="/courses" className="px-8 py-3 border border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Browse courses
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-white font-bold text-xl mb-3">
            <span>🎓</span> LearnHub
          </div>
          <p className="text-sm">© 2025 LearnHub. Built with MERN stack.</p>
        </div>
      </footer>
    </div>
  );
}
