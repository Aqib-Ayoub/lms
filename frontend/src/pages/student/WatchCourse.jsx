import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProgressBar from '../../components/ProgressBar';
import api, { UPLOADS_URL } from '../../api/axios';

export default function WatchCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/progress/${courseId}`),
        ]);
        setCourse(courseRes.data);
        setProgress(progressRes.data);

        // Resume from last watched or start from first
        if (progressRes.data?.lastWatchedLecture) {
          // Find lecture object from course sections
          let found = null;
          for (const sec of courseRes.data.sections || []) {
            const lec = sec.lectures.find(l => l._id === progressRes.data.lastWatchedLecture?._id || l._id === progressRes.data.lastWatchedLecture);
            if (lec) { found = lec; break; }
          }
          setCurrentLecture(found || courseRes.data.sections?.[0]?.lectures?.[0] || null);
        } else {
          setCurrentLecture(courseRes.data.sections?.[0]?.lectures?.[0] || null);
        }
      } catch (err) {
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const isCompleted = (lectureId) =>
    progress?.completedLectures?.map(String).includes(String(lectureId));

  const markComplete = async () => {
    if (!currentLecture) return;
    try {
      const { data } = await api.post('/progress/mark', {
        courseId,
        lectureId: currentLecture._id,
      });
      setProgress(data);
      toast.success('✅ Lecture marked as complete!');
    } catch (err) {
      toast.error('Could not update progress');
    }
  };

  // Auto-advance to next lecture
  const goNext = () => {
    if (!course) return;
    const allLectures = course.sections.flatMap(s =>
      [...s.lectures].sort((a, b) => a.sequenceNumber - b.sequenceNumber)
    );
    const idx = allLectures.findIndex(l => l._id === currentLecture?._id);
    if (idx < allLectures.length - 1) {
      setCurrentLecture(allLectures[idx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (!course) return;
    const allLectures = course.sections.flatMap(s =>
      [...s.lectures].sort((a, b) => a.sequenceNumber - b.sequenceNumber)
    );
    const idx = allLectures.findIndex(l => l._id === currentLecture?._id);
    if (idx > 0) setCurrentLecture(allLectures[idx - 1]);
  };

  const allLectures = course?.sections?.flatMap(s => s.lectures) || [];
  const currentIdx = allLectures.findIndex(l => l._id === currentLecture?._id);

  if (loading) return (
    <div className="h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🎬</div>
        <p>Loading course...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72 sm:w-80' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden bg-gray-900 border-r border-gray-800 flex flex-col`}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-800 flex-shrink-0">
          <Link to="/student" className="text-xs text-gray-400 hover:text-white transition-colors mb-2 block">
            ← Back to Dashboard
          </Link>
          <h2 className="font-semibold text-sm leading-snug line-clamp-2">{course?.title}</h2>
          <div className="mt-3">
            <ProgressBar percentage={progress?.percentage || 0} size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {progress?.completedLectures?.length || 0} / {allLectures.length} lectures
          </p>
        </div>

        {/* Lecture list */}
        <div className="flex-1 overflow-y-auto">
          {course?.sections?.map((section) => (
            <div key={section._id}>
              <div className="px-4 py-2.5 bg-gray-800/50 sticky top-0 z-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </p>
              </div>
              {[...section.lectures]
                .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                .map((lecture) => {
                  const active = currentLecture?._id === lecture._id;
                  const done = isCompleted(lecture._id);
                  return (
                    <button
                      key={lecture._id}
                      onClick={() => setCurrentLecture(lecture)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                        active
                          ? 'bg-blue-900/40 border-l-2 border-blue-500'
                          : 'hover:bg-gray-800 border-l-2 border-transparent'
                      }`}
                    >
                      <span className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs border transition-colors ${
                        done ? 'bg-green-500 border-green-500 text-white' :
                        active ? 'border-blue-400 text-blue-400' : 'border-gray-600 text-gray-600'
                      }`}>
                        {done ? '✓' : '▶'}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-sm leading-snug ${active ? 'text-white font-medium' : 'text-gray-300'}`}>
                          {lecture.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {lecture.video && <span className="text-xs text-gray-500">🎥</span>}
                          {lecture.pdf && <span className="text-xs text-gray-500">📄</span>}
                          {lecture.duration && <span className="text-xs text-gray-500">{lecture.duration}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            title="Toggle sidebar"
          >
            ☰
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentLecture?.title || 'Select a lecture'}</p>
          </div>
          {/* Nav buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={goPrev}
              disabled={currentIdx <= 0}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm disabled:opacity-30 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={goNext}
              disabled={currentIdx >= allLectures.length - 1}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm disabled:opacity-30 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {currentLecture ? (
            <div className="max-w-4xl mx-auto px-4 py-6">
              {/* Video player */}
              {currentLecture.video ? (
                <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl">
                  <video
                    ref={videoRef}
                    key={currentLecture._id}
                    controls
                    className="w-full h-full"
                    src={`${UPLOADS_URL}${currentLecture.video}`}
                    onEnded={markComplete}
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-gray-900 flex items-center justify-center border border-gray-800">
                  <div className="text-center text-gray-500">
                    <p className="text-5xl mb-3">📄</p>
                    <p className="font-medium">No video for this lecture</p>
                  </div>
                </div>
              )}

              {/* Lecture info + actions */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold">{currentLecture.title}</h1>
                  {currentLecture.description && (
                    <p className="mt-2 text-gray-400 leading-relaxed">{currentLecture.description}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isCompleted(currentLecture._id) ? (
                    <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900/30 text-green-400 font-medium text-sm">
                      ✅ Completed
                    </span>
                  ) : (
                    <button
                      onClick={markComplete}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors"
                    >
                      ✓ Mark as Complete
                    </button>
                  )}
                </div>
              </div>

              {/* PDF resource */}
              {currentLecture.pdf && (
                <div className="mt-5 p-4 bg-gray-900 rounded-xl border border-gray-800 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-900/30 flex items-center justify-center text-xl flex-shrink-0">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Lecture Notes (PDF)</p>
                    <p className="text-xs text-gray-400 mt-0.5">Download for offline reading</p>
                  </div>
                  <a
                    href={`${UPLOADS_URL}${currentLecture.pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Download
                  </a>
                </div>
              )}

              {/* Completion certificate */}
              {progress?.percentage === 100 && (
                <div className="mt-6 p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700/30 rounded-2xl text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <h3 className="text-xl font-bold text-yellow-400">Course Completed!</h3>
                  <p className="text-gray-300 mt-1">Congratulations on finishing the course.</p>
                  <button className="mt-4 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-colors">
                    Download Certificate
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-5xl mb-4">👈</p>
                <p className="text-lg font-medium">Select a lecture to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
