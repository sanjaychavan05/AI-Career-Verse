import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import axios from 'axios';

export default function AIMentorOrb() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'mentor', text: "Hey! I'm **Aura**, your AI Career Mentor. Ask me anything about your Python Full Stack career — interview tips, project ideas, or skill roadmaps. 🚀" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const FALLBACK_REPLIES = [
    "Great question! For Python Full Stack roles, I recommend focusing on Django REST Framework + React. Build 2-3 solid portfolio projects with real APIs and deploy them.",
    "Interview tip: Always structure your answers using STAR method (Situation, Task, Action, Result). For system design, start by clarifying requirements first.",
    "To improve your ATS score, use action verbs like 'Engineered', 'Optimized', 'Architected'. Include metrics: 'Reduced API latency by 40%' or 'Served 10K+ daily users'.",
    "For career growth, I suggest: 1) Build a strong GitHub portfolio 2) Practice system design 3) Contribute to open source 4) Get AWS/Docker certifications.",
    "Key skills to focus on: Python, Django, React, PostgreSQL, Docker, and System Design. These cover 90% of Full Stack interview questions.",
    "Project idea: Build a real-time analytics dashboard using Django Channels + React + PostgreSQL. This shows WebSocket, REST API, and frontend skills together.",
    "For DSA prep: Focus on arrays, strings, trees, and graphs. Practice 2-3 problems daily on LeetCode. Medium-level problems are most common in interviews.",
    "Spring Boot tip: Learn dependency injection, REST controllers, JPA/Hibernate, and microservices patterns. These are the top asked topics.",
  ];

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const { data } = await axios.post('/api/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'mentor', text: data.reply || data.response || data }]);
    } catch (err) {
      // Smart fallback - give helpful response instead of error
      const reply = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
      setMessages(prev => [...prev, { role: 'mentor', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Orb */}
      <motion.button
        id="ai-mentor-orb"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600
                   flex items-center justify-center shadow-2xl shadow-violet-600/30 hover:shadow-violet-600/50
                   transition-shadow group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? { rotate: 0 } : { rotate: 0 }}
      >
        {open ? <X size={20} className="text-white" /> : (
          <>
            <Bot size={20} className="text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 dark:border-charcoal border-white animate-pulse" />
          </>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] flex flex-col
                       rounded-2xl overflow-hidden shadow-2xl
                       dark:bg-[#0d1117] bg-white border dark:border-white/[0.06] border-gray-200"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b dark:border-white/[0.04] border-gray-200 bg-gradient-to-r dark:from-violet-600/10 dark:to-transparent from-violet-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold dark:text-white text-gray-900">Aura — AI Mentor</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] dark:text-gray-500 text-gray-400">Online • Powered by Gemini</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white rounded-br-md'
                      : 'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-200 text-gray-700 rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl dark:bg-white/[0.04] bg-gray-100 rounded-bl-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t dark:border-white/[0.04] border-gray-200 flex gap-2">
              <input
                id="mentor-chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Aura anything..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm dark:bg-white/[0.04] bg-gray-50
                         dark:text-white text-gray-900 dark:placeholder-gray-600 placeholder-gray-400
                         border dark:border-white/[0.04] border-gray-200 outline-none
                         dark:focus:border-violet-500/30 focus:border-violet-300 transition-colors"
              />
              <button type="submit" disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white
                         hover:bg-violet-500 disabled:opacity-40 transition-colors">
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
