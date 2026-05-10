import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const GamificationContext = createContext(null);

const DEFAULT_USER_ID = 1; // Arjun Mehta

export function GamificationProvider({ children }) {
  const [stats, setStats] = useState({
    xp: 12450,
    level: 12,
    streak: 23,
    name: 'Arjun Mehta',
    role: 'STUDENT',
    careerReadiness: 85,
    recentEvents: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/gamification/stats/${DEFAULT_USER_ID}`);
      setStats(data);
    } catch (err) {
      console.warn('Gamification stats fallback:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /**
   * Award XP for an action. Returns updated stats.
   * @param {'GITHUB_SYNC'|'INTERVIEW_COMPLETE'|'CAREER_DNA_ANALYSIS'|'COURSE_COMPLETE'} action
   * @param {string} description
   */
  const awardXP = useCallback(async (action, description = '') => {
    try {
      const { data } = await axios.post('/api/gamification/award', {
        userId: DEFAULT_USER_ID,
        action,
        description,
      });
      // Update local state immediately
      setStats(prev => ({
        ...prev,
        xp: data.xp,
        level: data.level,
        streak: data.streak,
      }));
      return data;
    } catch (err) {
      console.error('Failed to award XP:', err);
      return null;
    }
  }, []);

  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <GamificationContext.Provider value={{ stats, loading, awardXP, refreshStats, userId: DEFAULT_USER_ID }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
}
