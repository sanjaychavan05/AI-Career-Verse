import { createContext, useContext, useState, useCallback } from 'react';

const PlatformContext = createContext(null);

/* ───── Preset accounts ───── */
export const PRESET_ACCOUNTS = {
  STUDENT: { name: 'Sanjay Chavan', email: 'sanjay@careerverse.in', password: 'student123', role: 'STUDENT' },
  MENTOR:  { name: 'Anusha M', email: 'anusha@careerverse.in', password: 'mentor123', role: 'MENTOR' },
  TEACHER: { name: 'Prof. Manjunath Patil', email: 'manjunath@careerverse.in', password: 'teacher123', role: 'TEACHER' },
};

/* ───── Shared seed data ───── */
const SEED_JOBS = [
  { id: 1, title: 'Python Full Stack Developer', company: 'TCS Digital', location: 'Mumbai', salary: '₹8-12 LPA', type: 'Full-time', postedBy: 'Prof. Manjunath Patil', postedRole: 'TEACHER', skills: ['Python', 'Django', 'React', 'PostgreSQL'], applied: [] },
  { id: 2, title: 'Frontend Engineer', company: 'Infosys', location: 'Pune', salary: '₹6-10 LPA', type: 'Full-time', postedBy: 'Anusha M', postedRole: 'MENTOR', skills: ['React', 'JavaScript', 'Tailwind CSS'], applied: [] },
  { id: 3, title: 'Backend Developer Intern', company: 'Wipro', location: 'Bangalore', salary: '₹25K/month', type: 'Internship', postedBy: 'Prof. Manjunath Patil', postedRole: 'TEACHER', skills: ['Java', 'Spring Boot', 'MySQL'], applied: [] },
];

const SEED_STUDENTS = [
  { id: 1, name: 'Sanjay Chavan', email: 'sanjay@careerverse.in', skills: ['Python', 'React', 'Django', 'JavaScript', 'Git'], streak: 23, xp: 12450, careerReadiness: 85, atsScore: 92, codingSolved: 5, placementReady: true, github: 116, level: 12 },
  { id: 2, name: 'Arjun Mehta', email: 'arjun@test.com', skills: ['Python', 'Flask', 'PostgreSQL', 'Docker'], streak: 15, xp: 8900, careerReadiness: 72, atsScore: 78, codingSolved: 3, placementReady: false, github: 89, level: 9 },
  { id: 3, name: 'Kavya Nair', email: 'kavya@test.com', skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'], streak: 31, xp: 14200, careerReadiness: 91, atsScore: 88, codingSolved: 8, placementReady: true, github: 143, level: 14 },
  { id: 4, name: 'Rahul Patel', email: 'rahul@test.com', skills: ['Java', 'Spring Boot', 'AWS', 'Kubernetes'], streak: 10, xp: 9800, careerReadiness: 68, atsScore: 82, codingSolved: 4, placementReady: false, github: 67, level: 10 },
  { id: 5, name: 'Sneha Reddy', email: 'sneha@test.com', skills: ['DevOps', 'Docker', 'Terraform', 'Linux'], streak: 18, xp: 8200, careerReadiness: 76, atsScore: 85, codingSolved: 6, placementReady: true, github: 98, level: 8 },
];

export function PlatformProvider({ children }) {
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [students] = useState(SEED_STUDENTS);

  const addJob = useCallback((job) => {
    setJobs(prev => [{ ...job, id: Date.now(), applied: [] }, ...prev]);
  }, []);

  const applyJob = useCallback((jobId, studentName) => {
    setJobs(prev => prev.map(j => j.id === jobId
      ? { ...j, applied: [...new Set([...j.applied, studentName])] }
      : j
    ));
  }, []);

  const sendMentorRequest = useCallback((studentName) => {
    const existing = mentorRequests.find(r => r.student === studentName);
    if (existing) return;
    setMentorRequests(prev => [...prev, { id: Date.now(), student: studentName, status: 'pending', date: new Date().toISOString() }]);
  }, [mentorRequests]);

  const acceptRequest = useCallback((reqId) => {
    setMentorRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'accepted' } : r));
  }, []);

  const rejectRequest = useCallback((reqId) => {
    setMentorRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
  }, []);

  return (
    <PlatformContext.Provider value={{
      jobs, addJob, applyJob,
      mentorRequests, sendMentorRequest, acceptRequest, rejectRequest,
      students,
    }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
