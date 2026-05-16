import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserContext } from './context/UserContext';
import { PlatformProvider } from './context/PlatformContext';
import { WebSocketProvider } from './context/WebSocketContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DigitalIdentityHub from './components/DigitalIdentityHub';
import ResumeScorer from './components/ResumeScorer';
import SkillConstellation from './components/SkillConstellation';
import CareerDNA from './components/CareerDNA';
import InterviewLab from './components/InterviewLab';
import CareerRoadmap from './components/CareerRoadmap';
import ProExport from './components/ProExport';
import JobPortal from './components/JobPortal';
import Community from './components/Community';
import LearningHub from './components/LearningHub';
import Profile from './components/Profile';
import AIMentorOrb from './components/AIMentorOrb';
import LandingPage from './components/LandingPage';
import CodingPractice from './components/CodingPractice';
import MentorConnect from './components/MentorConnect';

const views = {
  dashboard: Dashboard, identity: DigitalIdentityHub, resume: ResumeScorer,
  skills: SkillConstellation, 'career-dna': CareerDNA, interview: InterviewLab,
  roadmap: CareerRoadmap, export: ProExport, jobs: JobPortal,
  community: Community, learning: LearningHub, profile: Profile,
  coding: CodingPractice, 'mentor-connect': MentorConnect,
};

const viewLabels = {
  dashboard:'Dashboard', identity:'Digital Identity', resume:'Resume Scorer',
  skills:'Skill Constellation', 'career-dna':'Career DNA', interview:'Interview Lab',
  roadmap:'Career Roadmap', export:'Pro Export', jobs:'Job Matching',
  community:'Community', learning:'Learning Hub', profile:'Profile',
  coding:'Coding Practice', 'mentor-connect':'Mentor Connect',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  // Show landing page if not authenticated
  if (!user) {
    return <LandingPage onAuth={(userData) => setUser(userData)} />;
  }

  const ActiveView = views[activeTab];
  const handleLogout = () => { setUser(null); setActiveTab('dashboard'); };

  return (
    <UserContext.Provider value={{ user, logout: handleLogout }}>
      <PlatformProvider>
        <WebSocketProvider userEmail={user?.email}>
          <div className="min-h-screen transition-colors duration-300 dark:bg-[#0D1117] bg-[#F6F8FA] relative">
            <div className="fixed inset-0 pointer-events-none dark:opacity-100 opacity-0 transition-opacity duration-500"
              style={{background:'radial-gradient(ellipse at 15% 15%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 85% 85%, rgba(99,102,241,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.02) 0%, transparent 60%)'}}/>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="ml-[260px] min-h-screen relative z-10">
              <div className="max-w-6xl mx-auto px-8 py-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-mono dark:text-gray-700 text-gray-400 uppercase tracking-[0.15em]">
                    CareerVerse / {viewLabels[activeTab]}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={activeTab}
                    initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                    transition={{duration:0.25}}>
                    {activeTab === 'skills'
                      ? <SkillConstellation onNavigate={setActiveTab} />
                      : <ActiveView />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>

            <AIMentorOrb />
          </div>
        </WebSocketProvider>
      </PlatformProvider>
    </UserContext.Provider>
  );
}
