import { useState, useEffect } from 'react';
import { Cpu, Database, Globe, Wrench, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const categoryConfig = {
  frontend: { color: '#22D3EE', icon: Globe, label: 'Frontend' },
  backend: { color: '#10B981', icon: Cpu, label: 'Backend' },
  database: { color: '#EC4899', icon: Database, label: 'Database' },
  tools: { color: '#F59E0B', icon: Wrench, label: 'DevOps & Tools' },
};

/**
 * Skill Tree — a real tree structure from root (fundamentals) to top (advanced).
 * Each tier represents a learning stage, nodes branch out showing
 * how skills build on each other.
 */
const SKILL_TREE = [
  {
    tier: 0,
    label: 'Fundamentals',
    description: 'Start here — the building blocks of web development',
    nodes: [
      { id: 'html', label: 'HTML/CSS', category: 'frontend', proficiency: 94, children: ['js', 'tailwind'] },
    ],
  },
  {
    tier: 1,
    label: 'Core Languages',
    description: 'Master the languages that power the web',
    nodes: [
      { id: 'js', label: 'JavaScript', category: 'frontend', proficiency: 90, children: ['react', 'node'] },
      { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend', proficiency: 88, children: ['react'] },
      { id: 'python', label: 'Python', category: 'backend', proficiency: 95, children: ['django', 'flask'] },
    ],
  },
  {
    tier: 2,
    label: 'Frameworks',
    description: 'Build real applications with production frameworks',
    nodes: [
      { id: 'react', label: 'React.js', category: 'frontend', proficiency: 92, children: ['docker', 'git'] },
      { id: 'node', label: 'Node.js', category: 'backend', proficiency: 88, children: ['postgres', 'mongodb', 'docker'] },
      { id: 'django', label: 'Django', category: 'backend', proficiency: 87, children: ['postgres'] },
      { id: 'flask', label: 'Flask', category: 'backend', proficiency: 84, children: ['mongodb'] },
    ],
  },
  {
    tier: 3,
    label: 'Data & Infrastructure',
    description: 'Store, query, and deploy your applications',
    nodes: [
      { id: 'postgres', label: 'PostgreSQL', category: 'database', proficiency: 82, children: [] },
      { id: 'mongodb', label: 'MongoDB', category: 'database', proficiency: 76, children: [] },
      { id: 'docker', label: 'Docker', category: 'tools', proficiency: 72, children: [] },
      { id: 'git', label: 'Git', category: 'tools', proficiency: 85, children: [] },
    ],
  },
];

// Flatten all nodes for lookup
const ALL_NODES = SKILL_TREE.flatMap(t => t.nodes);

export default function SkillConstellation({ onNavigate }) {
  const [skills, setSkills] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [expandedTiers, setExpandedTiers] = useState(new Set([0, 1, 2, 3]));

  useEffect(() => {
    axios.get('/api/skills')
      .then(({ data }) => { setSkills(data); setLoaded(true); })
      .catch(() => { setLoaded(true); });
  }, []);

  // Merge API skills with tree structure (update proficiency from backend if available)
  const getNode = (nodeId) => {
    const treeNode = ALL_NODES.find(n => n.id === nodeId);
    if (skills?.nodes) {
      const apiNode = skills.nodes.find(n => n.id === nodeId);
      if (apiNode && treeNode) return { ...treeNode, proficiency: apiNode.proficiency };
    }
    return treeNode;
  };

  const toggleTier = (tier) => {
    setExpandedTiers(prev => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  const handleNodeClick = (node) => {
    if (onNavigate) onNavigate('roadmap');
  };

  // Colors for proficiency ring
  const getProfColor = (prof) => {
    if (prof >= 90) return '#10B981';
    if (prof >= 80) return '#22D3EE';
    if (prof >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">Skill Tree</h2>
        <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">
          Your learning path from fundamentals to mastery — click any skill to view its Career Roadmap
        </p>
      </div>

      {/* Tree Legend */}
      <div className="flex items-center gap-6 flex-wrap">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: config.color }} />
            <span className="text-xs dark:text-gray-400 text-gray-500 font-medium">{config.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-[10px] dark:text-gray-500 text-gray-400">Proficiency:</span>
          {[['90%+', '#10B981'], ['80%+', '#22D3EE'], ['70%+', '#F59E0B'], ['<70%', '#EF4444']].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1 text-[10px]" style={{ color }}>
              <span className="w-2 h-2 rounded-full" style={{ background: color }} /> {label}
            </span>
          ))}
        </div>
      </div>

      {/* Skill Tree — Tiers */}
      <div className="relative">
        {/* Vertical trunk line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 dark:bg-white/[0.06] bg-gray-200 z-0" />

        <div className="space-y-2 relative z-10">
          {SKILL_TREE.map((tier, tierIdx) => {
            const isExpanded = expandedTiers.has(tier.tier);
            const isLastTier = tierIdx === SKILL_TREE.length - 1;

            return (
              <div key={tier.tier}>
                {/* Tier Header */}
                <button
                  onClick={() => toggleTier(tier.tier)}
                  className="flex items-center gap-3 w-full text-left group py-2"
                >
                  {/* Tier dot on trunk */}
                  <div className={`w-[17px] h-[17px] rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                    isExpanded
                      ? 'dark:bg-violet-500 bg-violet-500 dark:border-violet-400 border-violet-400'
                      : 'dark:bg-charcoal bg-white dark:border-white/20 border-gray-300'
                  }`} style={{ marginLeft: '23px' }}>
                    {isExpanded
                      ? <ChevronDown size={10} className="text-white" />
                      : <ChevronRight size={10} className="dark:text-gray-400 text-gray-500" />
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono dark:text-violet-400 text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
                      TIER {tier.tier}
                    </span>
                    <span className="text-sm font-bold dark:text-white text-gray-900 group-hover:text-violet-400 transition-colors">
                      {tier.label}
                    </span>
                    <span className="text-[11px] dark:text-gray-500 text-gray-400 hidden sm:inline">
                      — {tier.description}
                    </span>
                  </div>
                </button>

                {/* Tier Nodes */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="ml-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-4"
                    >
                      {tier.nodes.map((node, nodeIdx) => {
                        const resolved = getNode(node.id) || node;
                        const config = categoryConfig[resolved.category] || categoryConfig.tools;
                        const isHovered = hoveredNode === resolved.id;
                        const profColor = getProfColor(resolved.proficiency);
                        const Icon = config.icon;

                        return (
                          <motion.div
                            key={resolved.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: nodeIdx * 0.06 }}
                            onMouseEnter={() => setHoveredNode(resolved.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => handleNodeClick(resolved)}
                            className={`glass-card p-4 cursor-pointer transition-all group/card ${
                              isHovered
                                ? 'dark:border-violet-500/30 border-violet-300 shadow-lg shadow-violet-600/5 scale-[1.02]'
                                : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ background: `${config.color}15` }}
                                >
                                  <Icon size={14} style={{ color: config.color }} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold dark:text-white text-gray-900">
                                    {resolved.label}
                                  </p>
                                  <p className="text-[9px] uppercase tracking-wider" style={{ color: config.color }}>
                                    {config.label}
                                  </p>
                                </div>
                              </div>

                              {/* Proficiency Ring */}
                              <div className="relative w-10 h-10">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                  <circle cx="18" cy="18" r="15" fill="none"
                                    className="dark:stroke-white/[0.06] stroke-gray-200" strokeWidth="3" />
                                  <circle cx="18" cy="18" r="15" fill="none"
                                    stroke={profColor} strokeWidth="3"
                                    strokeDasharray={`${resolved.proficiency * 0.94} 100`}
                                    strokeLinecap="round"
                                    className="transition-all duration-700"
                                    style={{ strokeDasharray: loaded ? `${resolved.proficiency * 0.94} 100` : '0 100' }}
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold font-mono"
                                  style={{ color: profColor }}>
                                  {resolved.proficiency}
                                </span>
                              </div>
                            </div>

                            {/* Branches (children) */}
                            {resolved.children && resolved.children.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[9px] dark:text-gray-600 text-gray-400">Unlocks →</span>
                                {resolved.children.map(childId => {
                                  const child = ALL_NODES.find(n => n.id === childId);
                                  if (!child) return null;
                                  return (
                                    <span key={childId}
                                      className="text-[9px] px-1.5 py-0.5 rounded dark:bg-white/[0.04] bg-gray-100 dark:text-gray-400 text-gray-500 font-medium">
                                      {child.label}
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            {/* Hover hint */}
                            {isHovered && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex items-center gap-1 mt-2 text-[9px] text-violet-400">
                                <ExternalLink size={9} /> Click to view Roadmap
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          const categoryNodes = ALL_NODES.filter(n => n.category === key);
          const avgProf = categoryNodes.length > 0
            ? Math.round(categoryNodes.reduce((s, n) => s + (getNode(n.id)?.proficiency || n.proficiency), 0) / categoryNodes.length)
            : 0;

          return (
            <div key={key} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${config.color}15` }}>
                  <Icon size={14} style={{ color: config.color }} />
                </div>
                <span className="text-xs font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
                  {config.label}
                </span>
              </div>
              <div className="space-y-2">
                {categoryNodes.map(node => {
                  const resolved = getNode(node.id) || node;
                  return (
                    <div key={node.id}
                      className="flex items-center justify-between cursor-pointer hover:dark:bg-white/[0.02] hover:bg-gray-50 rounded-lg p-1 -m-1 transition-colors"
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => handleNodeClick(node)}>
                      <span className="text-xs dark:text-gray-400 text-gray-500 font-medium">{node.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full dark:bg-charcoal-light bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: loaded ? `${resolved.proficiency}%` : '0%',
                              background: config.color,
                            }} />
                        </div>
                        <span className="text-[10px] font-mono dark:text-gray-500 text-gray-400 w-7 text-right">
                          {resolved.proficiency}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-2 border-t dark:border-white/[0.04] border-gray-200/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] dark:text-gray-500 text-gray-400 uppercase">Avg</span>
                  <span className="text-xs font-bold font-mono" style={{ color: config.color }}>{avgProf}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
