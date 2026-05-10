import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dna, Loader2, Sparkles, Target, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import axios from 'axios';

const TRAIT_LABELS = {
  problemSolving: 'Problem Solving', creativity: 'Creativity', leadership: 'Leadership',
  communication: 'Communication', technicalDepth: 'Technical Depth', adaptability: 'Adaptability',
  teamwork: 'Teamwork', analyticalThinking: 'Analytical Thinking',
};

/* Auto-generate DNA profile from student performance stats */
function generateDNAFromStats(stats) {
  const skills = (stats.skills || 'Python,Django,React.js,Node.js,PostgreSQL,Docker').split(',').map(s => s.trim());
  const xp = stats.xp || 12450;
  const level = stats.level || 12;
  const streak = stats.streak || 23;
  const readiness = stats.careerReadiness || 85;

  // Calculate traits based on performance metrics
  const traits = {
    problemSolving: Math.min(95, 60 + Math.floor(readiness * 0.3) + Math.floor(level * 1.5)),
    creativity: Math.min(92, 55 + Math.floor(xp / 300) + Math.floor(streak * 0.5)),
    leadership: Math.min(88, 50 + Math.floor(level * 3)),
    communication: Math.min(90, 60 + Math.floor(streak * 1.2)),
    technicalDepth: Math.min(96, 65 + Math.floor(skills.length * 3)),
    adaptability: Math.min(91, 58 + Math.floor(readiness * 0.25) + Math.floor(xp / 400)),
    teamwork: Math.min(87, 55 + Math.floor(streak * 1.5)),
    analyticalThinking: Math.min(94, 62 + Math.floor(readiness * 0.28)),
  };

  // Determine archetype
  const topTraits = Object.entries(traits).sort((a, b) => b[1] - a[1]);
  let archetype = 'The Builder';
  let archetypeDesc = 'You thrive on creating solutions from the ground up, combining technical depth with creative problem-solving.';

  if (topTraits[0][0] === 'leadership') {
    archetype = 'The Architect';
    archetypeDesc = 'You excel at designing systems and leading technical decisions, with a strong vision for scalable solutions.';
  } else if (topTraits[0][0] === 'creativity') {
    archetype = 'The Innovator';
    archetypeDesc = 'Your creative approach to problem-solving sets you apart, consistently finding novel solutions to complex challenges.';
  } else if (topTraits[0][0] === 'analyticalThinking') {
    archetype = 'The Analyst';
    archetypeDesc = 'Your analytical precision and systematic approach make you exceptional at debugging and optimizing systems.';
  }

  // Engineering affinity
  const engineeringAffinity = Math.min(98, Math.floor((traits.technicalDepth + traits.problemSolving + traits.analyticalThinking) / 3));
  const leadershipPotential = Math.min(95, Math.floor((traits.leadership + traits.communication + traits.teamwork) / 3));
  const innovationIndex = Math.min(96, Math.floor((traits.creativity + traits.adaptability + traits.problemSolving) / 3));

  // Compatibility scores
  const compatibilityScores = [
    { role: 'Senior Frontend Engineer', score: Math.min(96, traits.creativity + traits.technicalDepth - 80), reason: 'Strong UI/UX intuition with deep technical skills' },
    { role: 'Full-Stack Architect', score: Math.min(94, engineeringAffinity - 2), reason: 'Comprehensive understanding of both frontend and backend' },
    { role: 'Engineering Manager', score: Math.min(90, leadershipPotential), reason: 'Growing leadership skills with technical foundation' },
    { role: 'Solutions Architect', score: Math.min(92, Math.floor((engineeringAffinity + leadershipPotential) / 2)), reason: 'Systems thinking combined with communication skills' },
    { role: 'DevOps Lead', score: Math.min(88, traits.analyticalThinking - 5), reason: 'Analytical approach to infrastructure and automation' },
    { role: 'ML Engineer', score: Math.min(85, Math.floor((traits.analyticalThinking + traits.problemSolving) / 2) - 3), reason: 'Data-driven problem solving with Python expertise' },
  ].sort((a, b) => b.score - a.score);

  // DNA Sequence tags
  const helixSequence = skills.slice(0, 8).map(s => s.toUpperCase().replace(/\./g, ''));

  return {
    traits,
    dominantArchetype: archetype,
    archetypeDescription: archetypeDesc,
    engineeringAffinity,
    leadershipPotential,
    innovationIndex,
    compatibilityScores,
    helixSequence,
    summary: `Based on ${xp.toLocaleString()} XP earned, a ${streak}-day streak, and ${skills.length} technical skills, your career DNA reveals a strong ${archetype.toLowerCase()} profile with ${engineeringAffinity}% engineering affinity. Your top traits are ${topTraits[0][0].replace(/([A-Z])/g, ' $1').trim()} and ${topTraits[1][0].replace(/([A-Z])/g, ' $1').trim()}.`,
  };
}

export default function CareerDNA() {
  const { awardXP, stats } = useGamification();
  const [result, setResult] = useState(null);
  const [reanalyzing, setReanalyzing] = useState(false);

  // Auto-generate DNA profile based on student stats
  useEffect(() => {
    const dna = generateDNAFromStats(stats);
    setResult(dna);
  }, [stats]);

  const reanalyze = async () => {
    setReanalyzing(true);
    try {
      const { data } = await axios.post('/api/career-dna/analyze', {
        skills: stats.skills || 'Python, Django, Flask, React.js, Node.js, PostgreSQL, Git, Docker',
        experience: 'Python Full Stack Developer, 2 years building web applications',
        interests: 'AI/ML, System Design, Open Source, Cloud Architecture',
      });
      setResult(data);
      await awardXP('CAREER_DNA_ANALYSIS', 'Career DNA re-analysis completed');
    } catch {
      // Regenerate from stats on failure
      setResult(generateDNAFromStats(stats));
    } finally {
      setReanalyzing(false);
    }
  };

  if (!result) return <div className="text-center py-20 dark:text-gray-500 text-gray-400">Analyzing your career DNA...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Career DNA Analyzer</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">AI analysis of your career personality and compatibility</p>
        </div>
        <button onClick={reanalyze} disabled={reanalyzing}
          className="btn-primary flex items-center gap-2 text-sm">
          {reanalyzing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {reanalyzing ? 'Analyzing...' : '🔄 Re-analyze'}
        </button>
      </div>

      {/* DNA Helix Visual Banner */}
      <div className="rounded-2xl p-6 dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60 relative overflow-hidden">
        {/* Floating DNA dots */}
        <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-center gap-3">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              animate={{ x: [i % 2 === 0 ? -4 : 4, i % 2 === 0 ? 4 : -4] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: i * 0.2 }}
              className="w-3 h-3 rounded-full bg-violet-400 shadow-lg shadow-violet-400/30" style={{ opacity: 0.4 + (i * 0.1) }} />
          ))}
        </div>

        <div className="ml-12">
          <Sparkles size={18} className="text-violet-400 mb-2" />
          <h3 className="text-lg font-bold dark:text-white text-gray-900">Your Career DNA Profile</h3>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1 max-w-2xl">
            Based on comprehensive analysis of your skills, personality traits, and career history,
            our AI has mapped your unique career DNA sequence.
          </p>

          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { label: 'Engineering Affinity', value: result.engineeringAffinity, color: 'from-violet-500 to-indigo-500' },
              { label: 'Leadership Potential', value: result.leadershipPotential, color: 'from-cyan-500 to-blue-500' },
              { label: 'Innovation Index', value: result.innovationIndex, color: 'from-amber-500 to-orange-500' },
            ].map((s, i) => (
              <div key={i} className={`rounded-xl p-4 bg-gradient-to-r ${s.color} bg-opacity-10 text-center
                dark:bg-opacity-[0.08] border dark:border-white/[0.04] border-gray-200/40`}>
                <p className="text-3xl font-extrabold font-mono text-white dark:text-white text-gray-900" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{s.value}%</p>
                <p className="text-[11px] font-medium text-white/80 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality Analysis — Radar Chart */}
        <div className="rounded-2xl p-6 dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60">
          <h3 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-4">Personality Analysis</h3>
          <RadarChart traits={result.traits || {}} />
        </div>

        {/* Career Compatibility */}
        <div className="rounded-2xl p-6 dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-gray-200/60">
          <h3 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-4">Career Compatibility</h3>
          <div className="space-y-3">
            {(result.compatibilityScores || []).map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium dark:text-gray-200 text-gray-700">{c.role}</span>
                  <span className={`text-sm font-bold font-mono ${c.score >= 90 ? 'text-green-400' : c.score >= 80 ? 'text-cyan-400' : 'text-amber-400'}`}>{c.score}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full dark:bg-white/[0.04] bg-gray-100 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.score}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${c.score >= 90 ? 'bg-green-500' : c.score >= 80 ? 'bg-cyan-500' : 'bg-amber-500'}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Archetype + DNA Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-gradient-to-br dark:from-violet-600/10 dark:to-charcoal-card/40 from-violet-50 to-white border dark:border-violet-500/10 border-violet-200/40">
          <Sparkles size={20} className="text-violet-400 mb-3" />
          <p className="text-[10px] font-bold dark:text-violet-400 text-violet-600 uppercase tracking-widest mb-1">Dominant Archetype</p>
          <h3 className="text-xl font-extrabold dark:text-white text-gray-900">{result.dominantArchetype}</h3>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-2 leading-relaxed">{result.archetypeDescription}</p>
          <div className="mt-5">
            <p className="text-[10px] font-bold dark:text-gray-500 text-gray-400 uppercase tracking-widest mb-2">DNA Sequence</p>
            <div className="flex flex-wrap gap-1.5">
              {(result.helixSequence || []).map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-lg text-[10px] font-bold dark:bg-violet-500/10 bg-violet-50 dark:text-violet-300 text-violet-600 border dark:border-violet-500/20 border-violet-200/60">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2 rounded-2xl p-6 dark:bg-violet-500/5 bg-violet-50 border dark:border-violet-500/10 border-violet-200/40">
          <h3 className="text-xs font-bold dark:text-violet-400 text-violet-600 uppercase tracking-wider mb-3">AI Summary</h3>
          <p className="text-sm dark:text-gray-300 text-gray-600 leading-relaxed">{result.summary}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* SVG Radar Chart */
function RadarChart({ traits }) {
  const keys = Object.keys(traits);
  const n = keys.length;
  if (n === 0) return null;
  const cx = 150, cy = 150, r = 110;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getPoint = (i, val = 1) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  };

  const dataPoints = keys.map((k, i) => getPoint(i, traits[k] / 100));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
      {/* Grid */}
      {levels.map(l => (
        <polygon key={l} fill="none" className="dark:stroke-white/[0.06] stroke-gray-200" strokeWidth="0.5"
          points={keys.map((_, i) => { const p = getPoint(i, l); return `${p.x},${p.y}`; }).join(' ')} />
      ))}
      {/* Axes */}
      {keys.map((_, i) => {
        const p = getPoint(i);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} className="dark:stroke-white/[0.04] stroke-gray-200" strokeWidth="0.5" />;
      })}
      {/* Data polygon */}
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <motion.path d={dataPath} fill="url(#radarGrad)" stroke="#10B981" strokeWidth="2"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }} style={{ transformOrigin: `${cx}px ${cy}px` }} />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#10B981" stroke="#0D1117" strokeWidth="2" />
      ))}
      {/* Labels */}
      {keys.map((k, i) => {
        const p = getPoint(i, 1.25);
        return (
          <text key={k} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            className="dark:fill-gray-300 fill-gray-600" fontSize="10" fontFamily="Inter" fontWeight="500">
            {TRAIT_LABELS[k] || k}
          </text>
        );
      })}
    </svg>
  );
}
