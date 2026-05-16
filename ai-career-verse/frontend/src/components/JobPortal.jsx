import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, IndianRupee, Clock, ExternalLink, Heart, Filter, Sparkles, CheckCircle2, Briefcase, Plus, X, Wifi, Radio } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useUser } from '../context/UserContext';
import { usePlatform } from '../context/PlatformContext';
import { useWebSocket } from '../context/WebSocketContext';

const USER_SKILLS = ['Python', 'Django', 'React', 'Node.js', 'PostgreSQL', 'Flask', 'JavaScript', 'Docker', 'Git', 'Tailwind CSS', 'Java', 'Spring Boot'];
const FILTERS = ['All', 'Full-time', 'Frontend', 'Backend', 'DevOps', 'Remote'];

const DEFAULT_JOBS = [
  { id:1, title:'Senior Frontend Engineer', company:'Nexora AI', location:'Bangalore, IN', type:'Full-time', salary:'₹25L - ₹40L', exp:'5+ years', applicants:127, skills:['React','TypeScript','GraphQL','TailwindCSS'], desc:'Lead the frontend architecture for our AI-powered analytics platform.', postedBy:'Platform', postedRole:'SYSTEM', applied:[] },
  { id:2, title:'Full-Stack Developer', company:'PixStack', location:'Mumbai, IN', type:'Remote', salary:'₹18L - ₹30L', exp:'3+ years', applicants:89, skills:['React','Node.js','PostgreSQL','Docker'], desc:'Build end-to-end features for a high-traffic SaaS platform.', postedBy:'Platform', postedRole:'SYSTEM', applied:[] },
  { id:3, title:'Backend Engineer - AI Platform', company:'QuantumByte', location:'Hyderabad, IN', type:'Full-time', salary:'₹22L - ₹35L', exp:'4+ years', applicants:106, skills:['Python','Django','PostgreSQL','Redis','Docker'], desc:'Design and scale backend microservices powering AI/ML pipelines.', postedBy:'Platform', postedRole:'SYSTEM', applied:[] },
  { id:4, title:'DevOps Lead', company:'CloudEdge Systems', location:'Pune, IN', type:'Remote', salary:'₹28L - ₹45L', exp:'5+ years', applicants:64, skills:['Docker','Kubernetes','AWS','Terraform','Python'], desc:'Lead cloud infrastructure strategy.', postedBy:'Platform', postedRole:'SYSTEM', applied:[] },
  { id:5, title:'Python Full Stack Developer', company:'DataForge', location:'Bangalore, IN', type:'Remote', salary:'₹18L - ₹30L', exp:'2+ years', applicants:203, skills:['Python','Django','React','PostgreSQL','Git'], desc:'Build data-intensive web applications.', postedBy:'Platform', postedRole:'SYSTEM', applied:[] },
];

function calcMatch(jobSkills) {
  const matched = jobSkills.filter(s => USER_SKILLS.some(us => us.toLowerCase() === s.toLowerCase()));
  return Math.round((matched.length / jobSkills.length) * 100);
}

export default function JobPortal() {
  const { stats } = useGamification();
  const { user } = useUser();
  const { jobs: platformJobs, addJob, applyJob } = usePlatform();
  const ws = useWebSocket();
  const userRole = user?.role || 'STUDENT';
  const userName = user?.name || 'Sanjay Chavan';

  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(new Set());
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState(new Set());
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJob, setNewJob] = useState({ title:'', company:'', location:'', type:'Full-time', salary:'', exp:'', skills:'', desc:'' });

  const canAddJobs = userRole === 'MENTOR' || userRole === 'TEACHER';

  // Merge platform jobs + live WebSocket jobs + default jobs
  // Deduplicate: skip WS jobs that already exist in platformJobs (same title + company)
  const platformTitles = new Set(platformJobs.map((j) => `${j.title}|${j.company}`));
  const defaultTitles = new Set(DEFAULT_JOBS.map((j) => `${j.title}|${j.company}`));
  const wsJobs = ws.jobFeed
    .filter((j) => {
      const key = `${j.title}|${j.company}`;
      return !platformTitles.has(key) && !defaultTitles.has(key);
    })
    .map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location || 'Remote',
      type: j.type || 'Full-time',
      salary: j.salary || 'Competitive',
      exp: j.experience || '—',
      applicants: 0,
      skills: j.skills || [],
      desc: j.description || '',
      postedBy: j.postedBy,
      postedRole: j.postedByRole,
      applied: [],
      isLive: true,
    }));
  const allJobs = [...wsJobs, ...platformJobs, ...DEFAULT_JOBS];

  const filtered = allJobs.filter(j => {
    if (filter !== 'All' && j.type !== filter && !j.title.toLowerCase().includes(filter.toLowerCase())) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const matches = allJobs.filter(j => calcMatch(j.skills) >= 70).length;

  const handleApply = (jobId) => {
    setApplied(prev => new Set([...prev, jobId]));
    applyJob(jobId, userName);
  };

  const handleAddJob = () => {
    if (!newJob.title || !newJob.company) return;
    const skillsList = newJob.skills.split(',').map(s => s.trim()).filter(Boolean);

    // Add to local state
    addJob({
      ...newJob,
      skills: skillsList,
      applicants: 0,
      postedBy: userName,
      postedRole: userRole,
    });

    // Broadcast via WebSocket to /topic/job-feed
    if (ws.connected) {
      ws.postJobToFeed({
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        type: newJob.type,
        salary: newJob.salary,
        experience: newJob.exp,
        description: newJob.desc,
        skills: skillsList,
        postedBy: userName,
        postedByRole: userRole,
        postedByEmail: user?.email || '',
      });
    }

    setShowAddJob(false);
    setNewJob({ title:'', company:'', location:'', type:'Full-time', salary:'', exp:'', skills:'', desc:'' });
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Job Matching</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Jobs aligned perfectly with your career DNA</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold">{matches} Matches</span>
          {ws.connected && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
              <Wifi size={10} />
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}
          {canAddJobs && (
            <button onClick={() => setShowAddJob(true)}
              className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={14} /> Post Job
            </button>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs, companies, skills..."
            className="input-field pl-10" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter===f ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'dark:bg-white/[0.03] bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:bg-white/[0.06] hover:bg-gray-200'}`}>{f}</button>
          ))}
          <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold dark:bg-white/[0.03] bg-gray-100 dark:text-gray-400 text-gray-500">
            <Filter size={12} /> Filters
          </button>
        </div>
      </div>

      {/* Job List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map(job => {
            const match = calcMatch(job.skills);
            const isSelected = selected?.id === job.id;
            const isApplied = applied.has(job.id);
            return (
              <motion.div key={job.id} whileHover={{x:2}} onClick={()=>setSelected(job)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected ? 'dark:bg-violet-500/10 bg-violet-50 dark:border-violet-500/20 border-violet-200'
                  : 'dark:bg-white/[0.03] bg-white dark:border-white/[0.06] border-gray-200/60 dark:hover:border-white/[0.08] hover:border-gray-300'
                }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold dark:text-white text-gray-900 truncate flex items-center gap-1.5">
                      {job.title}
                      {job.isLive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />}
                    </h4>
                    <p className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">
                      {job.company}
                      {job.isLive && <span className="text-[9px] text-green-400 font-bold ml-1">LIVE</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isApplied && <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">Applied ✓</span>}
                    <button onClick={e=>{e.stopPropagation();setSaved(p=>{const n=new Set(p);n.has(job.id)?n.delete(job.id):n.add(job.id);return n;})}}
                      className={`p-1 ${saved.has(job.id)?'text-red-400':'dark:text-gray-600 text-gray-400'}`}><Heart size={14} fill={saved.has(job.id)?'currentColor':'none'}/></button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[11px] dark:text-gray-500 text-gray-400">
                  <span className="flex items-center gap-1"><MapPin size={10}/>{job.location}</span>
                  <span className="flex items-center gap-1"><IndianRupee size={10}/>{job.salary}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {job.skills.slice(0,3).map(s=>{
                    const has = USER_SKILLS.some(us=>us.toLowerCase()===s.toLowerCase());
                    return <span key={s} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${has?'bg-violet-500/10 text-violet-400 border border-violet-500/20':'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-500 text-gray-400'}`}>{s}</span>;
                  })}
                  {match >= 70 && <span className="ml-auto text-[10px] font-bold text-violet-400">🔥 {match}%</span>}
                </div>
                <p className="text-[10px] dark:text-gray-600 text-gray-400 mt-2 font-mono">{job.applicants} applicants</p>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}}
                className="rounded-2xl p-6 dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60 sticky top-6 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white text-gray-900">{selected.title}</h3>
                    <p className="text-sm dark:text-gray-400 text-gray-500">{selected.company} • {selected.type}</p>
                  </div>
                  {applied.has(selected.id) ? (
                    <span className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-sm font-bold border border-green-500/20 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Applied
                    </span>
                  ) : (
                    <button onClick={() => handleApply(selected.id)} className="btn-primary text-sm flex items-center gap-1.5">
                      Apply Now <ExternalLink size={12}/>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[{l:'Match Score',v:`${calcMatch(selected.skills)}%`,c:'text-violet-400'},{l:'Salary Range',v:selected.salary,c:'dark:text-white text-gray-900'},{l:'Experience',v:selected.exp,c:'dark:text-white text-gray-900'}].map((s,i)=>(
                    <div key={i} className="text-center p-3 rounded-xl dark:bg-white/[0.03] bg-gray-50 border dark:border-white/[0.04] border-gray-200/40">
                      <p className={`text-lg font-extrabold font-mono ${s.c}`}>{s.v}</p>
                      <p className="text-[9px] dark:text-gray-600 text-gray-400 uppercase tracking-wider mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>

                <div><h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-1.5">Description</h4>
                  <p className="text-sm dark:text-gray-300 text-gray-600 leading-relaxed">{selected.desc}</p></div>

                <div><h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-2">Required Skills</h4>
                  <div className="flex gap-2 flex-wrap">{selected.skills.map(s=>{
                    const has = USER_SKILLS.some(us=>us.toLowerCase()===s.toLowerCase());
                    return <span key={s} className={`px-2.5 py-1 rounded-lg text-sm font-semibold ${has?'bg-violet-500/10 text-violet-400 border border-violet-500/20':'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-400 text-gray-500 border dark:border-white/[0.04] border-gray-200'}`}>{has && <CheckCircle2 size={10} className="inline mr-1"/>}{s}</span>;
                  })}</div></div>

                <div><h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Sparkles size={12} className="text-violet-400"/>AI Skill Gap Analysis</h4>
                  <div className="space-y-2.5">
                    {selected.skills.map(s=>{
                      const has = USER_SKILLS.some(us=>us.toLowerCase()===s.toLowerCase());
                      const pct = has ? (70 + Math.floor(Math.random()*25)) : (30 + Math.floor(Math.random()*40));
                      return (
                        <div key={s}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm dark:text-gray-300 text-gray-600 font-medium">{s}</span>
                            <span className={`text-[11px] font-bold font-mono ${pct>=70?'text-green-400':pct>=50?'text-amber-400':'text-red-400'}`}>{pct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full dark:bg-white/[0.04] bg-gray-100 overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,delay:0.2}}
                              className={`h-full rounded-full ${pct>=70?'bg-green-500':pct>=50?'bg-amber-500':'bg-red-500'}`}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl p-12 dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60 text-center">
                <Briefcase size={32} className="text-violet-400 mx-auto mb-3 opacity-40" />
                <p className="text-sm dark:text-gray-500 text-gray-400">Select a job to see details & skill gap analysis</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Job Modal (Mentor/Teacher) */}
      <AnimatePresence>
        {showAddJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddJob(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg mx-4 rounded-2xl p-6 dark:bg-[#0D1117] bg-white border dark:border-white/[0.06] border-gray-200 shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold dark:text-white text-gray-900">Post a New Job</h3>
                <button onClick={() => setShowAddJob(false)} className="w-8 h-8 rounded-lg dark:bg-white/[0.04] bg-gray-100 flex items-center justify-center"><X size={16} className="dark:text-gray-400 text-gray-500" /></button>
              </div>
              <div className="space-y-3">
                <input value={newJob.title} onChange={e => setNewJob(p => ({...p, title: e.target.value}))}
                  placeholder="Job Title *" className="input-field" />
                <input value={newJob.company} onChange={e => setNewJob(p => ({...p, company: e.target.value}))}
                  placeholder="Company Name *" className="input-field" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={newJob.location} onChange={e => setNewJob(p => ({...p, location: e.target.value}))}
                    placeholder="Location (e.g., Bangalore, IN)" className="input-field" />
                  <select value={newJob.type} onChange={e => setNewJob(p => ({...p, type: e.target.value}))} className="input-field">
                    <option>Full-time</option>
                    <option>Remote</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={newJob.salary} onChange={e => setNewJob(p => ({...p, salary: e.target.value}))}
                    placeholder="Salary (e.g., ₹15L - ₹25L)" className="input-field" />
                  <input value={newJob.exp} onChange={e => setNewJob(p => ({...p, exp: e.target.value}))}
                    placeholder="Experience (e.g., 3+ years)" className="input-field" />
                </div>
                <input value={newJob.skills} onChange={e => setNewJob(p => ({...p, skills: e.target.value}))}
                  placeholder="Required Skills (comma-separated)" className="input-field" />
                <textarea value={newJob.desc} onChange={e => setNewJob(p => ({...p, desc: e.target.value}))}
                  placeholder="Job Description" className="input-field resize-none" rows={3} />
                <button onClick={handleAddJob} disabled={!newJob.title || !newJob.company}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  <Plus size={14} /> Post Job
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
