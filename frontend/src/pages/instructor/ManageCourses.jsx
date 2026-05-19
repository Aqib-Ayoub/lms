import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { SkeletonCard } from '../../components/Skeleton';
import api, { UPLOADS_URL } from '../../api/axios';

const LEVEL_COLORS = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/courses/instructor/my')
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    setDeleting(courseId);
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(c => c.filter(x => x._id !== courseId));
      toast.success('Course deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const openEdit = (course) => {
    setEditCourse(course._id);
    setEditForm({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      level: course.level,
      duration: course.duration,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put(`/courses/${editCourse}`, editForm);
      setCourses(c => c.map(x => x._id === editCourse ? { ...x, ...data } : x));
      setEditCourse(null);
      toast.success('Course updated!');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const totalStudents = courses.reduce((a, c) => a + (c.totalStudents || 0), 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {courses.length} course{courses.length !== 1 ? 's' : ''} · {totalStudents} total students
              </p>
            </div>
            <Link to="/instructor/create" className="btn-primary self-start sm:self-auto">
              ➕ New Course
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map(course => {
                const lectureCount = course.sections?.reduce((a, s) => a + (s.lectures?.length || 0), 0) || 0;
                return (
                  <div key={course._id} className="card overflow-hidden flex flex-col">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                      {course.thumbnail ? (
                        <img src={`${UPLOADS_URL}${course.thumbnail}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className={`badge ${LEVEL_COLORS[course.level]}`}>{course.level}</span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                        {course.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>👥 {course.totalStudents} students</span>
                        <span>🎬 {lectureCount} lectures</span>
                        <span>💰 {course.price === 0 ? 'Free' : `₹${course.price}`}</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Link
                          to={`/instructor/upload/${course._id}`}
                          className="text-center py-1.5 text-xs rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                        >
                          📹 Lectures
                        </Link>
                        <button
                          onClick={() => openEdit(course)}
                          className="py-1.5 text-xs rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          disabled={deleting === course._id}
                          className="py-1.5 text-xs rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium disabled:opacity-50"
                        >
                          {deleting === course._id ? '...' : '🗑 Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-16 text-center">
              <p className="text-5xl mb-4">📭</p>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No courses yet</h3>
              <Link to="/instructor/create" className="mt-4 inline-block btn-primary">Create Your First Course</Link>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {editCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditCourse(null)} />
          <div className="relative card w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Course</h2>
              <button onClick={() => setEditCourse(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" required value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input type="number" min="0" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                  <select value={editForm.level} onChange={e => setEditForm(f => ({ ...f, level: e.target.value }))} className="input-field">
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <input type="text" placeholder="e.g. 10 hours" value={editForm.duration} onChange={e => setEditForm(f => ({ ...f, duration: e.target.value }))} className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditCourse(null)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
