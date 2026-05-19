import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Photography', 'Music', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    level: 'Beginner',
    duration: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error('Please select a category');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (thumbnail) fd.append('thumbnail', thumbnail);

      const { data } = await api.post('/courses', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('🎉 Course created! Now add your lectures.');
      navigate(`/instructor/upload/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link to="/instructor" className="hover:text-gray-900 dark:hover:text-white">Dashboard</Link>
              <span>›</span>
              <span className="text-gray-900 dark:text-white">Create Course</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Create New Course</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thumbnail upload */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">📸 Course Thumbnail</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-700">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400 p-4">
                        <p className="text-3xl mb-1">🖼</p>
                        <p className="text-xs">Upload thumbnail</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <span className="btn-secondary cursor-pointer inline-block">Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumb}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Recommended: 1280×720px. JPG, PNG or WebP. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic info */}
              <div className="card p-6 space-y-5">
                <h2 className="font-semibold text-gray-900 dark:text-white">📝 Basic Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete React.js Masterclass 2025"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="What will students learn in this course? Be detailed and specific..."
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Category *
                    </label>
                    <select
                      required
                      value={form.category}
                      onChange={e => set('category', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={form.level}
                      onChange={e => set('level', e.target.value)}
                      className="input-field"
                    >
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Price (₹) — Enter 0 for free
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="999"
                      value={form.price}
                      onChange={e => set('price', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Total Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12 hours 30 mins"
                      value={form.duration}
                      onChange={e => set('duration', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 text-base font-semibold flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Creating course...
                    </span>
                  ) : '✅ Create Course & Add Lectures →'}
                </button>
                <Link to="/instructor" className="btn-secondary py-3 text-center text-base font-semibold">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
