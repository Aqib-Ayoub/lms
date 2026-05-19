import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { SkeletonText } from '../../components/Skeleton';
import api, { UPLOADS_URL } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        setOpenSection(data.sections?.[0]?._id || null);

        if (user) {
          const { data: enr } = await api.get(`/enrollments/check/${id}`);
          setEnrolled(enr.enrolled);
        }
      } catch {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const totalLectures = course?.sections?.reduce((a, s) => a + s.lectures.length, 0) || 0;

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    if (user.role === 'instructor') return toast.error('Instructors cannot enroll in courses');
    setEnrolling(true);
    try {
      await api.post(`/enrollments/buy/${id}`);
      setEnrolled(true);
      toast.success('🎉 Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
            <SkeletonText lines={4} />
          </div>
        </div>
      </div>
    </div>
  );

  if (!course) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge bg-blue-500/20 text-blue-300">{course.category}</span>
                <span className="badge bg-gray-700 text-gray-300">{course.level}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{course.title}</h1>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">{course.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>👥 {course.totalStudents} students</span>
                <span>📖 {totalLectures} lectures</span>
                {course.duration && <span>⏱ {course.duration}</span>}
                <span>📊 {course.level}</span>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                  {course.instructor?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{course.instructor?.name}</p>
                  <p className="text-sm text-gray-400">Instructor</p>
                </div>
              </div>
            </div>

            {/* Enrollment card */}
            <div className="card overflow-hidden text-gray-900 dark:text-white">
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {course.thumbnail ? (
                  <img src={`${UPLOADS_URL}${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">📚</div>
                )}
              </div>
              <div className="p-5">
                <div className="text-3xl font-bold mb-4">
                  {course.price === 0 ? <span className="text-green-600 dark:text-green-400">Free</span> : `₹${course.price}`}
                </div>
                {enrolled ? (
                  <Link
                    to={`/student/watch/${course._id}`}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-base"
                  >
                    ▶ Continue Learning
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full btn-primary py-3 text-base"
                  >
                    {enrolling ? 'Enrolling...' : course.price === 0 ? 'Enroll for Free' : `Buy for ₹${course.price}`}
                  </button>
                )}
                <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>✅ Full lifetime access</li>
                  <li>✅ {totalLectures} lectures</li>
                  {course.duration && <li>✅ {course.duration} of content</li>}
                  <li>✅ Completion certificate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Curriculum</h2>
            {course.sections?.length > 0 ? (
              <div className="space-y-3">
                {course.sections.map((section) => (
                  <div key={section._id} className="card overflow-hidden">
                    <button
                      onClick={() => setOpenSection(openSection === section._id ? null : section._id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 dark:text-white">{section.title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {section.lectures.length} lecture{section.lectures.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <span className="text-gray-400 transition-transform duration-200" style={{ transform: openSection === section._id ? 'rotate(180deg)' : 'none' }}>
                        ▾
                      </span>
                    </button>
                    {openSection === section._id && (
                      <div className="border-t border-gray-100 dark:border-gray-800">
                        {section.lectures
                          .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                          .map((lecture, idx) => (
                            <div key={lecture._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{lecture.title}</span>
                              <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                                {lecture.video && <span>🎥</span>}
                                {lecture.pdf && <span>📄</span>}
                                {lecture.duration && <span>{lecture.duration}</span>}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center text-gray-400">
                <p className="text-3xl mb-2">📭</p>
                <p>No curriculum added yet.</p>
              </div>
            )}
          </div>

          {/* Instructor info */}
          <div>
            <div className="card p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About the Instructor</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {course.instructor?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{course.instructor?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course.instructor?.createdCourses?.length || 0} courses
                  </p>
                </div>
              </div>
              {course.instructor?.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {course.instructor.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
