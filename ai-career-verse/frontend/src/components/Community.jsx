import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Heart, Share2, TrendingUp, Award, Clock, UserPlus, CheckCircle2, XCircle, Loader2, GraduationCap, Shield, X, User } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useUser } from '../context/UserContext';
import { usePlatform } from '../context/PlatformContext';
import axios from 'axios';

const CHANNELS = ['General', 'Interview Tips', 'Project Ideas', 'Career Advice', 'Code Review'];

const POSTS = [
  { id:1, author:'Priya Sharma', avatar:'PS', role:'Full Stack Dev', channel:'General', time:'2 hours ago', content:'Just cleared my Google L4 interview! Happy to share my prep strategy with anyone interested. Used the Interview Lab here and it was incredibly helpful.', likes:42, replies:12, tag:'🎉 Achievement' },
  { id:2, author:'Rahul Patel', avatar:'RP', role:'Backend Engineer', channel:'Interview Tips', time:'5 hours ago', content:'Pro tip: When asked about system design, always start with requirements gathering. I made a framework that works every time. Check thread 👇', likes:38, replies:23, tag:'💡 Pro Tip' },
  { id:3, author:'Sneha Reddy', avatar:'SR', role:'DevOps Engineer', channel:'Project Ideas', time:'1 day ago', content:'Looking for collaborators on an open-source AI resume analyzer. Tech stack: Python + FastAPI + React. DM if interested!', likes:29, replies:8, tag:'🤝 Collab' },
  { id:4, author:'Arjun Mehta', avatar:'AM', role:'Python Full Stack', channel:'Career Advice', time:'2 days ago', content:'Completed my Career DNA analysis — turns out I\'m "The Builder" archetype with 94% Full Stack compatibility. Anyone else tried this?', likes:56, replies:15, tag:'🧬 Career DNA' },
  { id:5, author:'Kavya Nair', avatar:'KN', role:'ML Engineer', channel:'Code Review', time:'3 days ago', content:'Can someone review my Django REST API implementation? Trying to optimize query performance on a PostgreSQL database with 1M+ records.', likes:18, replies:7, tag:'📝 Review' },
];

const AVATAR_COLORS = { PS: 'from-pink-500 to-rose-600', RP: 'from-blue-500 to-indigo-600', SR: 'from-cyan-500 to-teal-600', AM: 'from-violet-500 to-purple-600', KN: 'from-amber-500 to-orange-600' };

export default function Community() {
  const { stats } = useGamification();
  const { user } = useUser();
  const { mentorRequests, sendMentorRequest, acceptRequest, rejectRequest } = usePlatform();
  const userRole = user?.role || 'STUDENT';
  const userName = user?.name || 'Sanjay Chavan';

  const [activeChannel, setActiveChannel] = useState('General');
  const [liked, setLiked] = useState(new Set());
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const pendingForMe = mentorRequests.filter(r => r.status === 'pending');
  const myRequests = mentorRequests.filter(r => r.student === userName);

  useEffect(() => {
    axios.get('/api/gamification/leaderboard')
      .then(({ data }) => setLeaderboard(data))
      .catch(() => setLeaderboard([
        { name: 'Arjun Mehta', xp: 12450, streak: 23, careerReadiness: 85, role: 'Python Full Stack' },
        { name: 'Priya Sharma', xp: 11200, streak: 18, careerReadiness: 92, role: 'Full Stack Dev' },
        { name: 'Rahul Patel', xp: 9800, streak: 15, careerReadiness: 88, role: 'Backend Engineer' },
        { name: 'Sneha Reddy', xp: 8900, streak: 12, careerReadiness: 79, role: 'DevOps Engineer' },
        { name: 'Kavya Nair', xp: 7600, streak: 9, careerReadiness: 74, role: 'ML Engineer' },
      ]));
  }, []);

  const handleRequestMentorship = () => {
    sendMentorRequest(userName);
    setShowMentorModal(false);
  };

  const handleRespond = (requestId, accept) => {
    if (accept) acceptRequest(requestId);
    else rejectRequest(requestId);
  };

  const openProfile = (name) => {
    const u = leaderboard.find(l => l.name === name) || POSTS.find(p => p.author === name);
    if (u) setShowProfileModal({ name: u.name || u.author, role: u.role, xp: u.xp || 0, streak: u.streak || 0, readiness: u.careerReadiness || 0, avatar: (u.name || u.author || '').split(' ').map(w => w[0]).join('') });
  };

  const filteredPosts = activeChannel === 'General' ? POSTS : POSTS.filter(p => p.channel === activeChannel);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Community</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Connect, share, and grow with fellow developers</p>
        </div>
        <div className="flex gap-2">
          {userRole === 'STUDENT' && (
            <button onClick={() => setShowMentorModal(true)} className="btn-primary flex items-center gap-2 text-sm">
              <UserPlus size={14} /> Request Mentorship
            </button>
          )}
          {(userRole === 'MENTOR' || userRole === 'TEACHER') && (
            <button onClick={() => setShowPendingModal(true)} className="btn-primary flex items-center gap-2 text-sm relative">
              <Shield size={14} /> Pending Requests
              {pendingForMe.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{pendingForMe.length}</span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {CHANNELS.map(c => (
              <button key={c} onClick={() => setActiveChannel(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeChannel === c ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'dark:bg-white/[0.03] bg-gray-100 dark:text-gray-400 text-gray-500'}`}>
                {c}
              </button>
            ))}
          </div>

          {filteredPosts.map(post => {
            const isLiked = liked.has(post.id);
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[post.avatar] || 'from-violet-500 to-indigo-600'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openProfile(post.author)} className="text-sm font-bold dark:text-white text-gray-900 hover:text-violet-400 transition-colors cursor-pointer">{post.author}</button>
                      <span className="text-xs dark:text-gray-600 text-gray-400">{post.role}</span>
                      {post.tag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full dark:bg-white/[0.04] bg-gray-100 dark:text-gray-400 text-gray-500">{post.tag}</span>}
                    </div>
                    <p className="text-xs dark:text-gray-600 text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10} /> {post.time}</p>
                    <p className="text-sm dark:text-gray-300 text-gray-600 mt-2 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={() => setLiked(p => { const n = new Set(p); n.has(post.id) ? n.delete(post.id) : n.add(post.id); return n; })}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${isLiked ? 'text-red-400' : 'dark:text-gray-500 text-gray-400 hover:text-red-400'}`}>
                        <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} /> {post.likes + (isLiked ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1.5 text-xs dark:text-gray-500 text-gray-400"><MessageSquare size={13} /> {post.replies}</span>
                      <span className="flex items-center gap-1.5 text-xs dark:text-gray-500 text-gray-400 cursor-pointer hover:text-violet-400"><Share2 size={13} /> Share</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp size={13} className="text-violet-400" /> Leaderboard
            </h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl dark:hover:bg-white/[0.02] hover:bg-gray-50 transition-colors">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold ${
                    i === 0 ? 'bg-amber-400 text-black' : i === 1 ? 'bg-gray-400 text-white' : i === 2 ? 'bg-orange-600 text-white' : 'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-500 text-gray-400'
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => openProfile(u.name)} className="text-sm font-bold dark:text-white text-gray-900 truncate block hover:text-violet-400 transition-colors cursor-pointer">{u.name}</button>
                    <p className="text-[10px] dark:text-gray-600 text-gray-400">{u.role}</p>
                  </div>
                  <span className="text-xs font-bold font-mono text-violet-400">{(u.xp || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award size={13} className="text-amber-400" /> Achievements
            </h3>
            <div className="space-y-2">
              {['🏆 Code Bharat 2025', '🔥 23-Day Streak', '💯 92% ATS Score'].map((a, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg dark:bg-white/[0.02] bg-gray-50 text-sm dark:text-gray-300 text-gray-600">{a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile View Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowProfileModal(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-2xl p-6 dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl text-center relative"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowProfileModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg dark:bg-white/[0.04] bg-gray-100 flex items-center justify-center"><X size={14} className="dark:text-gray-400 text-gray-500" /></button>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">{showProfileModal.avatar}</div>
              <h3 className="text-lg font-bold dark:text-white text-gray-900">{showProfileModal.name}</h3>
              <p className="text-sm dark:text-gray-400 text-gray-500">{showProfileModal.role}</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-gray-50"><p className="text-lg font-extrabold font-mono text-violet-400">{(showProfileModal.xp || 0).toLocaleString()}</p><p className="text-[9px] dark:text-gray-500 text-gray-400 uppercase">XP</p></div>
                <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-gray-50"><p className="text-lg font-extrabold font-mono text-amber-400">{showProfileModal.streak}</p><p className="text-[9px] dark:text-gray-500 text-gray-400 uppercase">Streak</p></div>
                <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-gray-50"><p className="text-lg font-extrabold font-mono text-cyan-400">{showProfileModal.readiness}%</p><p className="text-[9px] dark:text-gray-500 text-gray-400 uppercase">Ready</p></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mentor Request Modal (Student) */}
      <AnimatePresence>
        {showMentorModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowMentorModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-md mx-4 rounded-2xl p-6 dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold dark:text-white text-gray-900">Request Mentorship</h3>
                <button onClick={() => setShowMentorModal(false)} className="w-8 h-8 rounded-lg dark:bg-white/[0.04] bg-gray-100 flex items-center justify-center"><X size={14} /></button>
              </div>
              <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">Send a mentorship request. The mentor will see it on their dashboard and can accept/decline.</p>
              {myRequests.length > 0 ? (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-bold dark:text-gray-400 text-gray-500 uppercase">Your Requests</p>
                  {myRequests.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl dark:bg-white/[0.02] bg-gray-50 border dark:border-white/[0.04] border-gray-200/40">
                      <span className="text-sm dark:text-gray-300 text-gray-600">Mentorship Request</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <button onClick={handleRequestMentorship} className="btn-primary w-full flex items-center justify-center gap-2">
                <UserPlus size={14} /> Send Mentorship Request
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Requests Modal (Mentor/Teacher) */}
      <AnimatePresence>
        {showPendingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowPendingModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-lg mx-4 rounded-2xl p-6 dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold dark:text-white text-gray-900">Pending Mentorship Requests</h3>
                <button onClick={() => setShowPendingModal(false)} className="w-8 h-8 rounded-lg dark:bg-white/[0.04] bg-gray-100 flex items-center justify-center"><X size={14} /></button>
              </div>
              {pendingForMe.length === 0 ? (
                <div className="text-center py-8">
                  <Shield size={32} className="text-violet-400 mx-auto mb-3 opacity-40" />
                  <p className="text-sm dark:text-gray-500 text-gray-400">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingForMe.map(req => (
                    <div key={req.id} className="p-4 rounded-xl dark:bg-white/[0.03] bg-gray-50 border dark:border-white/[0.04] border-gray-200/40">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold dark:text-white text-gray-900">{req.student}</p>
                        <span className="text-[10px] dark:text-gray-600 text-gray-400">{new Date(req.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm dark:text-gray-400 text-gray-500 mb-3">Requesting mentorship guidance</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleRespond(req.id, true)} className="flex-1 px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-green-500 transition-colors">
                          <CheckCircle2 size={13} /> Accept
                        </button>
                        <button onClick={() => handleRespond(req.id, false)} className="flex-1 px-3 py-2 rounded-xl bg-red-600/80 text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-red-500 transition-colors">
                          <XCircle size={13} /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
