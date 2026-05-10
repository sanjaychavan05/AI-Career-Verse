import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Rocket, AlertTriangle, Sparkles, ChevronDown, ChevronRight, BookOpen, ExternalLink, Target } from 'lucide-react';
import axios from 'axios';

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500', border: 'border-green-500/30', line: 'bg-green-500' },
  'in-progress': { icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/30', line: 'bg-cyan-500' },
  upcoming: { icon: Circle, color: 'dark:text-gray-600 text-gray-400', bg: 'dark:bg-gray-700 bg-gray-300', border: 'dark:border-gray-700 border-gray-300', line: 'dark:bg-gray-800 bg-gray-200' },
};

/* Detailed sub-steps for each milestone */
const milestoneDetails = {
  'Python & Web Fundamentals': {
    resources: ['Python Crash Course (Book)', 'MDN Web Docs', 'FreeCodeCamp HTML/CSS', 'Git & GitHub Bootcamp'],
    substeps: ['Master Python data types, loops, functions', 'Learn HTML5 semantic elements & CSS3 Flexbox/Grid', 'JavaScript ES6+ fundamentals', 'Version control with Git'],
    projects: ['Personal portfolio website', 'CLI todo application', 'Calculator web app'],
    duration: '~120 hours of focused learning',
  },
  'Django & Flask Mastery': {
    resources: ['Django for Beginners (Book)', 'Flask Mega-Tutorial', 'Django REST Framework docs'],
    substeps: ['Django models, views, templates', 'Flask routing & Jinja2', 'REST API design with DRF', 'PostgreSQL queries & ORM'],
    projects: ['Blog platform with CRUD', 'REST API for task manager', 'E-commerce backend'],
    duration: '~150 hours of focused learning',
  },
  'React & Modern Frontend': {
    resources: ['React.dev official docs', 'Tailwind CSS documentation', 'Redux Toolkit guide'],
    substeps: ['React components, hooks, state', 'Tailwind CSS utility-first styling', 'Redux state management', 'TypeScript integration'],
    projects: ['Dashboard UI', 'Real-time chat frontend', 'E-commerce storefront'],
    duration: '~140 hours of focused learning',
  },
  'End-to-End Applications': {
    resources: ['Docker Getting Started', 'AWS Free Tier tutorials', 'GitHub Actions CI/CD'],
    substeps: ['Connect frontend to backend APIs', 'Docker containerization', 'CI/CD pipeline setup', 'AWS EC2/S3 deployment'],
    projects: ['Full-stack social platform', 'Deployed portfolio with CI/CD', 'Microservice architecture demo'],
    duration: '~160 hours of focused learning',
  },
  'System Design & Architecture': {
    resources: ['System Design Primer (GitHub)', 'Designing Data-Intensive Applications', 'Redis documentation'],
    substeps: ['Microservices architecture patterns', 'Distributed systems fundamentals', 'Message queues (Redis, Kafka)', 'Caching strategies'],
    projects: ['URL shortener at scale', 'Event-driven notification system', 'Distributed task queue'],
    duration: '~180 hours of focused learning',
  },
  'Senior Developer & Beyond': {
    resources: ['Staff Engineer (Book)', 'The Manager\'s Path', 'Open Source contribution guides'],
    substeps: ['Technical leadership skills', 'Code review and mentoring', 'Architecture decision records', 'Open source contributions'],
    projects: ['Lead a team project', 'Create an open-source library', 'Write technical blog posts'],
    duration: '~200+ hours continuous practice',
  },
};

/* Fallback roadmaps for all tracks (static) */
const fallbackRoadmaps = {
  python: {
    title: 'Python Full Stack → Senior Developer', totalPhases: 6, currentPhase: 4, overallProgress: 58,
    completedSkillNodes: 14, totalSkillNodes: 24, nextPhaseSkills: ['AWS', 'System Design', 'Redis', 'Kafka'],
    milestones: [
      { id: 1, phase: 'Foundation', title: 'Python & Web Fundamentals', period: 'Month 1-3', status: 'completed', skills: ['Python', 'HTML/CSS', 'JavaScript', 'Git'], missingSkills: [], coverage: 100, description: 'Master core programming and web fundamentals' },
      { id: 2, phase: 'Backend', title: 'Django & Flask Mastery', period: 'Month 4-6', status: 'completed', skills: ['Django', 'Flask', 'REST APIs', 'PostgreSQL'], missingSkills: ['REST APIs'], coverage: 75, description: 'Build production-grade backend services' },
      { id: 3, phase: 'Frontend', title: 'React & Modern Frontend', period: 'Month 7-9', status: 'completed', skills: ['React.js', 'Tailwind CSS', 'Redux', 'TypeScript'], missingSkills: ['Redux', 'TypeScript'], coverage: 50, description: 'Create responsive dynamic user interfaces' },
      { id: 4, phase: 'Full Stack', title: 'End-to-End Applications', period: 'Month 10-12', status: 'in-progress', skills: ['Full Stack Projects', 'Docker', 'CI/CD', 'AWS'], missingSkills: ['CI/CD', 'AWS'], coverage: 50, description: 'Deploy complete applications to production' },
      { id: 5, phase: 'Advanced', title: 'System Design & Architecture', period: 'Month 13-18', status: 'upcoming', skills: ['Microservices', 'System Design', 'Redis', 'Kafka'], missingSkills: ['Microservices', 'System Design', 'Redis', 'Kafka'], coverage: 0, description: 'Design scalable distributed systems' },
      { id: 6, phase: 'Senior', title: 'Senior Developer & Beyond', period: 'Month 19-24', status: 'upcoming', skills: ['Tech Leadership', 'Mentoring', 'Architecture', 'Open Source'], missingSkills: ['Tech Leadership', 'Mentoring', 'Architecture', 'Open Source'], coverage: 0, description: 'Lead teams and drive technical decisions' },
    ],
  },
  react: {
    title: 'React Developer → Senior Frontend Engineer', totalPhases: 5, currentPhase: 3, overallProgress: 50,
    completedSkillNodes: 10, totalSkillNodes: 20, nextPhaseSkills: ['Next.js', 'SSR/SSG', 'Auth'],
    milestones: [
      { id: 1, phase: 'Basics', title: 'HTML, CSS & JavaScript', period: 'Month 1-2', status: 'completed', skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git'], missingSkills: [], coverage: 100, description: 'Solid web fundamentals and modern JS' },
      { id: 2, phase: 'React Core', title: 'React.js Fundamentals', period: 'Month 3-5', status: 'completed', skills: ['React', 'JSX', 'Hooks', 'Router', 'Context API'], missingSkills: [], coverage: 100, description: 'Build component-driven UIs' },
      { id: 3, phase: 'Advanced', title: 'State & Performance', period: 'Month 6-8', status: 'in-progress', skills: ['Redux', 'React Query', 'Code Splitting', 'Testing'], missingSkills: ['React Query', 'Code Splitting'], coverage: 50, description: 'Master state management and optimization' },
      { id: 4, phase: 'Fullstack', title: 'Next.js & API Integration', period: 'Month 9-12', status: 'upcoming', skills: ['Next.js', 'SSR/SSG', 'REST/GraphQL', 'Auth'], missingSkills: ['Next.js', 'SSR/SSG', 'REST/GraphQL', 'Auth'], coverage: 0, description: 'Full-stack React applications' },
      { id: 5, phase: 'Senior', title: 'Architecture & Leadership', period: 'Month 13-18', status: 'upcoming', skills: ['Design Systems', 'Micro Frontends', 'CI/CD', 'Team Lead'], missingSkills: ['Design Systems', 'Micro Frontends', 'CI/CD', 'Team Lead'], coverage: 0, description: 'Lead frontend architecture decisions' },
    ],
  },
  java: {
    title: 'Java Developer → Enterprise Architect', totalPhases: 5, currentPhase: 2, overallProgress: 30,
    completedSkillNodes: 6, totalSkillNodes: 20, nextPhaseSkills: ['Spring Security', 'JPA', 'Kafka'],
    milestones: [
      { id: 1, phase: 'Core', title: 'Java Fundamentals', period: 'Month 1-3', status: 'completed', skills: ['Java 17', 'OOP', 'Collections', 'Streams', 'JUnit'], missingSkills: [], coverage: 100, description: 'Master core Java and testing' },
      { id: 2, phase: 'Spring', title: 'Spring Boot Ecosystem', period: 'Month 4-7', status: 'in-progress', skills: ['Spring Boot', 'Spring Data', 'Spring Security', 'JPA'], missingSkills: ['Spring Security', 'JPA'], coverage: 50, description: 'Build enterprise APIs with Spring' },
      { id: 3, phase: 'Data', title: 'Database & Messaging', period: 'Month 8-10', status: 'upcoming', skills: ['PostgreSQL', 'Redis', 'Kafka', 'RabbitMQ'], missingSkills: ['Redis', 'Kafka', 'RabbitMQ'], coverage: 25, description: 'Master data layer and event-driven design' },
      { id: 4, phase: 'Cloud', title: 'Cloud Native & DevOps', period: 'Month 11-14', status: 'upcoming', skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'], missingSkills: ['Kubernetes', 'AWS', 'Terraform'], coverage: 25, description: 'Deploy scalable cloud applications' },
      { id: 5, phase: 'Architect', title: 'Enterprise Architecture', period: 'Month 15-20', status: 'upcoming', skills: ['Microservices', 'DDD', 'CQRS', 'System Design'], missingSkills: ['Microservices', 'DDD', 'CQRS', 'System Design'], coverage: 0, description: 'Design enterprise-grade distributed systems' },
    ],
  },
  devops: {
    title: 'DevOps Engineer → Platform Architect', totalPhases: 5, currentPhase: 2, overallProgress: 30,
    completedSkillNodes: 6, totalSkillNodes: 20, nextPhaseSkills: ['Kubernetes', 'Jenkins', 'Terraform'],
    milestones: [
      { id: 1, phase: 'Linux', title: 'Linux & Networking', period: 'Month 1-2', status: 'completed', skills: ['Linux', 'Bash', 'Networking', 'DNS', 'SSH'], missingSkills: [], coverage: 100, description: 'Master Linux system administration' },
      { id: 2, phase: 'Containers', title: 'Docker & Containers', period: 'Month 3-5', status: 'in-progress', skills: ['Docker', 'Docker Compose', 'Container Security', 'Registries'], missingSkills: ['Container Security', 'Registries'], coverage: 50, description: 'Containerize and manage applications' },
      { id: 3, phase: 'Orchestration', title: 'Kubernetes & CI/CD', period: 'Month 6-9', status: 'upcoming', skills: ['Kubernetes', 'Helm', 'GitHub Actions', 'Jenkins'], missingSkills: ['Kubernetes', 'Helm', 'GitHub Actions', 'Jenkins'], coverage: 0, description: 'Orchestrate deployments at scale' },
      { id: 4, phase: 'Cloud', title: 'Cloud Platforms', period: 'Month 10-14', status: 'upcoming', skills: ['AWS', 'GCP', 'Terraform', 'Ansible'], missingSkills: ['AWS', 'GCP', 'Terraform', 'Ansible'], coverage: 0, description: 'Multi-cloud infrastructure management' },
      { id: 5, phase: 'Platform', title: 'Platform Engineering', period: 'Month 15-20', status: 'upcoming', skills: ['SRE', 'Observability', 'IDP', 'Cost Optimization'], missingSkills: ['SRE', 'Observability', 'IDP', 'Cost Optimization'], coverage: 0, description: 'Build internal developer platforms' },
    ],
  },
};

export default function CareerRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [track, setTrack] = useState('python');
  const [loading, setLoading] = useState(true);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  const TRACKS = [
    { id: 'python', label: '🐍 Python Full Stack', icon: '🐍' },
    { id: 'react', label: '⚛️ React Developer', icon: '⚛️' },
    { id: 'java', label: '☕ Java Enterprise', icon: '☕' },
    { id: 'devops', label: '☁️ DevOps Engineer', icon: '☁️' },
  ];

  useEffect(() => {
    setLoading(true);
    setExpandedMilestone(null);
    if (track === 'python') {
      // Only Python has backend data
      axios.get('/api/roadmap')
        .then(({ data }) => { setRoadmap(data); setLoading(false); })
        .catch(() => { setRoadmap(fallbackRoadmaps.python); setLoading(false); });
    } else {
      // Other tracks use local fallback data
      setRoadmap(fallbackRoadmaps[track]);
      setLoading(false);
    }
  }, [track]);

  if (!roadmap || loading) return <div className="text-center py-20 dark:text-gray-500 text-gray-400">Loading roadmap...</div>;

  const progress = roadmap.overallProgress != null
    ? roadmap.overallProgress
    : ((roadmap.currentPhase - 1) / roadmap.totalPhases) * 100 + (100 / roadmap.totalPhases / 2);

  const nextPhaseSkills = roadmap.nextPhaseSkills || [];
  const completedNodes = roadmap.completedSkillNodes || 0;
  const totalNodes = roadmap.totalSkillNodes || 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Career Roadmap</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">{roadmap.title}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60">
          <Rocket size={14} className="text-violet-400" />
          <span className="text-sm font-bold dark:text-gray-300 text-gray-700">Phase {roadmap.currentPhase}/{roadmap.totalPhases}</span>
        </div>
      </div>

      {/* Track Selector */}
      <div className="flex gap-2 flex-wrap">
        {TRACKS.map(t => (
          <button key={t.id} onClick={() => setTrack(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              track === t.id
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                : 'dark:bg-white/[0.03] bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:bg-white/[0.06] hover:bg-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl p-5 dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider">Overall Progress</span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] dark:text-gray-500 text-gray-400">{completedNodes}/{totalNodes} skills</span>
            <span className="text-sm font-bold font-mono dark:text-violet-400 text-violet-600">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full dark:bg-white/[0.04] bg-gray-100 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400"
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
        </div>
      </div>

      {/* Next Phase Recommendations */}
      {nextPhaseSkills.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 dark:bg-gradient-to-r dark:from-violet-500/5 dark:to-indigo-500/5 bg-gradient-to-r from-violet-50 to-indigo-50 border dark:border-violet-500/10 border-violet-200/40">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-violet-400" />
            <h3 className="text-xs font-bold dark:text-violet-400 text-violet-600 uppercase tracking-wider">Next Phase — Recommended Skills</h3>
          </div>
          <p className="text-sm dark:text-gray-400 text-gray-500 mb-3">Based on gap analysis against Senior Developer benchmark:</p>
          <div className="flex flex-wrap gap-2">
            {nextPhaseSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl text-sm font-bold dark:bg-white/[0.04] bg-white dark:text-violet-300 text-violet-700 border dark:border-violet-500/20 border-violet-200/40 flex items-center gap-1.5">
                <AlertTriangle size={10} className="text-amber-400" />
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Vertical Timeline — Clickable */}
      <div className="relative pl-8">
        <div className="absolute left-[15px] top-0 bottom-0 w-[2px] dark:bg-white/[0.04] bg-gray-200 rounded-full" />

        <div className="space-y-2">
          {(roadmap.milestones || []).map((m, i) => {
            const config = statusConfig[m.status] || statusConfig.upcoming;
            const Icon = config.icon;
            const missingSkills = m.missingSkills || [];
            const coverage = m.coverage != null ? m.coverage : null;
            const isExpanded = expandedMilestone === m.id;
            const details = milestoneDetails[m.title] || null;

            return (
              <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }} className="relative">
                {/* Node */}
                <div className={`absolute -left-8 top-5 w-[30px] h-[30px] rounded-full ${config.bg} flex items-center justify-center z-10 border-4 dark:border-[#0D1117] border-gray-50`}>
                  <Icon size={13} className="text-white" />
                </div>

                {/* Card — Clickable */}
                <div
                  onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                  className={`ml-4 rounded-2xl p-5 transition-all duration-300 border cursor-pointer
                  ${m.status === 'in-progress'
                    ? 'dark:bg-cyan-500/5 bg-cyan-50 dark:border-cyan-500/15 border-cyan-200/50 shadow-lg dark:shadow-cyan-500/5'
                    : 'dark:bg-white/[0.03] bg-white dark:border-white/[0.06] border-gray-200/60'}
                  hover:dark:border-white/[0.1] hover:border-gray-300 group`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>{m.phase}</span>
                      <span className="text-[11px] font-mono dark:text-gray-500 text-gray-400">{m.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {coverage != null && (
                        <span className="text-[11px] font-bold font-mono dark:text-gray-500 text-gray-400">{coverage}% covered</span>
                      )}
                      {m.status === 'in-progress' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse">
                          IN PROGRESS
                        </span>
                      )}
                      {m.status === 'completed' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          COMPLETED
                        </span>
                      )}
                      {isExpanded ? <ChevronDown size={14} className="dark:text-gray-500 text-gray-400" /> : <ChevronRight size={14} className="dark:text-gray-500 text-gray-400" />}
                    </div>
                  </div>
                  <h3 className="text-base font-bold dark:text-white text-gray-900">{m.title}</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">{m.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(m.skills || []).map((s, j) => {
                      const isMissing = missingSkills.includes(s);
                      return (
                        <span key={j} className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                          isMissing
                            ? 'dark:bg-amber-500/10 bg-amber-50 dark:text-amber-400 text-amber-600 border dark:border-amber-500/20 border-amber-200/40'
                            : 'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-400 text-gray-500'
                        }`}>
                          {isMissing && '⚡ '}{s}
                        </span>
                      );
                    })}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && details && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="mt-5 pt-5 border-t dark:border-white/[0.06] border-gray-200/60 space-y-4">
                          {/* Duration */}
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-cyan-400" />
                            <span className="text-sm dark:text-gray-300 text-gray-600">{details.duration}</span>
                          </div>

                          {/* Sub-steps */}
                          <div>
                            <h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Target size={12} /> Learning Path
                            </h4>
                            <div className="space-y-1.5">
                              {details.substeps.map((step, si) => (
                                <div key={si} className="flex items-start gap-2">
                                  <span className="w-5 h-5 rounded-md bg-violet-500/10 text-violet-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{si + 1}</span>
                                  <span className="text-sm dark:text-gray-300 text-gray-600">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          <div>
                            <h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Rocket size={12} /> Practice Projects
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {details.projects.map((p, pi) => (
                                <span key={pi} className="px-3 py-1.5 rounded-lg text-sm dark:bg-white/[0.03] bg-gray-50 dark:text-gray-300 text-gray-600 border dark:border-white/[0.04] border-gray-200/40">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <BookOpen size={12} /> Resources
                            </h4>
                            <div className="space-y-1">
                              {details.resources.map((r, ri) => (
                                <div key={ri} className="flex items-center gap-2 text-sm dark:text-cyan-400 text-cyan-600">
                                  <ExternalLink size={11} className="flex-shrink-0" />
                                  <span>{r}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

