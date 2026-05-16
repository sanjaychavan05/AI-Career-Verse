import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, WifiOff, Users, Send, CheckCircle2, XCircle, Clock,
  Sparkles, Zap, ArrowRight, MessageSquare, Shield, GraduationCap,
  BookOpen, Bell, Radio, ChevronDown, ChevronUp, UserPlus
} from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';
import { useUser } from '../context/UserContext';

const AVAILABLE_MENTORS = [
  { email: 'priya@careerverse.in', name: 'Priya Sharma', title: 'Senior Full Stack Developer', skills: ['React', 'Node.js', 'AWS', 'System Design'], avatar: '🛡️', specialty: 'Full Stack & Cloud' },
  { email: 'rahul@careerverse.in', name: 'Rahul Patel', title: 'Backend Architect', skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka'], avatar: '⚡', specialty: 'Backend & Distributed Systems' },
];

const ROLE_ICONS = { STUDENT: GraduationCap, MENTOR: Shield, TEACHER: BookOpen };
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

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Use context-level sentRequests instead of local state
  const sentRequests = ws.sentRequests || [];

  // Filter connect requests relevant to current user (for mentor view)
  const myRequests = ws.connectRequests.filter(
    (r) => r.mentorEmail === userEmail || r.studentEmail === userEmail
  );

  // For mentor: show requests where they are the mentor
  const incomingForMentor = ws.connectRequests.filter(
    (r) => r.mentorEmail === userEmail
  );

  const pendingForMentor = incomingForMentor.filter(
    (r) => r.status === 'PENDING'
  );

  const unreadResponses = ws.connectResponses.filter(
    (r) => r.studentEmail === userEmail
  );

  // ── Send Connect Request (Student) ──
  const handleSendRequest = () => {
    if (!selectedMentor || !message.trim()) return;

    const requestData = {
      studentName: userName,
      studentEmail: userEmail,
      mentorEmail: selectedMentor.email,
      message: message.trim(),
    };

    ws.sendConnectRequest(requestData);
    setMessage('');
    setSelectedMentor(null);
  };

  // ── Respond to Request (Mentor) ──
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900 flex items-center gap-2">
            <Radio size={24} className="text-violet-400" />
            Mentor Connect
            <span className="text-sm font-mono ml-2">— Role-Mesh Live</span>
          </h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">
            Real-time connection ecosystem powered by WebSocket
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
            ws.connected
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {ws.connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {ws.connected ? 'Live' : 'Offline'}
            <span className="w-2 h-2 rounded-full animate-pulse" style={{
              backgroundColor: ws.connected ? '#4ade80' : '#f87171'
            }} />
          </div>

          {/* Online Count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold">
            <Users size={12} />
            {ws.onlineCount} Online
          </div>

          {/* Notifications Bell */}
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

      {/* Status Banner */}
      <div className="rounded-2xl p-5 dark:bg-gradient-to-r dark:from-violet-600/10 dark:via-indigo-600/5 dark:to-transparent bg-gradient-to-r from-violet-50 to-transparent border dark:border-violet-500/10 border-violet-200/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/25">
            <Zap size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold dark:text-white text-gray-900">
              WebSocket Broker Active
            </h3>
            <p className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">
              STOMP over SockJS • End-to-end real-time sync • No page refreshes
            </p>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-lg font-extrabold font-mono dark:text-white text-gray-900">
                {ws.jobFeed.length}
              </p>
              <p className="text-[9px] dark:text-gray-500 text-gray-400 uppercase tracking-wider">Live Jobs</p>
            </div>
            <div>
              <p className="text-lg font-extrabold font-mono text-violet-400">
                {userRole === 'STUDENT' ? sentRequests.length : incomingForMentor.length}
              </p>
              <p className="text-[9px] dark:text-gray-500 text-gray-400 uppercase tracking-wider">Requests</p>
            </div>
            <div>
              <p className="text-lg font-extrabold font-mono text-green-400">
                {ws.connectResponses.filter((r) => r.status === 'ACCEPTED').length}
              </p>
              <p className="text-[9px] dark:text-gray-500 text-gray-400 uppercase tracking-wider">Connected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ─── Left: Send Connect Request (Student) / Incoming Requests (Mentor) ─── */}
        <div className="lg:col-span-2 space-y-4">
          {userRole === 'STUDENT' ? (
            <>
              <h3 className="text-sm font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider flex items-center gap-2">
                <UserPlus size={14} className="text-violet-400" />
                Connect with Mentors
              </h3>

              {/* Mentor Cards */}
              <div className="space-y-3">
                {AVAILABLE_MENTORS.map((mentor) => {
                  const isSent = sentRequests.find((r) => r.mentorEmail === mentor.email && r.status !== 'REJECTED');
                  const isSelected = selectedMentor?.email === mentor.email;

                  return (
                    <motion.div
                      key={mentor.email}
                      whileHover={{ x: 2 }}
                      onClick={() => !isSent && setSelectedMentor(isSelected ? null : mentor)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'dark:bg-violet-500/10 bg-violet-50 dark:border-violet-500/20 border-violet-200'
                          : 'dark:bg-white/[0.03] bg-white dark:border-white/[0.06] border-gray-200/60 dark:hover:border-white/[0.08] hover:border-gray-300'
                      } ${isSent ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{mentor.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold dark:text-white text-gray-900">{mentor.name}</h4>
                          <p className="text-xs dark:text-gray-400 text-gray-500">{mentor.title}</p>
                          <p className="text-[10px] text-violet-400 font-semibold mt-0.5">{mentor.specialty}</p>
                        </div>
                        {isSent ? (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                            STATUS_CONFIG[isSent.status]?.bg || 'bg-amber-500/10'
                          } ${STATUS_CONFIG[isSent.status]?.color || 'text-amber-400'} ${
                            STATUS_CONFIG[isSent.status]?.border || 'border-amber-500/20'
                          } border`}>
                            {STATUS_CONFIG[isSent.status]?.label || 'Pending'}
                          </span>
                        ) : (
                          <ArrowRight size={14} className={`transition-transform ${isSelected ? 'text-violet-400 rotate-90' : 'dark:text-gray-600 text-gray-400'}`} />
                        )}
                      </div>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {mentor.skills.map((s) => (
                          <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">{s}</span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Message Input */}
              <AnimatePresence>
                {selectedMentor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60 space-y-3">
                      <p className="text-xs font-bold dark:text-gray-300 text-gray-600">
                        <MessageSquare size={12} className="inline mr-1 text-violet-400" />
                        Message to {selectedMentor.name}
                      </p>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi! I'd love to connect and learn about..."
                        className="w-full px-4 py-3 rounded-xl text-sm dark:bg-white/[0.04] bg-gray-50 dark:text-white text-gray-900 placeholder-gray-500 border dark:border-white/[0.06] border-gray-200 outline-none focus:border-violet-500/40 transition-colors resize-none"
                        rows={3}
                      />
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendRequest}
                        disabled={!message.trim() || !ws.connected}
                        className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send size={14} />
                        Send Connect Request
                        {ws.connected && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              {/* Mentor/Teacher: Incoming requests */}
              <h3 className="text-sm font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider flex items-center gap-2">
                <Bell size={14} className="text-violet-400" />
                Incoming Requests
                {pendingForMentor.length > 0 && (
                  <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                    {pendingForMentor.length}
                  </span>
                )}
              </h3>

              {incomingForMentor.length === 0 ? (
                <div className="p-8 rounded-xl dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60 text-center">
                  <Radio size={28} className="dark:text-gray-600 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm dark:text-gray-500 text-gray-400">No incoming requests yet</p>
                  <p className="text-xs dark:text-gray-600 text-gray-400 mt-1">Student requests will appear here in real-time</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {incomingForMentor.map((req, i) => {
                    const config = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
                    const StatusIcon = config.icon;
                    return (
                      <motion.div
                        key={req.requestId || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border dark:bg-white/[0.03] bg-white ${
                          req.status === 'PENDING' ? 'dark:border-amber-500/20 border-amber-200' : 'dark:border-white/[0.06] border-gray-200/60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {req.studentName?.charAt(0) || 'S'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold dark:text-white text-gray-900">{req.studentName}</h4>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${config.bg} ${config.color} ${config.border} border flex items-center gap-1`}>
                                <StatusIcon size={8} />
                                {config.label}
                              </span>
                            </div>
                            <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">{req.message}</p>
                            <p className="text-[9px] dark:text-gray-600 text-gray-400 mt-1 font-mono">{req.studentEmail}</p>
                          </div>
                        </div>
                        {req.status === 'PENDING' && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleRespond(req, true)}
                              className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 size={12} /> Accept
                            </button>
                            <button
                              onClick={() => handleRespond(req, false)}
                              className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
                            >
                              <XCircle size={12} /> Decline
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* ─── Right: Activity Feed + Live Job Feed ─── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Live Job Feed */}
          <h3 className="text-sm font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-violet-400" />
            Live Job Feed
            <span className="ml-auto text-[10px] font-mono dark:text-gray-600 text-gray-400">
              /topic/job-feed
            </span>
          </h3>

          {ws.jobFeed.length === 0 ? (
            <div className="p-10 rounded-xl dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60 text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                <Radio size={24} className="text-violet-400 animate-pulse" />
              </div>
              <p className="text-sm font-bold dark:text-gray-400 text-gray-500">Listening for live jobs...</p>
              <p className="text-xs dark:text-gray-600 text-gray-400 mt-1">
                When a Mentor or Teacher posts a job, it appears here instantly
              </p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {ws.jobFeed.map((job, i) => (
                <motion.div
                  key={job.id || i}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.3 }}
                  className="p-4 rounded-xl dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60 relative overflow-hidden"
                >
                  {/* Live indicator */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    LIVE
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {job.postedByRole === 'MENTOR' ? '🛡️' : '📚'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold dark:text-white text-gray-900">{job.title}</h4>
                      <p className="text-xs dark:text-gray-400 text-gray-500">{job.company} • {job.location}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{job.type}</span>
                        {job.salary && <span className="text-[10px] dark:text-gray-400 text-gray-500">{job.salary}</span>}
                      </div>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {(job.skills || []).slice(0, 4).map((s) => (
                          <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">{s}</span>
                        ))}
                      </div>
                      <p className="text-[10px] dark:text-gray-600 text-gray-400 mt-2 font-mono">
                        Posted by {job.postedBy} ({job.postedByRole}) •{' '}
                        {job.timestamp ? new Date(job.timestamp).toLocaleTimeString() : 'just now'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Responses / Notifications (for students) */}
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
                  <motion.div
                    key={resp.requestId || i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border ${config.bg} ${config.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon size={20} className={config.color} />
                      <div className="flex-1">
                        <p className="text-sm font-bold dark:text-white text-gray-900">
                          {resp.mentorName} {resp.status === 'ACCEPTED' ? 'accepted' : 'declined'} your request
                        </p>
                        {resp.message && <p className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">{resp.message}</p>}
                      </div>
                      <button
                        onClick={() => ws.dismissConnectResponse(resp.requestId)}
                        className="text-xs dark:text-gray-500 text-gray-400 hover:text-gray-300"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-8 w-80 z-50 rounded-2xl p-4 dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl space-y-3"
          >
            <h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider">Real-time Notifications</h4>
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
    </motion.div>
  );
}
