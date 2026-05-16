import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, TrendingUp, Target, Briefcase, Code2, ChevronLeft, ChevronRight, Sparkles, Users, CheckCircle2, XCircle, Clock, GraduationCap, BarChart3, Award } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useUser } from '../context/UserContext';
import { usePlatform } from '../context/PlatformContext';
import { useWebSocket } from '../context/WebSocketContext';

const WAVE_DATA = { learning:[32,45,40,55,48,62,55], coding:[25,38,52,45,58,50,42], interview:[18,22,30,28,35,32,25] };
const WAVE_CONFIGS = [
  { key:'learning', label:'Learning', color:'#14B8A6' },
  { key:'coding', label:'Coding', color:'#3B82F6' },
  { key:'interview', label:'Interview', color:'#EC4899' },
];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const AI_INSIGHTS = [
  { icon:'🏗️', text:'Your backend engineering readiness increased by 12% this week.' },
  { icon:'☁️', text:'You are highly compatible with cloud engineering roles.' },
  { icon:'🎯', text:'Focus on system design to improve senior-level readiness.' },
  { icon:'⚛️', text:'Your React proficiency is in the top 15% of candidates.' },
  { icon:'🏆', text:'Consider adding AWS certifications to boost your profile by 18%.' },
  { icon:'📈', text:'Interview confidence score improved from 72% to 84%.' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/* ═══════ STUDENT DASHBOARD ═══════ */
function StudentDashboard({ stats }) {
  const [insightIdx, setInsightIdx] = useState(0);
  const statCards = [
    { label:'Career Readiness', value:`${stats.careerReadiness}`, unit:'%', trend:'+5.2%', icon:TrendingUp, color:'from-red-500 to-rose-600' },
    { label:'ATS Score', value:'92', unit:'%', trend:'+3.1%', icon:Target, color:'from-emerald-500 to-teal-600' },
    { label:'Job Matches', value:'24', unit:'', trend:'+8', icon:Briefcase, color:'from-amber-500 to-orange-600' },
    { label:'Skill Score', value:'78', unit:'%', trend:'+6.4%', icon:Code2, color:'from-violet-500 to-purple-600' },
  ];
  const svgW=600, svgH=220, padX=40, padY=25, maxVal=70;
  const toPoints = (data) => data.map((v,i) => ({ x:padX+i*((svgW-padX*2)/(data.length-1)), y:svgH-padY-((v/maxVal)*(svgH-padY*2)) }));
  const toPolyline = (pts) => pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s,i) => { const Icon=s.icon; return (
          <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}><Icon size={16} className="text-white"/></div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">↗ {s.trend}</span>
            </div>
            <p className="text-2xl font-extrabold font-mono dark:text-white text-gray-900">{s.value}<span className="text-base">{s.unit}</span></p>
            <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">{s.label}</p>
          </motion.div>
        )})}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold dark:text-white text-gray-900 uppercase tracking-wider">Weekly Activity</h3>
            <div className="flex items-center gap-4">
              {WAVE_CONFIGS.map(w => (<span key={w.key} className="flex items-center gap-1.5 text-xs dark:text-gray-400 text-gray-500"><span className="w-2.5 h-2.5 rounded-full" style={{background:w.color}}/>{w.label}</span>))}
            </div>
          </div>
          <p className="text-[10px] dark:text-gray-500 text-gray-400 mb-3">Hours spent each day — Learning (courses), Coding (problems solved), Interview (mock sessions)</p>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
            {[0,25,50,75].map(v => { const y=svgH-padY-((v/maxVal)*(svgH-padY*2)); return <line key={v} x1={padX} y1={y} x2={svgW-20} y2={y} stroke="currentColor" className="dark:text-white/[0.04] text-gray-200" strokeWidth="0.5"/>; })}
            {DAYS.map((d,i) => { const x=padX+i*((svgW-padX*2)/6); return <text key={d} x={x} y={svgH-5} textAnchor="middle" className="dark:fill-gray-500 fill-gray-400" fontSize="11" fontFamily="Inter">{d}</text>; })}
            {WAVE_CONFIGS.map(w => { const pts=toPoints(WAVE_DATA[w.key]); return (<g key={w.key}><polyline points={toPolyline(pts)} fill="none" stroke={w.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{pts.map((p,pi)=>(<circle key={pi} cx={p.x} cy={p.y} r="3" fill={w.color}/>))}</g>); })}
          </svg>
        </div>
        <div className="glass-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold dark:text-white text-gray-900 uppercase tracking-wider flex items-center gap-1.5"><Sparkles size={13} className="text-violet-400"/> Smart Insights</h3>
            <div className="flex items-center gap-1">
              <button onClick={()=>setInsightIdx(p=>Math.max(0,p-1))} className="w-6 h-6 rounded-md dark:bg-white/[0.04] bg-gray-100 flex items-center justify-center dark:text-gray-400 text-gray-500"><ChevronLeft size={12}/></button>
              <button onClick={()=>setInsightIdx(p=>Math.min(AI_INSIGHTS.length-3,p+1))} className="w-6 h-6 rounded-md dark:bg-white/[0.04] bg-gray-100 flex items-center justify-center dark:text-gray-400 text-gray-500"><ChevronRight size={12}/></button>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            {AI_INSIGHTS.slice(insightIdx,insightIdx+4).map((item,i) => (
              <motion.div key={insightIdx+i} initial={{opacity:0,x:5}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}} className="flex items-start gap-3 p-3 rounded-xl dark:bg-white/[0.02] bg-gray-50">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <p className="text-sm dark:text-gray-300 text-gray-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════ MENTOR DASHBOARD ═══════ */
function MentorDashboard() {
  const { jobs } = usePlatform();
  const { user } = useUser();
  const ws = useWebSocket();
  const userEmail = user?.email || '';
  const userName = user?.name || 'Mentor';

  // Get connect requests from WebSocket (persisted server-side)
  const incomingRequests = ws.connectRequests.filter(r => r.mentorEmail === userEmail);
  const pending = incomingRequests.filter(r => r.status === 'PENDING');
  const accepted = incomingRequests.filter(r => r.status === 'ACCEPTED');
  const myJobs = jobs.filter(j => j.postedRole === 'MENTOR');

  const handleRespond = (request, accept) => {
    ws.respondToConnect({
      requestId: request.requestId,
      mentorName: userName,
      mentorEmail: userEmail,
      studentEmail: request.studentEmail,
      status: accept ? 'ACCEPTED' : 'REJECTED',
      message: accept ? 'Happy to connect!' : 'Not available at this time.',
    });
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Pending Requests', value:pending.length, icon:Clock, color:'from-amber-500 to-orange-600' },
          { label:'Active Mentees', value:accepted.length, icon:Users, color:'from-emerald-500 to-teal-600' },
          { label:'Jobs Posted', value:myJobs.length, icon:Briefcase, color:'from-violet-500 to-purple-600' },
          { label:'Total Applications', value:myJobs.reduce((s,j)=>s+j.applied.length,0), icon:TrendingUp, color:'from-blue-500 to-indigo-600' },
        ].map((s,i) => { const Icon=s.icon; return (
          <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg mb-3`}><Icon size={16} className="text-white"/></div>
            <p className="text-2xl font-extrabold font-mono dark:text-white text-gray-900">{s.value}</p>
            <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">{s.label}</p>
          </motion.div>
        )})}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2"><Users size={16} className="text-violet-400"/> Mentorship Requests</h3>
          {pending.length === 0 ? <p className="text-sm dark:text-gray-500 text-gray-400">No pending requests</p> : (
            <div className="space-y-3">
              {pending.map(r => (
                <div key={r.requestId} className="p-3 rounded-xl dark:bg-white/[0.02] bg-gray-50 border dark:border-white/[0.04] border-gray-200/40">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold dark:text-white text-gray-900">{r.studentName}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>
                  </div>
                  <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">{r.message || 'Requesting mentorship'}</p>
                  <div className="flex gap-2">
                    <button onClick={()=>handleRespond(r, true)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">Accept</button>
                    <button onClick={()=>handleRespond(r, false)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {accepted.length > 0 && (
            <div className="mt-4"><p className="text-xs font-bold dark:text-gray-400 text-gray-500 uppercase tracking-wider mb-2">Active Mentees</p>
              {accepted.map(r => (<div key={r.requestId} className="flex items-center gap-2 py-1.5"><CheckCircle2 size={14} className="text-emerald-400"/><span className="text-sm dark:text-gray-300 text-gray-600">{r.studentName}</span></div>))}
            </div>
          )}
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2"><Briefcase size={16} className="text-blue-400"/> Jobs You Posted</h3>
          {myJobs.length === 0 ? <p className="text-sm dark:text-gray-500 text-gray-400">No jobs posted yet. Go to Job Matching to post.</p> : (
            <div className="space-y-3">
              {myJobs.map(j => (
                <div key={j.id} className="p-3 rounded-xl dark:bg-white/[0.02] bg-gray-50 border dark:border-white/[0.04] border-gray-200/40">
                  <p className="text-sm font-bold dark:text-white text-gray-900">{j.title}</p>
                  <p className="text-xs dark:text-gray-500 text-gray-400">{j.company} · {j.applied.length} applications</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════ TEACHER DASHBOARD ═══════ */
function TeacherDashboard() {
  const { students, jobs } = usePlatform();
  const ws = useWebSocket();
  const placementReady = students.filter(s => s.placementReady).length;
  const avgReadiness = Math.round(students.reduce((s,st) => s+st.careerReadiness, 0) / students.length);
  const totalApps = jobs.reduce((s,j) => s+j.applied.length, 0);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Total Students', value:students.length, icon:GraduationCap, color:'from-violet-500 to-purple-600' },
          { label:'Placement Ready', value:placementReady, icon:CheckCircle2, color:'from-emerald-500 to-teal-600' },
          { label:'Avg Readiness', value:`${avgReadiness}%`, icon:BarChart3, color:'from-blue-500 to-indigo-600' },
          { label:'Total Job Apps', value:totalApps, icon:Briefcase, color:'from-amber-500 to-orange-600' },
        ].map((s,i) => { const Icon=s.icon; return (
          <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg mb-3`}><Icon size={16} className="text-white"/></div>
            <p className="text-2xl font-extrabold font-mono dark:text-white text-gray-900">{s.value}</p>
            <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">{s.label}</p>
          </motion.div>
        )})}
      </div>
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2"><GraduationCap size={16} className="text-violet-400"/> Student Progress Tracker</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-white/[0.06] border-gray-200/60">
                {['Student','Skills','Streak','XP','Readiness','ATS','Problems','GitHub','Placement'].map(h => (
                  <th key={h} className={`${h==='Student'?'text-left':'text-center'} py-2 text-xs font-bold dark:text-gray-400 text-gray-500 uppercase`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b dark:border-white/[0.03] border-gray-100 hover:dark:bg-white/[0.02] hover:bg-gray-50">
                  <td className="py-3 font-bold dark:text-white text-gray-900">{s.name}</td>
                  <td className="py-3 text-center"><div className="flex flex-wrap justify-center gap-1">{s.skills.slice(0,3).map(sk => <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded dark:bg-violet-500/10 bg-violet-50 dark:text-violet-400 text-violet-600">{sk}</span>)}{s.skills.length > 3 && <span className="text-[10px] dark:text-gray-500 text-gray-400">+{s.skills.length-3}</span>}</div></td>
                  <td className="py-3 text-center"><span className="text-xs font-bold dark:text-orange-400 text-orange-600">🔥 {s.streak}d</span></td>
                  <td className="py-3 text-center font-mono text-xs dark:text-amber-400 text-amber-600">{s.xp.toLocaleString()}</td>
                  <td className="py-3 text-center"><div className="flex items-center justify-center gap-1.5"><div className="w-16 h-1.5 rounded-full dark:bg-white/[0.06] bg-gray-200 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{width:`${s.careerReadiness}%`}}/></div><span className="text-xs font-bold dark:text-gray-300 text-gray-600">{s.careerReadiness}%</span></div></td>
                  <td className="py-3 text-center text-xs font-bold dark:text-emerald-400 text-emerald-600">{s.atsScore}%</td>
                  <td className="py-3 text-center text-xs font-mono dark:text-gray-300 text-gray-600">{s.codingSolved}</td>
                  <td className="py-3 text-center text-xs font-mono dark:text-gray-300 text-gray-600">{s.github}</td>
                  <td className="py-3 text-center">{s.placementReady ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ready</span> : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">In Progress</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3 flex items-center gap-2"><Award size={16} className="text-amber-400"/> Placement Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm dark:text-gray-400 text-gray-500">Placement Ready</span><span className="text-sm font-bold dark:text-emerald-400 text-emerald-600">{placementReady}/{students.length}</span></div>
            <div className="flex justify-between"><span className="text-sm dark:text-gray-400 text-gray-500">Avg Career Readiness</span><span className="text-sm font-bold dark:text-violet-400 text-violet-600">{avgReadiness}%</span></div>
            <div className="flex justify-between"><span className="text-sm dark:text-gray-400 text-gray-500">Avg ATS Score</span><span className="text-sm font-bold dark:text-blue-400 text-blue-600">{Math.round(students.reduce((s,st) => s+st.atsScore, 0) / students.length)}%</span></div>
            <div className="flex justify-between"><span className="text-sm dark:text-gray-400 text-gray-500">Mentorship Requests</span><span className="text-sm font-bold dark:text-cyan-400 text-cyan-600">{ws.connectRequests.length}</span></div>
          </div>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3 flex items-center gap-2"><Briefcase size={16} className="text-blue-400"/> Job Postings</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm dark:text-gray-400 text-gray-500">Active Jobs</span><span className="text-sm font-bold dark:text-white text-gray-900">{jobs.length}</span></div>
            <div className="flex justify-between"><span className="text-sm dark:text-gray-400 text-gray-500">Total Applications</span><span className="text-sm font-bold dark:text-amber-400 text-amber-600">{totalApps}</span></div>
            <div className="flex justify-between"><span className="text-sm dark:text-gray-400 text-gray-500">By Teachers</span><span className="text-sm font-bold dark:text-blue-400 text-blue-600">{jobs.filter(j => j.postedRole === 'TEACHER').length}</span></div>
            <div className="flex justify-between"><span className="text-sm dark:text-gray-400 text-gray-500">By Mentors</span><span className="text-sm font-bold dark:text-indigo-400 text-indigo-600">{jobs.filter(j => j.postedRole === 'MENTOR').length}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════ MAIN DASHBOARD ═══════ */
export default function Dashboard() {
  const { stats } = useGamification();
  const { user } = useUser();
  const role = user?.role || 'STUDENT';
  const firstName = (user?.name || 'Sanjay').split(' ')[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">
            {getGreeting()}, <span className="text-gradient">{firstName}</span> 👋
          </h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">
            {role === 'STUDENT' ? 'Your career progress overview for today.' : role === 'MENTOR' ? 'Your mentorship overview.' : 'Student & placement analytics.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl dark:bg-white/[0.04] bg-gray-100 text-xs font-bold flex items-center gap-1.5 dark:text-orange-400 text-orange-600">
            <Flame size={12}/> {stats.streak} day streak
          </span>
          <span className="px-3 py-1.5 rounded-xl dark:bg-white/[0.04] bg-gray-100 text-xs font-bold flex items-center gap-1.5 dark:text-violet-400 text-violet-600">
            <Zap size={12}/> {stats.xp.toLocaleString()} XP
          </span>
        </div>
      </div>
      {role === 'STUDENT' && <StudentDashboard stats={stats} />}
      {role === 'MENTOR' && <MentorDashboard />}
      {role === 'TEACHER' && <TeacherDashboard />}
    </motion.div>
  );
}
