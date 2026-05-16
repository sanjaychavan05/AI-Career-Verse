import { LayoutDashboard, User, FileText, Network, Dna, Mic, Map, Download, Briefcase, Users, BookOpen, UserCircle, Flame, Zap, Code2, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useGamification } from '../context/GamificationContext';
import { useUser } from '../context/UserContext';

const ROLE_LABELS = { STUDENT: 'Student', MENTOR: 'Mentor', TEACHER: 'Teacher' };
const ROLE_TITLES = { STUDENT: 'Full Stack Engineer', MENTOR: 'Senior Developer', TEACHER: 'Placement Officer' };

const allNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['STUDENT','MENTOR','TEACHER'] },
  { id: 'identity', label: 'Digital Identity', icon: User, roles: ['STUDENT'] },
  { id: 'resume', label: 'Resume Scorer', icon: FileText, roles: ['STUDENT'] },
  { id: 'skills', label: 'Skill Constellation', icon: Network, roles: ['STUDENT'] },
  { id: 'career-dna', label: 'Career DNA', icon: Dna, roles: ['STUDENT'] },
  { id: 'interview', label: 'Interview Lab', icon: Mic, roles: ['STUDENT'] },
  { id: 'coding', label: 'Coding Practice', icon: Code2, roles: ['STUDENT'] },
  { id: 'roadmap', label: 'Career Roadmap', icon: Map, roles: ['STUDENT'] },
  { id: 'jobs', label: 'Job Matching', icon: Briefcase, roles: ['STUDENT','MENTOR','TEACHER'] },
  { id: 'mentor-connect', label: 'Mentor Connect', icon: Radio, roles: ['STUDENT','MENTOR','TEACHER'] },
  { id: 'learning', label: 'Learning Hub', icon: BookOpen, roles: ['STUDENT'] },
  { id: 'community', label: 'Community', icon: Users, roles: ['STUDENT','MENTOR','TEACHER'] },
  { id: 'profile', label: 'Profile', icon: UserCircle, roles: ['STUDENT','MENTOR','TEACHER'] },
  { id: 'export', label: 'Pro Export', icon: Download, roles: ['STUDENT'] },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const { stats } = useGamification();
  const { user } = useUser();
  const role = user?.role || 'STUDENT';
  const userName = user?.name || 'Sanjay Chavan';
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] flex flex-col z-30
                       dark:bg-[#0D1117]/95 dark:border-r dark:border-white/[0.06]
                       bg-white/95 border-r border-gray-200/80 backdrop-blur-2xl">
      {/* Logo — bigger */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-aura-purple to-aura-indigo
                        flex items-center justify-center shadow-lg shadow-aura-purple/25 relative">
          <Zap size={20} className="text-white" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-aura-purple to-aura-indigo blur-lg opacity-40" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight dark:text-white text-gray-900">
            Career<span className="text-blue-800 dark:text-blue-400">Verse</span>
          </h1>
          <p className="text-[9px] font-mono dark:text-gray-500 text-gray-400 tracking-[0.18em] uppercase">AI Ecosystem</p>
        </div>
      </div>

      {/* XP Badge */}
      <div className="mx-4 mb-3 p-2.5 rounded-xl dark:bg-white/[0.02] bg-gray-50 border dark:border-white/[0.04] border-gray-200/60">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap size={11} className="text-amber-400" />
            <span className="text-[10px] font-bold dark:text-amber-400 text-amber-600">{stats.xp.toLocaleString()} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={11} className="text-orange-400" />
            <span className="text-[10px] font-bold dark:text-orange-400 text-orange-600">{stats.streak} days</span>
          </div>
        </div>
        <div className="w-full h-1 rounded-full dark:bg-white/[0.04] bg-gray-200 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-aura-purple"
            initial={{width:0}} animate={{width:`${Math.min((stats.xp % 1000) / 10, 100)}%`}} transition={{duration:1.5,ease:'easeOut'}}/>
        </div>
        <p className="text-[9px] dark:text-gray-600 text-gray-400 mt-1 text-center">
          {1000 - (stats.xp % 1000)} XP to Level {stats.level + 1}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
        <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] dark:text-gray-600 text-gray-400">Navigation</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button key={item.id} id={`nav-${item.id}`} onClick={() => setActiveTab(item.id)}
              whileHover={{x:2}} whileTap={{scale:0.98}}
              className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                isActive ? 'dark:text-white text-gray-900' : 'dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 hover:text-gray-700'
              }`}>
              {isActive && (
                <motion.div layoutId="activeTab"
                  className="absolute inset-0 rounded-xl dark:bg-aura-purple/[0.08] bg-violet-50 border dark:border-aura-purple/20 border-violet-200/50"
                  transition={{type:'spring',bounce:0.15,duration:0.5}}/>
              )}
              <Icon size={16} className={`relative z-10 ${isActive ? 'text-aura-purple' : 'dark:text-gray-600 text-gray-400 group-hover:text-aura-purple/60'}`}/>
              <span className="relative z-10">{item.label}</span>
              {isActive && <div className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-aura-purple shadow-lg shadow-aura-purple/50"/>}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-3 border-t dark:border-white/[0.04] border-gray-200/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] dark:text-gray-600 text-gray-400 font-semibold uppercase tracking-wider">Theme</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2.5 p-2 rounded-xl dark:bg-white/[0.02] bg-gray-50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aura-purple to-aura-indigo flex items-center justify-center text-white text-[10px] font-bold">{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-blue-800 dark:text-blue-400 truncate">{userName}</p>
            <p className="text-[9px] dark:text-gray-600 text-gray-400">{ROLE_TITLES[role] || ROLE_LABELS[role]}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
