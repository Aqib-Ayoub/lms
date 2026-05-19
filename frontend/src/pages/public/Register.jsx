import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate(user.role === 'instructor' ? '/instructor' : '/student', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      toast.success('Account created successfully! 🎉');
      navigate(data.role === 'instructor' ? '/instructor' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="text-5xl mb-6">✨</div>
          <h2 className="text-3xl font-bold mb-4">Start your learning journey today</h2>
          <p className="text-indigo-200 text-lg leading-relaxed mb-10">
            Join thousands of students and instructors on LearnHub — the platform that grows with you.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🎓', label: 'Students', value: '10,000+' },
              { icon: '📚', label: 'Courses', value: '500+' },
              { icon: '👨‍🏫', label: 'Instructors', value: '200+' },
              { icon: '🏆', label: 'Certificates', value: '5,000+' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-sm text-indigo-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-blue-600 dark:text-blue-400">🎓 LearnHub</Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Create your account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  I want to join as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'student', icon: '🎓', title: 'Student', desc: 'Learn new skills' },
                    { value: 'instructor', icon: '👨‍🏫', title: 'Instructor', desc: 'Teach & earn' },
                  ].map(role => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: role.value })}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        form.role === role.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{role.icon}</div>
                      <div className={`font-semibold text-sm ${form.role === role.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                        {role.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{role.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Creating account...
                  </span>
                ) : 'Create account'}
              </button>
            </form>

            <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
