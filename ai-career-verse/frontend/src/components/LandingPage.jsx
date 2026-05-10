import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, GraduationCap, Shield, BookOpen, ArrowRight, Eye, EyeOff, Sparkles, ChevronRight, Star, Users, Code2 } from 'lucide-react';
import { PRESET_ACCOUNTS } from '../context/PlatformContext';

const ROLES = [
  {
    id: 'STUDENT',
    label: 'Student',
    icon: '🎓',
    description: 'Track skills, practice interviews, build your career DNA',
    gradient: 'from-violet-600 to-purple-700',
    shadow: 'shadow-violet-600/30',
    features: ['AI Interview Lab', 'Career DNA Analysis', 'Skill Constellation', 'Resume Scorer'],
  },
  {
    id: 'MENTOR',
    label: 'Mentor',
    icon: '🛡️',
    description: 'Guide students, review progress, share opportunities',
    gradient: 'from-indigo-600 to-blue-700',
    shadow: 'shadow-indigo-600/30',
    features: ['Mentorship Dashboard', 'Student Requests', 'Job Posting', 'Progress Tracking'],
  },
  {
    id: 'TEACHER',
    label: 'Teacher',
    icon: '📚',
    description: 'Manage placements, track cohorts, post opportunities',
    gradient: 'from-blue-600 to-cyan-700',
    shadow: 'shadow-blue-600/30',
    features: ['Placement Leaderboard', 'Cohort Management', 'Job Portal Admin', 'Analytics'],
  },
];

const STATS = [
  { icon: Users, value: '2,500+', label: 'Active Students' },
  { icon: Code2, value: '150+', label: 'Interview Questions' },
  { icon: Star, value: '92%', label: 'Avg ATS Score' },
  { icon: BookOpen, value: '6', label: 'Learning Tracks' },
];

export default function LandingPage({ onAuth }) {
  const [mode, setMode] = useState('landing'); // 'landing' | 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  /* Auto-fill when switching role in sign-in mode */
  const selectRole = (roleId) => {
    setSelectedRole(roleId);
    setAuthError('');
    if (mode === 'signin') {
      const acc = PRESET_ACCOUNTS[roleId];
      setForm({ name: acc.name, email: acc.email, password: acc.password });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    if (mode === 'signin') {
      // Check against preset accounts
      const acc = PRESET_ACCOUNTS[selectedRole];
      if (form.email === acc.email && form.password === acc.password) {
        setTimeout(() => {
          onAuth({ role: selectedRole, name: acc.name, email: acc.email });
          setLoading(false);
        }, 600);
      } else {
        setTimeout(() => {
          setAuthError('Invalid credentials. Use the preset accounts below.');
          setLoading(false);
        }, 600);
      }
    } else {
      // Sign up — allow any name
      setTimeout(() => {
        onAuth({ role: selectedRole, name: form.name || 'User', email: form.email });
        setLoading(false);
      }, 600);
    }
  };

  if (mode === 'landing') {
    return (
      <div className="min-h-screen bg-[#0A0E1A] text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/5 rounded-full blur-3xl" />
        </div>

        {/* Nav */}
        <nav className="relative z-10 max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">
                AI Career<span className="text-blue-500">Verse</span>
              </h1>
              <p className="text-[8px] font-mono text-gray-600 tracking-[0.18em] uppercase">Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setMode('signin')} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => setMode('signup')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 transition-all">
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-semibold text-gray-400 mb-6">
              <Sparkles size={12} className="text-violet-400" /> AI-Powered Career Intelligence Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight max-w-4xl mx-auto">
              Your Career Journey,
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Powered by Intelligence
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6 leading-relaxed">
              AI CareerVerse combines artificial intelligence with career development — from skill tracking
              and interview prep to resume optimization and career DNA analysis.
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                onClick={() => setMode('signup')}
                className="px-8 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all flex items-center gap-2">
                Start Free <ArrowRight size={16} />
              </motion.button>
              <button onClick={() => setMode('signin')}
                className="px-8 py-3.5 rounded-xl text-base font-semibold text-gray-300 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all">
                Sign In
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="grid grid-cols-4 gap-6 max-w-3xl mx-auto mt-16">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <Icon size={20} className="text-violet-400 mx-auto mb-2" />
                  <p className="text-2xl font-extrabold font-mono">{s.value}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Role Cards */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 pb-20">
          <h2 className="text-center text-xl font-bold text-gray-300 mb-8">Choose Your Role</h2>
          <div className="grid grid-cols-3 gap-5">
            {ROLES.map((role, i) => (
              <motion.div key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }} whileHover={{ y: -5 }}
                className="rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group"
                onClick={() => { setSelectedRole(role.id); setMode('signup'); }}>
                <span className="text-4xl block mb-3">{role.icon}</span>
                <h3 className="text-lg font-bold mb-1 group-hover:text-violet-400 transition-colors">{role.label}</h3>
                <p className="text-sm text-gray-500 mb-4">{role.description}</p>
                <div className="space-y-1.5">
                  {role.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight size={10} className="text-violet-500" /> {f}
                    </div>
                  ))}
                </div>
                <div className={`mt-4 px-4 py-2 rounded-xl bg-gradient-to-r ${role.gradient} text-white text-sm font-semibold text-center ${role.shadow} shadow-lg opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Get Started as {role.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Auth Form (Sign In / Sign Up)
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md mx-4">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-600/30 mx-auto mb-4">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold">
            AI Career<span className="text-blue-500">Verse</span>
          </h1>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
          <h2 className="text-lg font-bold text-center mb-5">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {/* Role Selection (for both signin and signup) */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Role</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(role => (
                <button key={role.id} onClick={() => selectRole(role.id)}
                  className={`p-3 rounded-xl text-center transition-all border ${
                    selectedRole === role.id
                      ? `bg-gradient-to-br ${role.gradient} border-transparent text-white shadow-lg ${role.shadow}`
                      : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/[0.1]'
                  }`}>
                  <span className="text-2xl block mb-1">{role.icon}</span>
                  <span className="text-xs font-bold">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <input type="text" placeholder="Full Name" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] text-white placeholder-gray-600 border border-white/[0.06] outline-none focus:border-violet-500/40 transition-colors" />
            )}

            <input type="email" placeholder="Email Address" value={form.email} required
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] text-white placeholder-gray-600 border border-white/[0.06] outline-none focus:border-violet-500/40 transition-colors" />

            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} required
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] text-white placeholder-gray-600 border border-white/[0.06] outline-none focus:border-violet-500/40 transition-colors pr-11" />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{mode === 'signin' ? `Sign In as ${ROLES.find(r => r.id === selectedRole)?.label}` : `Sign Up as ${ROLES.find(r => r.id === selectedRole)?.label}`} <ArrowRight size={14} /></>
              )}
            </motion.button>
            {authError && (
              <p className="text-xs text-red-400 text-center mt-2">{authError}</p>
            )}
          </form>

          {/* Preset Accounts */}
          {mode === 'signin' && (
            <div className="mt-4 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-2">Quick Login Credentials</p>
              {Object.values(PRESET_ACCOUNTS).map(acc => (
                <div key={acc.role} className="flex items-center justify-between py-1">
                  <span className="text-[11px] text-gray-400">{acc.role === 'STUDENT' ? '🎓' : acc.role === 'MENTOR' ? '🛡️' : '📚'} {acc.name}</span>
                  <span className="text-[10px] font-mono text-gray-500">{acc.email} / {acc.password}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-violet-400 font-semibold ml-1.5 hover:text-violet-300 transition-colors">
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        <button onClick={() => setMode('landing')}
          className="block mx-auto mt-4 text-sm text-gray-600 hover:text-gray-400 transition-colors">
          ← Back to home
        </button>
      </motion.div>
    </div>
  );
}
