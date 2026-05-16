import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, WifiOff, Users, Send, CheckCircle2, XCircle, Clock,
  Sparkles, Zap, ArrowRight, MessageSquare, Shield, GraduationCap,
  BookOpen, Bell, Radio, Star, Calendar, ChevronDown, X
} from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';
import { useUser } from '../context/UserContext';

const MENTORS = [
  {
    email: 'anusha@careerverse.in', name: 'Anusha M', title: 'Senior Full Stack Developer',
    company: 'Google', bio: '15+ years in distributed systems. Ex-Meta, ex-Amazon. PhD CS Stanford.',
    skills: ['System Design', 'DSA', 'Career'], rating: 4.9, sessions: 128,
    available: true, gradient: 'from-pink-500 to-rose-600', initials: 'AM',
  },
  {
    email: 'rahul@careerverse.in', name: 'Rahul Patel', title: 'Backend Architect',
    company: 'Amazon', bio: 'Specializes in cloud architecture and behavioral interviews.',
    skills: ['Backend', 'Cloud', 'Interviews'], rating: 4.8, sessions: 94,
    available: true, gradient: 'from-blue-500 to-indigo-600', initials: 'RP',
  },
  {
    email: 'sneha@careerverse.in', name: 'Sneha Kapoor', title: 'Engineering Manager',
    company: 'Stripe', bio: 'Former IC turned manager. Focused on frontend excellence and team growth.',
    skills: ['Frontend', 'React', 'Leadership'], rating: 4.7, sessions: 76,
    available: false, gradient: 'from-violet-500 to-purple-600', initials: 'SK',
  },
  {
    email: 'james@careerverse.in', name: 'James Wilson', title: 'ML Engineer',
    company: 'DeepMind', bio: 'Published researcher in NLP and computer vision. PyTorch contributor.',
    skills: ['ML', 'Python', 'Research'], rating: 4.9, sessions: 52,
    available: true, gradient: 'from-emerald-500 to-teal-600', initials: 'JW',
  },
  {
    email: 'nina@careerverse.in', name: 'Nina Patel', title: 'SRE Lead',
    company: 'Netflix', bio: 'SRE veteran. Passionate about reliability and observability at scale.',
    skills: ['DevOps', 'Monitoring', 'Scale'], rating: 4.6, sessions: 63,
    available: true, gradient: 'from-cyan-500 to-blue-600', initials: 'NP',
  },
  {
    email: 'ryan@careerverse.in', name: 'Ryan Kim', title: 'Security Engineer',
    company: 'Cloudflare', bio: 'Web security specialist. Bug bounty hunter and open source contributor.',
    skills: ['Security', 'Networking', 'Rust'], rating: 4.8, sessions: 41,
    available: false, gradient: 'from-amber-500 to-orange-600', initials: 'RK',
  },
];

const STATUS_CONFIG = {
  PENDING: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock, label: 'Pending' },
  ACCEPTED: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2, label: 'Accepted' },
  REJECTED: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle, label: 'Rejected' },
};

export default function MentorConnect() {
  const { user } = useUser();
  const ws = useWebSocket();
  const userRole = user?.role || 'STUDENT';
  const userName = user?.name || 'Student';
  const userEmail = user?.email || '';

  const [showRequestModal, setShowRequestModal] = useState(null);
  const [message, setMessage] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // Messaging state
  const [chatMentor, setChatMentor] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const chatEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState(() => {
    try { const s = localStorage.getItem('cv_mentor_chats'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('cv_mentor_chats', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatMentor]);

  // Shared conversation key — same key regardless of who opens it
  const getChatKey = (otherEmail) => {
    const pair = [userEmail, otherEmail].sort();
    return `chat_${pair[0]}_${pair[1]}`;
  };

  const MENTOR_REPLIES = [
    "Great question! Let me think about that...",
    "I'd recommend starting with the fundamentals first.",
    "That's a really good approach. Keep going!",
    "I can schedule a call to discuss this further.",
    "Sure, I'll share some resources with you.",
    "Happy to help! What specific area are you struggling with?",
    "Let's break this down step by step.",
  ];

  const sendChat = () => {
    if (!chatMsg.trim() || !chatMentor) return;
    const key = getChatKey(chatMentor.email);
    const now = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    const newMsg = { from: userName, text: chatMsg.trim(), time: now };
    setChatHistory(prev => ({ ...prev, [key]: [...(prev[key] || []), newMsg] }));
    setChatMsg('');

    // Mentor auto-reply after 1.5s (persisted under same shared key)
    const mentorName = chatMentor.name;
    setTimeout(() => {
      const reply = MENTOR_REPLIES[Math.floor(Math.random() * MENTOR_REPLIES.length)];
      const replyTime = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
      setChatHistory(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), { from: mentorName, text: reply, time: replyTime }]
      }));
    }, 1500);
  };

  const sentRequests = ws.sentRequests || [];

  const incomingForMentor = ws.connectRequests.filter(
    (r) => r.mentorEmail === userEmail
  );
  const pendingForMentor = incomingForMentor.filter(
    (r) => r.status === 'PENDING'
  );
  const unreadResponses = ws.connectResponses.filter(
    (r) => r.studentEmail === userEmail
  );

  const handleSendRequest = () => {
    if (!showRequestModal || !message.trim()) return;
    ws.sendConnectRequest({
      studentName: userName,
      studentEmail: userEmail,
      mentorEmail: showRequestModal.email,
      message: message.trim(),
    });
    setMessage('');
    setShowRequestModal(null);
  };

  const handleRespond = (request, accept) => {
    ws.respondToConnect({
      requestId: request.requestId,
      mentorName: userName,
      mentorEmail: userEmail,
      studentEmail: request.studentEmail,
      status: accept ? 'ACCEPTED' : 'REJECTED',
      message: accept ? 'Happy to connect! Let\'s discuss your career goals.' : 'Sorry, I\'m not available at this time.',
    });
  };

  const filteredMentors = filterAvailable ? MENTORS.filter(m => m.available) : MENTORS;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Mentors</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">
            Connect with industry experts for career guidance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-1 rounded-xl dark:bg-white/[0.04] bg-gray-100 p-1">
            <button onClick={() => setFilterAvailable(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!filterAvailable ? 'bg-white dark:bg-white/10 dark:text-white text-gray-900 shadow' : 'dark:text-gray-400 text-gray-500'}`}>
              All
            </button>
            <button onClick={() => setFilterAvailable(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterAvailable ? 'bg-green-500 text-white shadow' : 'dark:text-gray-400 text-gray-500'}`}>
              Available
            </button>
          </div>

          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
            ws.connected
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {ws.connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {ws.connected ? 'Live' : 'Offline'}
          </div>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl dark:bg-white/[0.04] bg-gray-100 dark:hover:bg-white/[0.08] hover:bg-gray-200 transition-all"
          >
            <Bell size={16} className="dark:text-gray-400 text-gray-500" />
            {(pendingForMentor.length + unreadResponses.length) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {pendingForMentor.length + unreadResponses.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mentor/Teacher: Incoming Requests */}
      {userRole !== 'STUDENT' && incomingForMentor.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <Bell size={14} className="text-violet-400" />
            Incoming Requests
            {pendingForMentor.length > 0 && (
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                {pendingForMentor.length}
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incomingForMentor.map((req, i) => {
              const config = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = config.icon;
              return (
                <motion.div key={req.requestId || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`p-4 rounded-xl border dark:bg-white/[0.03] bg-white ${
                    req.status === 'PENDING' ? 'dark:border-amber-500/20 border-amber-200' : 'dark:border-white/[0.06] border-gray-200/60'
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {req.studentName?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold dark:text-white text-gray-900">{req.studentName}</h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${config.bg} ${config.color} ${config.border} border flex items-center gap-1`}>
                          <StatusIcon size={8} /> {config.label}
                        </span>
                      </div>
                      <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">{req.message}</p>
                    </div>
                  </div>
                  {req.status === 'PENDING' && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleRespond(req, true)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} /> Accept
                      </button>
                      <button onClick={() => handleRespond(req, false)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-1">
                        <XCircle size={12} /> Decline
                      </button>
                    </div>
                  )}
                  {req.status === 'ACCEPTED' && (
                    <div className="flex gap-2 mt-3">
                      <div className="flex-1 py-2 rounded-xl text-xs font-bold text-center bg-green-500/10 text-green-400 border border-green-500/20">Connected</div>
                      <button onClick={() => setChatMentor({ email: req.studentEmail || req.studentName?.toLowerCase().replace(/ /g,'.') + '@careerverse.in', name: req.studentName, title: 'Student', company: 'CareerVerse', gradient: 'from-violet-500 to-indigo-600', initials: req.studentName?.split(' ').map(w=>w[0]).join('') || 'S' })}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/20">
                        <MessageSquare size={12} /> Message
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Mentor Card Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMentors.map((mentor, idx) => {
          const sentReq = sentRequests.find((r) => r.mentorEmail === mentor.email && r.status !== 'REJECTED');
          const reqStatus = sentReq?.status;

          return (
            <motion.div
              key={mentor.email}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-5 flex flex-col transition-all hover:dark:border-white/[0.1] hover:border-gray-300 hover:shadow-lg hover:shadow-violet-600/5"
            >
              {/* Top: Avatar + Name + Status */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mentor.gradient} flex items-center justify-center text-white text-base font-bold shadow-lg`}>
                    {mentor.initials}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 dark:border-[#0D1117] border-white ${
                    mentor.available ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold dark:text-white text-gray-900">{mentor.name}</h4>
                  <p className="text-xs dark:text-gray-400 text-gray-500">{mentor.title} @ {mentor.company}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs dark:text-gray-400 text-gray-500 leading-relaxed mb-3 flex-1">
                {mentor.bio}
              </p>

              {/* Skills */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {mentor.skills.map((s) => (
                  <span key={s} className="tag-badge">
                    {s}
                  </span>
                ))}
              </div>

              {/* Rating + Sessions */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold dark:text-white text-gray-900">{mentor.rating}</span>
                </div>
                <div className="flex items-center gap-1 dark:text-gray-500 text-gray-400">
                  <Calendar size={11} />
                  <span className="text-xs">{mentor.sessions} sessions</span>
                </div>
              </div>

              {/* Action Buttons — Only students can request */}
              {reqStatus === 'ACCEPTED' ? (
                <div className="flex gap-2">
                  <div className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center bg-green-500/10 text-green-400 border border-green-500/20">Connected</div>
                  <button onClick={() => setChatMentor(mentor)} className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/20">
                    <MessageSquare size={12} /> Message
                  </button>
                </div>
              ) : reqStatus ? (
                <div className={`w-full py-2.5 rounded-xl text-xs font-bold text-center border ${
                  STATUS_CONFIG[reqStatus]?.bg || 'bg-amber-500/10'
                } ${STATUS_CONFIG[reqStatus]?.color || 'text-amber-400'} ${
                  STATUS_CONFIG[reqStatus]?.border || 'border-amber-500/20'
                }`}>
                  {STATUS_CONFIG[reqStatus]?.label || 'Pending'}
                </div>
              ) : userRole === 'STUDENT' && mentor.available ? (
                <button
                  onClick={() => setShowRequestModal(mentor)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-1.5"
                >
                  Request Mentorship
                </button>
              ) : !mentor.available ? (
                <button disabled
                  className="w-full py-2.5 rounded-xl text-xs font-bold dark:bg-white/[0.04] bg-gray-100 dark:text-gray-500 text-gray-400 cursor-not-allowed">
                  Unavailable
                </button>
              ) : (
                <div className="w-full py-2.5 rounded-xl text-xs font-bold text-center dark:bg-white/[0.04] bg-gray-100 dark:text-gray-400 text-gray-500 border dark:border-white/[0.06] border-gray-200">
                  Mentor Profile
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Student Responses */}
      {userRole === 'STUDENT' && unreadResponses.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-400" />
            Mentor Responses
          </h3>
          {unreadResponses.map((resp, i) => {
            const config = STATUS_CONFIG[resp.status] || STATUS_CONFIG.ACCEPTED;
            const StatusIcon = config.icon;
            return (
              <motion.div key={resp.requestId || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`p-4 rounded-xl border ${config.bg} ${config.border}`}>
                <div className="flex items-center gap-3">
                  <StatusIcon size={20} className={config.color} />
                  <div className="flex-1">
                    <p className="text-sm font-bold dark:text-white text-gray-900">
                      {resp.mentorName} {resp.status === 'ACCEPTED' ? 'accepted' : 'declined'} your request
                    </p>
                    {resp.message && <p className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">{resp.message}</p>}
                  </div>
                  <button onClick={() => ws.dismissConnectResponse(resp.requestId)}
                    className="text-xs dark:text-gray-500 text-gray-400 hover:text-gray-300">
                    Dismiss
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── Request Modal ─── */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRequestModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 rounded-2xl dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${showRequestModal.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {showRequestModal.initials}
                </div>
                <div>
                  <h3 className="text-base font-bold dark:text-white text-gray-900">{showRequestModal.name}</h3>
                  <p className="text-xs dark:text-gray-400 text-gray-500">{showRequestModal.title} @ {showRequestModal.company}</p>
                </div>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'd love to connect and learn about..."
                className="w-full px-4 py-3 rounded-xl text-sm dark:bg-white/[0.04] bg-gray-50 dark:text-white text-gray-900 placeholder-gray-500 border dark:border-white/[0.06] border-gray-200 outline-none focus:border-green-500/40 transition-colors resize-none"
                rows={4}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold dark:bg-white/[0.04] bg-gray-100 dark:text-gray-300 text-gray-600 hover:dark:bg-white/[0.08] hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!message.trim() || !ws.connected}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={14} /> Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-8 w-80 z-50 rounded-2xl p-4 dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl space-y-3"
          >
            <h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider">Notifications</h4>
            {[...pendingForMentor, ...unreadResponses].length === 0 ? (
              <p className="text-xs dark:text-gray-500 text-gray-400 text-center py-4">No new notifications</p>
            ) : (
              [...pendingForMentor, ...unreadResponses].map((item, i) => (
                <div key={i} className="p-2 rounded-lg dark:bg-white/[0.04] bg-gray-50 text-xs dark:text-gray-300 text-gray-600">
                  {item.studentName
                    ? `🔗 ${item.studentName} wants to connect`
                    : `✅ ${item.mentorName} responded: ${item.status}`
                  }
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Chat Panel ─── */}
      <AnimatePresence>
        {chatMentor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setChatMentor(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg mx-4 rounded-2xl dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl flex flex-col" style={{ height: '500px' }}>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b dark:border-white/[0.06] border-gray-200">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chatMentor.gradient} flex items-center justify-center text-white text-sm font-bold`}>{chatMentor.initials}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold dark:text-white text-gray-900">{chatMentor.name}</h4>
                  <p className="text-[10px] dark:text-gray-400 text-gray-500">{chatMentor.title} @ {chatMentor.company}</p>
                </div>
                <button onClick={() => setChatMentor(null)} className="p-1.5 rounded-lg dark:hover:bg-white/[0.06] hover:bg-gray-100"><X size={16} className="dark:text-gray-400 text-gray-500" /></button>
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(chatHistory[getChatKey(chatMentor.email)] || []).length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare size={28} className="dark:text-gray-600 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs dark:text-gray-500 text-gray-400">Start a conversation with {chatMentor.name}</p>
                  </div>
                ) : (
                  (chatHistory[getChatKey(chatMentor.email)] || []).map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === userName ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-xl text-xs ${
                        msg.from === userName
                          ? 'bg-violet-600 text-white rounded-br-sm'
                          : 'dark:bg-white/[0.06] bg-gray-100 dark:text-gray-200 text-gray-700 rounded-bl-sm'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[9px] mt-1 ${msg.from === userName ? 'text-violet-200' : 'dark:text-gray-500 text-gray-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              {/* Input */}
              <div className="p-3 border-t dark:border-white/[0.06] border-gray-200 flex gap-2">
                <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs dark:bg-white/[0.04] bg-gray-50 dark:text-white text-gray-900 border dark:border-white/[0.06] border-gray-200 outline-none focus:border-violet-500/40" />
                <button onClick={sendChat} disabled={!chatMsg.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center gap-1">
                  <Send size={12} /> Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
