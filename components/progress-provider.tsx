'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ProgressData = {
  xp: number;
  currentLevel: number;
  completedChallenges: string[];
  unlockedChallenges: string[];
};

type ProgressContextType = {
  progress: ProgressData | null;
  xpLogs: any[];
  attemptsCount: number;
  allAchievements: any[];
  loading: boolean;
  refetchProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [xpLogs, setXpLogs] = useState<any[]>([]);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [allAchievements, setAllAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/labs/progress');
      if (res.ok) {
        const data = await res.json();
        if (data.progress) {
          setProgress({
            xp: data.progress.xp,
            currentLevel: data.progress.currentLevel,
            completedChallenges: data.progress.completedChallenges || [],
            unlockedChallenges: data.progress.unlockedChallenges || [],
          });
        }
        setXpLogs(data.xpLogs || []);
        setAttemptsCount(data.attemptsCount || 0);
        setAllAchievements(data.allAchievements || []);
      }
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const refetchProgress = async () => {
    await fetchProgress();
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        xpLogs,
        attemptsCount,
        allAchievements,
        loading,
        refetchProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
