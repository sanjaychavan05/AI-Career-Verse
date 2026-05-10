import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, Clock, Star, X, ExternalLink } from 'lucide-react';

const COURSES = [
  {
    id: 'python', title: 'Python Mastery', icon: '🐍', color: '#3572A5', level: 'Intermediate',
    lessons: 24, duration: '18 hours', progress: 78,
    desc: 'Master Python from fundamentals to advanced patterns — decorators, generators, async, and more.',
    thumbnail: 'XKHEtdqhLK8',
    playlist: [
      { title: 'Python Full Course for Beginners', videoId: 'XKHEtdqhLK8', duration: '4:20:00' },
      { title: 'Python OOP Tutorial', videoId: 'JeznW_7DlB0', duration: '1:45:00' },
      { title: 'Advanced Python Decorators', videoId: 'FsAPt_9Bf3U', duration: '32:15' },
      { title: 'Python Async Programming', videoId: 'Qb9s3UiMSTA', duration: '45:00' },
    ],
  },
  {
    id: 'react', title: 'React & Next.js', icon: '⚛️', color: '#61DAFB', level: 'Advanced',
    lessons: 32, duration: '22 hours', progress: 62,
    desc: 'Build production-grade React apps — hooks, context, performance, Server Components, and Next.js.',
    thumbnail: 'CgkZ7MvWUAA',
    playlist: [
      { title: 'React Full Course 2024', videoId: 'CgkZ7MvWUAA', duration: '3:50:00' },
      { title: 'React Hooks Explained', videoId: 'TNhaISOUy6Q', duration: '1:20:00' },
      { title: 'Next.js 14 Tutorial', videoId: 'ZVnjOPwW4ZA', duration: '2:15:00' },
      { title: 'React Performance Optimization', videoId: 'KJP1E-Y-xyo', duration: '48:00' },
    ],
  },
  {
    id: 'django', title: 'Django Full Stack', icon: '🌐', color: '#092E20', level: 'Intermediate',
    lessons: 20, duration: '16 hours', progress: 45,
    desc: 'Build real-world web apps with Django — REST APIs, authentication, deployment, and best practices.',
    thumbnail: 'o0XbHvKxw7Y',
    playlist: [
      { title: 'Django Full Course for Beginners', videoId: 'o0XbHvKxw7Y', duration: '3:45:00' },
      { title: 'Django REST Framework Tutorial', videoId: 'cJveiktaOSQ', duration: '2:10:00' },
      { title: 'Django + React Integration', videoId: 'JD-age0BPVo', duration: '1:30:00' },
      { title: 'Django Deployment on AWS', videoId: 'Sa_kQheCnds', duration: '55:00' },
    ],
  },
  {
    id: 'java', title: 'Java & Spring Boot', icon: '☕', color: '#B07219', level: 'Intermediate',
    lessons: 28, duration: '20 hours', progress: 30,
    desc: 'Learn Java from OOP to Spring Boot — build enterprise-grade REST APIs, microservices, and more.',
    thumbnail: 'xk4_1vDrzzo',
    playlist: [
      { title: 'Java Full Course for Beginners', videoId: 'xk4_1vDrzzo', duration: '4:30:00' },
      { title: 'Spring Boot Tutorial', videoId: '9SGDpanrc8U', duration: '3:15:00' },
      { title: 'Java Collections Framework', videoId: 'GdAon80-0KA', duration: '1:45:00' },
      { title: 'Microservices with Spring Boot', videoId: 'BnknNTN8icw', duration: '2:20:00' },
      { title: 'Java Stream API Masterclass', videoId: 'Q93JsQ8vcwY', duration: '1:10:00' },
    ],
  },
  {
    id: 'devops', title: 'DevOps & Cloud', icon: '🚀', color: '#2496ED', level: 'Advanced',
    lessons: 18, duration: '14 hours', progress: 35,
    desc: 'Docker, Kubernetes, CI/CD pipelines, AWS deployment, and infrastructure as code with Terraform.',
    thumbnail: 'fqMOX6JJhGo',
    playlist: [
      { title: 'Docker Full Course', videoId: 'fqMOX6JJhGo', duration: '3:00:00' },
      { title: 'Kubernetes Tutorial', videoId: 'X48VuDVv0do', duration: '3:40:00' },
      { title: 'GitHub Actions CI/CD', videoId: 'R8_veQiYBjI', duration: '1:15:00' },
      { title: 'AWS for Beginners', videoId: 'k1RI5locZE4', duration: '2:30:00' },
    ],
  },
  {
    id: 'system', title: 'System Design', icon: '🏗️', color: '#6366F1', level: 'Advanced',
    lessons: 15, duration: '12 hours', progress: 20,
    desc: 'Scalability, load balancing, caching, database sharding, and real-world architecture case studies.',
    thumbnail: 'UzLMhqg3_Wc',
    playlist: [
      { title: 'System Design Primer', videoId: 'UzLMhqg3_Wc', duration: '2:30:00' },
      { title: 'Designing Instagram', videoId: 'QmX2NPkJTKg', duration: '45:00' },
      { title: 'Database Scaling Techniques', videoId: 'dNAqEGzlfGo', duration: '1:10:00' },
      { title: 'Microservices Architecture', videoId: 'rv4LlmLmVWk', duration: '1:30:00' },
    ],
  },
];

export default function LearningHub() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">Learning Hub</h2>
        <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Structured courses with free YouTube video lessons</p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COURSES.map(course => (
          <motion.div key={course.id} whileHover={{ y: -3 }}
            onClick={() => setSelectedCourse(course)}
            className="rounded-2xl cursor-pointer group overflow-hidden dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60 hover:dark:border-white/[0.1] hover:border-gray-300 transition-all">
            {/* YouTube Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <img src={`https://img.youtube.com/vi/${course.thumbnail}/hqdefault.jpg`}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="text-2xl">{course.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white drop-shadow-lg">{course.title}</h3>
                  <span className="text-[10px] font-semibold text-white/70">{course.level}</span>
                </div>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
                <Play size={14} className="text-white" fill="white" />
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm dark:text-gray-400 text-gray-500 mb-3 line-clamp-2">{course.desc}</p>

              <div className="flex items-center gap-3 text-xs dark:text-gray-500 text-gray-400 mb-3">
                <span className="flex items-center gap-1"><BookOpen size={11} /> {course.lessons} lessons</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                <span className="flex items-center gap-1"><Play size={11} /> {course.playlist.length} videos</span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] dark:text-gray-500 text-gray-400">Progress</span>
                  <span className="text-[10px] font-bold font-mono dark:text-violet-400 text-violet-600">{course.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full dark:bg-white/[0.04] bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Detail + Playlist Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => { setSelectedCourse(null); setPlayingVideo(null); }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl rounded-2xl dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="p-5 border-b dark:border-white/[0.06] border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCourse.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white text-gray-900">{selectedCourse.title}</h3>
                    <p className="text-sm dark:text-gray-400 text-gray-500">{selectedCourse.lessons} lessons • {selectedCourse.duration} • {selectedCourse.playlist.length} videos</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedCourse(null); setPlayingVideo(null); }}
                  className="w-8 h-8 rounded-lg dark:bg-white/[0.04] bg-gray-100 flex items-center justify-center hover:dark:bg-white/[0.08] hover:bg-gray-200 transition-colors">
                  <X size={16} className="dark:text-gray-400 text-gray-500" />
                </button>
              </div>

              {/* Video Player */}
              {playingVideo && (
                <div className="w-full aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${playingVideo.videoId}?autoplay=1&rel=0`}
                    className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen title={playingVideo.title} />
                </div>
              )}

              {/* Playlist */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Play size={12} className="text-violet-400" /> Course Playlist
                </h4>
                {selectedCourse.playlist.map((video, i) => {
                  const isPlaying = playingVideo?.videoId === video.videoId;
                  return (
                    <motion.button key={i} whileHover={{ x: 3 }}
                      onClick={() => setPlayingVideo(video)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                        isPlaying
                          ? 'dark:bg-violet-500/10 bg-violet-50 dark:border-violet-500/20 border-violet-200'
                          : 'dark:bg-white/[0.02] bg-gray-50 dark:border-white/[0.04] border-gray-200/40 hover:dark:border-white/[0.08] hover:border-gray-300'
                      }`}>
                      {/* Video Thumbnail */}
                      <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                          alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play size={12} className="text-white" fill="white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isPlaying ? 'dark:text-violet-400 text-violet-600' : 'dark:text-white text-gray-900'}`}>
                          {video.title}
                        </p>
                        <p className="text-xs dark:text-gray-500 text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {video.duration}
                        </p>
                      </div>
                      {isPlaying && <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full flex-shrink-0">Now Playing</span>}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
