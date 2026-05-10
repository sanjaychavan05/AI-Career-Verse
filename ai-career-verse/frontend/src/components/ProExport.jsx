import { useRef, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

// Arjun Mehta's complete profile — matching the exact styling from screenshots
const PROFILE = {
  name: 'Arjun Mehta',
  title: 'Python Full Stack Developer',
  email: 'arjun.mehta@email.com',
  phone: '+91 98765 43210',
  location: 'India',
  website: 'arjunmehta.dev',
  github: 'github.com/arjunmehta',
  summary: 'Passionate Python Full Stack Developer with expertise in building scalable web applications using Django, Flask, React.js, and PostgreSQL. Code Bharat 2025 3rd Place winner. Experienced in developing end-to-end solutions from database design to responsive frontend interfaces. Committed to writing clean, maintainable code and delivering impactful products.',
  skills: {
    'Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS'],
    'Backend': ['Django', 'Flask', 'Node.js', 'REST APIs', 'GraphQL'],
    'Frontend': ['React.js', 'Tailwind CSS', 'Next.js', 'Redux'],
    'Database': ['PostgreSQL', 'MongoDB', 'Redis', 'H2'],
    'Tools': ['Git', 'Docker', 'Linux', 'AWS', 'CI/CD'],
  },
  experience: [
    {
      role: 'Python Full Stack Developer',
      company: 'AI Career Verse Project',
      period: '2024 - Present',
      points: [
        'Designed and built a full-stack AI-powered career guidance platform using React.js and Spring Boot',
        'Integrated Google Gemini AI API for intelligent interview evaluation and career DNA analysis',
        'Implemented gamification system tracking 12,450+ XP across coding, interviews, and skill development',
        'Built real-time GitHub profile analytics with language distribution and repository insights',
      ],
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'University',
      period: '2021 - 2025',
      gpa: '8.5/10',
    },
  ],
  achievements: [
    {
      title: '🏆 3rd Place — Code Bharat Hackathon 2025',
      description: 'Competed against 500+ teams nationwide. Built an AI-powered career guidance platform in 36 hours. Recognized for innovative use of AI/ML in career development.',
    },
    {
      title: '🔥 23-Day Active Streak',
      description: 'Maintained consistent daily coding and learning activity, demonstrating dedication and self-discipline.',
    },
    {
      title: '💯 92% ATS Resume Score',
      description: 'Achieved top-tier resume optimization score through AI-powered analysis and targeted improvements.',
    },
  ],
  projects: [
    {
      name: 'AI Career Verse',
      tech: 'React.js, Spring Boot, Gemini AI, H2 Database, Tailwind CSS',
      description: 'Full-stack AI-powered career platform with resume scoring, skill constellation visualization, career DNA analysis, interview lab with AI evaluation, and gamification engine.',
    },
    {
      name: 'GitHub Digital Identity Hub',
      tech: 'React.js, GitHub API, Axios, Framer Motion',
      description: 'Real-time GitHub profile intelligence dashboard with language distribution charts, repository analytics, and contribution tracking.',
    },
  ],
};

export default function ProExport() {
  const resumeRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const { stats } = useGamification();

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Arjun_Mehta_Resume.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Pro Export</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Professional resume with achievement showcase — ready for PDF export</p>
        </div>
        <div className="flex gap-3 no-print">
          <button onClick={handlePrint} className="btn-ghost flex items-center gap-2 text-sm border dark:border-charcoal-border border-gray-200 rounded-xl px-4 py-2">
            <Printer size={16} /> Print
          </button>
          <button id="export-pdf-btn" onClick={handleExportPDF} disabled={exporting} className="btn-primary flex items-center gap-2">
            <Download size={16} /> {exporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="glass-card overflow-hidden no-print-border">
        <div
          ref={resumeRef}
          className="bg-white text-gray-900 max-w-[800px] mx-auto"
          style={{ fontFamily: "'Inter', sans-serif", padding: '48px 56px', lineHeight: 1.5 }}
        >
          {/* Header */}
          <div style={{ borderBottom: '2px solid #1E293B', paddingBottom: 20, marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {PROFILE.name}
            </h1>
            <p style={{ fontSize: 14, color: '#6C5CE7', fontWeight: 600, marginBottom: 12 }}>{PROFILE.title}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: 12, color: '#64748B' }}>
              <span>✉ {PROFILE.email}</span>
              <span>☎ {PROFILE.phone}</span>
              <span>📍 {PROFILE.location}</span>
              <span>🔗 {PROFILE.github}</span>
            </div>
          </div>

          {/* Summary */}
          <Section title="PROFESSIONAL SUMMARY">
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{PROFILE.summary}</p>
          </Section>

          {/* Skills */}
          <Section title="TECHNICAL SKILLS">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px' }}>
              {Object.entries(PROFILE.skills).map(([category, skills]) => (
                <div key={category} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: '#1E293B', minWidth: 80 }}>{category}:</span>
                  <span style={{ color: '#475569' }}>{skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Experience */}
          <Section title="EXPERIENCE">
            {PROFILE.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{exp.role}</span>
                  <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>{exp.period}</span>
                </div>
                <p style={{ fontSize: 13, color: '#6C5CE7', fontWeight: 500 }}>{exp.company}</p>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: 6 }}>
                  {exp.points.map((p, j) => (
                    <li key={j} style={{ fontSize: 12.5, color: '#475569', paddingLeft: 16, position: 'relative', marginBottom: 4 }}>
                      <span style={{ position: 'absolute', left: 0, color: '#6C5CE7' }}>▸</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          {/* Projects */}
          <Section title="PROJECTS">
            {PROFILE.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{proj.name}</span>
                </div>
                <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{proj.tech}</p>
                <p style={{ fontSize: 12.5, color: '#475569' }}>{proj.description}</p>
              </div>
            ))}
          </Section>

          {/* Education */}
          <Section title="EDUCATION">
            {PROFILE.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{edu.degree}</span>
                  <p style={{ fontSize: 13, color: '#6C5CE7', fontWeight: 500 }}>{edu.school}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>{edu.period}</span>
                  {edu.gpa && <p style={{ fontSize: 12, color: '#64748B' }}>GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </Section>

          {/* Achievements — includes Code Bharat */}
          <Section title="ACHIEVEMENTS">
            {PROFILE.achievements.map((ach, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{ach.title}</p>
                <p style={{ fontSize: 12.5, color: '#475569' }}>{ach.description}</p>
              </div>
            ))}
          </Section>

          {/* XP Footer */}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
              Generated by AI CareerVerse • {new Date().toLocaleDateString()}
            </span>
            <span style={{ fontSize: 10, color: '#6C5CE7', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
              {stats.xp.toLocaleString()} XP • Level {stats.level} • {stats.streak}-Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* XP Stats card */}
      <div className="rounded-2xl p-4 dark:bg-gradient-to-r dark:from-violet-500/5 dark:to-amber-500/5 bg-gradient-to-r from-violet-50 to-amber-50 border dark:border-violet-500/10 border-violet-200/40 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-sm font-bold dark:text-white text-gray-900">Achievement Included</p>
            <p className="text-xs dark:text-gray-400 text-gray-500">3rd Place — Code Bharat Hackathon 2025 is showcased in this resume</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold font-mono dark:text-violet-400 text-violet-600">{stats.xp.toLocaleString()} XP</p>
          <p className="text-[9px] dark:text-gray-500 text-gray-400 uppercase">Career Score</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 700, color: '#1E293B', letterSpacing: '0.1em',
        borderBottom: '1px solid #E2E8F0', paddingBottom: 6, marginBottom: 10,
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
