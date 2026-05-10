import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Globe, Github, Calendar, Zap, Flame, Star, Trophy, Target, Award, Briefcase, Edit3, Save, X, LogOut } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useUser } from '../context/UserContext';

const ROLE_AVATARS = {
  STUDENT: 'https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=sanjay&backgroundColor=b6e3f4',
  MENTOR: 'https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=priya&backgroundColor=d1d4f9',
  TEACHER: 'https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=anand&backgroundColor=c0aede',
};

const ROLE_PROFILES = {
  STUDENT: {
    title: 'Python Full Stack Engineer',
    bio: 'Passionate developer building scalable web applications. Code Bharat 2025 finalist. Exploring AI/ML and system design.',
    achievements: [
      { icon: '🏆', title: 'Code Bharat 2025 — 3rd Place', desc: '500+ teams, 36hr hackathon' },
      { icon: '🔥', title: '23-Day Active Streak', desc: 'Consistent daily activity' },
      { icon: '💯', title: '92% ATS Resume Score', desc: 'Top-tier resume optimization' },
      { icon: '🎯', title: '85% Career Readiness', desc: 'AI-powered assessment' },
      { icon: '⭐', title: 'Top 15% React Developer', desc: 'Skill benchmark' },
      { icon: '📊', title: '116 GitHub Contributions', desc: 'Active contributor' },
    ],
  },
  MENTOR: {
    title: 'Senior Full Stack Developer',
    bio: 'Experienced mentor guiding students in full-stack development. 5+ years in industry. Passionate about helping the next generation succeed.',
    achievements: [
      { icon: '🛡️', title: '12 Students Mentored', desc: 'Active mentorship' },
      { icon: '⭐', title: '4.8/5 Mentor Rating', desc: 'Student reviews' },
      { icon: '💼', title: '5+ Years Experience', desc: 'Industry veteran' },
      { icon: '📝', title: '24 Code Reviews', desc: 'Quality feedback' },
    ],
  },
  TEACHER: {
    title: 'Placement Officer & Instructor',
    bio: 'Leading placement activities and training programs. Connecting students with top companies. 8+ years in education technology.',
    achievements: [
      { icon: '🎓', title: '200+ Students Placed', desc: 'Placement success' },
      { icon: '🏢', title: '15 Partner Companies', desc: 'Industry connections' },
      { icon: '📊', title: '92% Placement Rate', desc: 'Above benchmark' },
      { icon: '📚', title: '6 Courses Created', desc: 'Curriculum design' },
    ],
  },
};

export default function Profile() {
  const { stats } = useGamification();
  const { user, logout } = useUser();
  const role = user?.role || 'STUDENT';
  const roleProfile = ROLE_PROFILES[role];

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Sanjay Chavan',
    email: user?.email || 'sanjay.chavan@email.com',
    location: 'India',
    github: 'github.com/sanjaychavan05',
    website: 'sanjaychavan.dev',
    bio: roleProfile.bio,
  });

  const handleSave = () => {
    setEditing(false);
    // In production: axios.put('/api/profile', form)
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Profile Header */}
      <div className="glass-card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-blue-600/20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>

        <div className="px-6 pb-6 -mt-12 relative z-10">
          <div className="flex items-end gap-5">
            <div className="relative">
              <img src={ROLE_AVATARS[role]} alt="Avatar"
                className="w-24 h-24 rounded-2xl border-4 dark:border-[#0D1117] border-white shadow-xl bg-violet-600" />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 dark:border-[#0D1117] border-white" />
            </div>
            <div className="flex-1 pb-1">
              {editing ? (
                <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                  className="text-xl font-extrabold dark:text-white text-gray-900 bg-transparent border-b dark:border-white/20 border-gray-300 outline-none w-full max-w-xs" />
              ) : (
                <h2 className="text-xl font-extrabold dark:text-white text-gray-900">{form.name}</h2>
              )}
              <p className="text-sm font-semibold text-violet-400">{roleProfile.title}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase">
                {role}
              </span>
            </div>
            <div className="flex items-center gap-2 pb-2">
              {editing ? (
                <>
                  <button onClick={handleSave} className="btn-primary flex items-center gap-1.5 text-xs">
                    <Save size={12} /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-ghost flex items-center gap-1.5 text-xs">
                    <X size={12} /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-ghost flex items-center gap-1.5 text-xs dark:text-gray-400 text-gray-500">
                  <Edit3 size={12} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-3">
            {editing ? (
              <textarea value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))}
                className="w-full text-sm dark:text-gray-400 text-gray-500 bg-transparent border dark:border-white/10 border-gray-200 rounded-xl p-2 outline-none resize-none h-16" />
            ) : (
              <p className="text-sm dark:text-gray-400 text-gray-500 max-w-xl">{form.bio}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm dark:text-gray-400 text-gray-500">
            {editing ? (
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                <input value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="Email"
                  className="input-field text-xs" />
                <input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} placeholder="Location"
                  className="input-field text-xs" />
                <input value={form.github} onChange={e => setForm(p => ({...p, github: e.target.value}))} placeholder="GitHub"
                  className="input-field text-xs" />
                <input value={form.website} onChange={e => setForm(p => ({...p, website: e.target.value}))} placeholder="Website"
                  className="input-field text-xs" />
              </div>
            ) : (
              <>
                <span className="flex items-center gap-1.5"><Mail size={13} /> {form.email}</span>
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {form.location}</span>
                <span className="flex items-center gap-1.5"><Github size={13} /> {form.github}</span>
                <span className="flex items-center gap-1.5"><Globe size={13} /> {form.website}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Zap, label: 'Level', value: stats.level, color: 'from-violet-500 to-purple-600' },
          { icon: Flame, label: 'Day Streak', value: stats.streak, color: 'from-orange-500 to-red-600' },
          { icon: Star, label: 'Total XP', value: stats.xp.toLocaleString(), color: 'from-amber-500 to-orange-600' },
          { icon: Target, label: 'Readiness', value: `${stats.careerReadiness}%`, color: 'from-cyan-500 to-blue-500' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card p-4 text-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-xl font-extrabold font-mono dark:text-white text-gray-900">{s.value}</p>
              <p className="text-xs dark:text-gray-500 text-gray-400 uppercase tracking-wider">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Trophy size={13} className="text-amber-400" /> Achievements & Milestones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roleProfile.achievements.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl dark:bg-white/[0.02] bg-gray-50 border dark:border-white/[0.03] border-gray-200/40">
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="text-sm font-bold dark:text-white text-gray-900">{a.title}</p>
                <p className="text-xs dark:text-gray-500 text-gray-400">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button onClick={logout}
        className="w-full py-3 rounded-xl text-sm font-semibold dark:bg-red-500/10 bg-red-50 dark:text-red-400 text-red-600 border dark:border-red-500/20 border-red-200 hover:dark:bg-red-500/20 hover:bg-red-100 transition-all flex items-center justify-center gap-2">
        <LogOut size={14} /> Sign Out
      </button>
    </motion.div>
  );
}
