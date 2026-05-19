import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api, { UPLOADS_URL } from '../../api/axios';

export default function UploadLectures() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Section creation
  const [sectionTitle, setSectionTitle] = useState('');
  const [addingSection, setAddingSection] = useState(false);

  // Lecture form
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [lectureForm, setLectureForm] = useState({ title: '', description: '', duration: '', sequenceNumber: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadingLecture, setUploadingLecture] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const loadCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}`);
      setCourse(data);
    } catch {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourse(); }, [courseId]);

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;
    setAddingSection(true);
    try {
      await api.post('/lectures/section', {
        title: sectionTitle.trim(),
        courseId,
        order: course?.sections?.length || 0,
      });
      setSectionTitle('');
      toast.success('Section added!');
      await loadCourse();
    } catch (err) {
      toast.error('Failed to add section');
    } finally {
      setAddingSection(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section and all its lectures?')) return;
    try {
      await api.delete(`/lectures/section/${sectionId}`);
      toast.success('Section deleted');
      await loadCourse();
    } catch {
      toast.error('Failed to delete section');
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!activeSectionId) return toast.error('Select a section first');
    if (!lectureForm.title.trim()) return toast.error('Lecture title is required');
    setUploadingLecture(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append('title', lectureForm.title);
      fd.append('description', lectureForm.description);
      fd.append('duration', lectureForm.duration);
      fd.append('sequenceNumber', lectureForm.sequenceNumber || '0');
      if (videoFile) fd.append('video', videoFile);
      if (pdfFile) fd.append('pdf', pdfFile);

      await api.post(`/lectures/section/${activeSectionId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });

      setLectureForm({ title: '', description: '', duration: '', sequenceNumber: '' });
      setVideoFile(null);
      setPdfFile(null);
      setActiveSectionId(null);
      toast.success('✅ Lecture uploaded!');
      await loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingLecture(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('Delete this lecture?')) return;
    try {
      await api.delete(`/lectures/${lectureId}`);
      toast.success('Lecture deleted');
      await loadCourse();
    } catch {
      toast.error('Failed to delete lecture');
    }
  };

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-3">🎬</div>
          <p>Loading course...</p>
        </div>
      </div>
    </div>
  );

  const totalLectures = course?.sections?.reduce((a, s) => a + s.lectures.length, 0) || 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Link to="/instructor/courses" className="hover:text-gray-900 dark:hover:text-white">Manage Courses</Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-white truncate">{course?.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Lectures</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {course?.sections?.length || 0} sections · {totalLectures} lectures
              </p>
            </div>
            {course?.thumbnail && (
              <img src={`${UPLOADS_URL}${course.thumbnail}`} alt="" className="w-20 h-14 rounded-xl object-cover flex-shrink-0" />
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Add section + lecture form */}
            <div className="space-y-5">
              {/* Add section */}
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">📂 Add Section</h2>
                <form onSubmit={handleAddSection} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Section title, e.g. Introduction"
                    value={sectionTitle}
                    onChange={e => setSectionTitle(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button type="submit" disabled={addingSection} className="btn-primary px-4 flex-shrink-0">
                    {addingSection ? '...' : '+ Add'}
                  </button>
                </form>
              </div>

              {/* Add lecture form */}
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">🎬 Add Lecture</h2>

                {/* Section selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Select Section *
                  </label>
                  <select
                    value={activeSectionId || ''}
                    onChange={e => setActiveSectionId(e.target.value || null)}
                    className="input-field"
                  >
                    <option value="">Choose a section</option>
                    {course?.sections?.map(s => (
                      <option key={s._id} value={s._id}>{s.title}</option>
                    ))}
                  </select>
                  {!course?.sections?.length && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      ⚠ Add a section first before adding lectures.
                    </p>
                  )}
                </div>

                <form onSubmit={handleAddLecture} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Lecture Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Introduction to React Hooks"
                      value={lectureForm.title}
                      onChange={e => setLectureForm(f => ({ ...f, title: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What does this lecture cover?"
                      value={lectureForm.description}
                      onChange={e => setLectureForm(f => ({ ...f, description: e.target.value }))}
                      className="input-field resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12:30"
                        value={lectureForm.duration}
                        onChange={e => setLectureForm(f => ({ ...f, duration: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Order #
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="1"
                        value={lectureForm.sequenceNumber}
                        onChange={e => setLectureForm(f => ({ ...f, sequenceNumber: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Video upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      🎥 Video File
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${videoFile ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-700'}`}>
                      {videoFile ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{videoFile.name}</span>
                          <button type="button" onClick={() => setVideoFile(null)} className="text-red-500 ml-2 text-sm flex-shrink-0">✕</button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <p className="text-2xl mb-1">🎞️</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload video</p>
                          <p className="text-xs text-gray-400 mt-0.5">MP4, WebM, MOV supported</p>
                          <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* PDF upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      📄 PDF Notes (optional)
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${pdfFile ? 'border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-700'}`}>
                      {pdfFile ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{pdfFile.name}</span>
                          <button type="button" onClick={() => setPdfFile(null)} className="text-red-500 ml-2 text-sm flex-shrink-0">✕</button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <p className="text-2xl mb-1">📋</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload PDF</p>
                          <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Upload progress */}
                  {uploadingLecture && uploadProgress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploadingLecture || !activeSectionId}
                    className="w-full btn-primary py-3 font-semibold"
                  >
                    {uploadingLecture ? `Uploading ${uploadProgress}%...` : '⬆️ Upload Lecture'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Sections & lectures list */}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">📋 Course Curriculum</h2>
              {course?.sections?.length > 0 ? (
                <div className="space-y-4">
                  {course.sections.map((section, sIdx) => (
                    <div key={section._id} className="card overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">{section.title}</span>
                          <span className="text-xs text-gray-400">({section.lectures.length})</span>
                        </div>
                        <button
                          onClick={() => handleDeleteSection(section._id)}
                          className="text-red-400 hover:text-red-600 text-sm transition-colors p-1"
                          title="Delete section"
                        >
                          🗑
                        </button>
                      </div>

                      {section.lectures.length > 0 ? (
                        <div>
                          {[...section.lectures]
                            .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                            .map((lecture, lIdx) => (
                              <div key={lecture._id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {lIdx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                    {lecture.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {lecture.video && <span className="text-xs text-gray-400">🎥 Video</span>}
                                    {lecture.pdf && <span className="text-xs text-gray-400">📄 PDF</span>}
                                    {lecture.duration && <span className="text-xs text-gray-400">⏱ {lecture.duration}</span>}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteLecture(lecture._id)}
                                  className="text-red-400 hover:text-red-600 text-sm transition-colors p-1 flex-shrink-0"
                                  title="Delete lecture"
                                >
                                  🗑
                                </button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="px-4 py-4 text-center text-sm text-gray-400 dark:text-gray-600">
                          No lectures yet — add one from the form ←
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-10 text-center text-gray-400 dark:text-gray-600">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">No sections yet</p>
                  <p className="text-sm mt-1">Add your first section to start organizing lectures</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
