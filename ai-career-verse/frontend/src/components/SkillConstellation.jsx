import { useState, useEffect, useRef } from 'react';
import { Cpu, Database, Globe, Wrench, ExternalLink } from 'lucide-react';
import axios from 'axios';

const categoryConfig = {
  frontend: { color: '#22D3EE', icon: Globe, label: 'Frontend' },
  backend: { color: '#10B981', icon: Cpu, label: 'Backend' },
  database: { color: '#EC4899', icon: Database, label: 'Database' },
  tools: { color: '#F59E0B', icon: Wrench, label: 'DevOps & Tools' },
};

export default function SkillConstellation({ onNavigate }) {
  const [skills, setSkills] = useState({ nodes: [], edges: [] });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [clickedNode, setClickedNode] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    axios.get('/api/skills')
      .then(({ data }) => { setSkills(data); setLoaded(true); })
      .catch(() => {
        // Fallback data if backend is down
        setSkills(fallbackData);
        setLoaded(true);
      });
  }, []);

  const { nodes, edges } = skills;

  // Group nodes by category for bento cards
  const categories = {};
  nodes.forEach(n => {
    if (!categories[n.category]) categories[n.category] = [];
    categories[n.category].push(n);
  });

  const handleNodeClick = (node) => {
    setClickedNode(node);
    // If onNavigate prop is provided (from App.jsx), navigate to roadmap
    if (onNavigate) {
      onNavigate('roadmap');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">Skill Constellation</h2>
        <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Interactive network graph — click any node to view its Career Roadmap</p>
      </div>

      {/* Click hint */}
      {clickedNode && (
        <div className="rounded-xl p-3 dark:bg-emerald-500/5 bg-emerald-50 border dark:border-emerald-500/15 border-emerald-200/50 flex items-center gap-2">
          <ExternalLink size={14} className="text-emerald-400" />
          <p className="text-xs dark:text-gray-300 text-gray-600">
            <span className="font-bold text-emerald-400">{clickedNode.label}</span> — Navigate to Career Roadmap to see this skill in your learning path.
          </p>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 auto-rows-auto">
        {/* Network Graph - Large Card */}
        <div className="glass-card p-6 lg:col-span-3 lg:row-span-2 min-h-[420px] relative overflow-hidden">
          <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-4">
            Skill Network
          </h3>
          <svg
            ref={canvasRef}
            className="w-full h-[360px]"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background grid */}
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const source = nodes.find(n => n.id === edge.source);
              const target = nodes.find(n => n.id === edge.target);
              if (!source || !target) return null;
              const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target;
              return (
                <line
                  key={i}
                  x1={source.x} y1={source.y}
                  x2={target.x} y2={target.y}
                  stroke={isHighlighted ? '#10B981' : 'currentColor'}
                  className={isHighlighted ? '' : 'dark:text-charcoal-border text-gray-200'}
                  strokeWidth={isHighlighted ? 0.5 : 0.2}
                  strokeOpacity={isHighlighted ? 0.8 : 0.4}
                  style={{ transition: 'all 0.3s ease' }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const config = categoryConfig[node.category] || categoryConfig.tools;
              const isHovered = hoveredNode === node.id;
              const radius = 1.5 + (node.proficiency / 100) * 2;
              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer"
                  style={{ transition: 'all 0.3s ease' }}
                >
                  {/* Glow */}
                  {isHovered && (
                    <circle cx={node.x} cy={node.y} r={radius * 3}
                            fill={config.color} opacity={0.08} />
                  )}
                  {/* Pulse ring */}
                  <circle cx={node.x} cy={node.y} r={radius + 1}
                          fill="none" stroke={config.color}
                          strokeWidth={0.15} opacity={isHovered ? 0.6 : 0.2}>
                    {isHovered && (
                      <animate attributeName="r" from={radius + 1} to={radius + 4}
                               dur="1.5s" repeatCount="indefinite" />
                    )}
                    {isHovered && (
                      <animate attributeName="opacity" from="0.6" to="0"
                               dur="1.5s" repeatCount="indefinite" />
                    )}
                  </circle>
                  {/* Node circle */}
                  <circle cx={node.x} cy={node.y} r={radius}
                          fill={config.color}
                          opacity={isHovered ? 1 : 0.8}
                          style={{ filter: isHovered ? `drop-shadow(0 0 4px ${config.color})` : 'none' }} />
                  {/* Label */}
                  <text x={node.x} y={node.y + radius + 3}
                        textAnchor="middle"
                        className="dark:fill-gray-400 fill-gray-500"
                        fontSize={isHovered ? 3 : 2.2}
                        fontFamily="Inter"
                        fontWeight={isHovered ? 600 : 400}
                        style={{ transition: 'all 0.3s ease' }}>
                    {node.label}
                  </text>
                  {/* Click indicator */}
                  {isHovered && (
                    <>
                      <text x={node.x} y={node.y - radius - 2}
                            textAnchor="middle" fill={config.color}
                            fontSize={2.5} fontFamily="JetBrains Mono" fontWeight={700}>
                        {node.proficiency}%
                      </text>
                      <text x={node.x} y={node.y - radius - 5}
                            textAnchor="middle" fill={config.color}
                            fontSize={1.8} fontFamily="Inter" opacity={0.7}>
                        Click → Roadmap
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Category Cards - Right Column */}
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          const categoryNodes = categories[key] || [];
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
                {categoryNodes.map(node => (
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
                               width: loaded ? `${node.proficiency}%` : '0%',
                               background: config.color,
                             }} />
                      </div>
                      <span className="text-[10px] font-mono dark:text-gray-500 text-gray-400 w-7 text-right">
                        {node.proficiency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 justify-center">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: config.color }} />
            <span className="text-xs dark:text-gray-400 text-gray-500 font-medium">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const fallbackData = {
  nodes: [
    { id: 'react', label: 'React.js', category: 'frontend', proficiency: 92, x: 50, y: 30 },
    { id: 'node', label: 'Node.js', category: 'backend', proficiency: 88, x: 75, y: 55 },
    { id: 'postgres', label: 'PostgreSQL', category: 'database', proficiency: 82, x: 25, y: 55 },
    { id: 'python', label: 'Python', category: 'backend', proficiency: 95, x: 50, y: 70 },
    { id: 'django', label: 'Django', category: 'backend', proficiency: 87, x: 35, y: 85 },
    { id: 'js', label: 'JavaScript', category: 'frontend', proficiency: 90, x: 65, y: 15 },
    { id: 'html', label: 'HTML/CSS', category: 'frontend', proficiency: 94, x: 30, y: 15 },
    { id: 'git', label: 'Git', category: 'tools', proficiency: 85, x: 85, y: 30 },
    { id: 'docker', label: 'Docker', category: 'tools', proficiency: 72, x: 85, y: 75 },
    { id: 'flask', label: 'Flask', category: 'backend', proficiency: 84, x: 65, y: 85 },
    { id: 'tailwind', label: 'Tailwind', category: 'frontend', proficiency: 88, x: 15, y: 35 },
    { id: 'mongodb', label: 'MongoDB', category: 'database', proficiency: 76, x: 10, y: 70 },
  ],
  edges: [
    { source: 'react', target: 'js' }, { source: 'react', target: 'node' },
    { source: 'react', target: 'tailwind' }, { source: 'node', target: 'postgres' },
    { source: 'node', target: 'mongodb' }, { source: 'python', target: 'django' },
    { source: 'python', target: 'flask' }, { source: 'python', target: 'postgres' },
    { source: 'js', target: 'html' }, { source: 'node', target: 'docker' },
    { source: 'node', target: 'git' }, { source: 'django', target: 'postgres' },
    { source: 'flask', target: 'mongodb' },
  ],
};
