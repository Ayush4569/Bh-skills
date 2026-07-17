'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame,
  Trophy,
  Activity,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Shield,
  Compass,
  Zap,
  Flag,
  Award,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useProgress } from '@/components/progress-provider';
import { LoadingScreen } from '@/components/loader';

// Map icon names to Lucide icons
const iconMap: Record<string, React.ComponentType<any>> = {
  Flag: Flag,
  Shield: Shield,
  Compass: Compass,
  Zap: Zap,
  Flame: Flame,
  Award: Award,
};

export default function Dashboard() {
  const { progress, xpLogs, attemptsCount, allAchievements, loading, refetchProgress } = useProgress();
  const [resetting, setResetting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Level boundary calculations
  // Level threshold is 150 XP per level
  const xpInCurrentLevel = progress ? progress.xp % 150 : 0;
  const levelProgressPercent = Math.min((xpInCurrentLevel / 150) * 100, 100);
  const xpNeededForNextLevel = 150 - xpInCurrentLevel;

  const handleResetProgress = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Progress',
      message: 'Are you sure you want to reset all of your progress, XP, and attempts? This action is irreversible.',
      onConfirm: executeResetProgress,
    });
  };

  const executeResetProgress = async () => {
    setResetting(true);
    try {
      const res = await fetch('/api/labs/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        await refetchProgress();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading dashboard data..." />;
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your level, XP achievements, and learning milestones.
          </p>
        </div>
        <button
          onClick={handleResetProgress}
          disabled={resetting}
          className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive px-3.5 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {resetting ? 'Resetting...' : 'Reset Progress'}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP & Level Progress */}
        <div className="col-span-1 md:col-span-2 rounded-2xl border border-border/50 bg-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Level</span>
              <h2 className="text-5xl font-extrabold mt-1 text-foreground">
                LVL {progress?.currentLevel || 1}
              </h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total XP</span>
              <span className="text-3xl font-extrabold mt-1 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {progress?.xp || 0} XP
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">{xpInCurrentLevel} / 150 XP</span>
              <span className="text-foreground">{xpNeededForNextLevel} XP to Level { (progress?.currentLevel || 1) + 1 }</span>
            </div>
            {/* Custom progress bar */}
            <div className="h-3.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/50 bg-card p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Challenges Completed</span>
            <span className="text-3xl font-extrabold text-foreground mt-2">
              {progress?.completedChallenges?.length || 0}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1">unlocked the next step</span>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Submissions</span>
            <span className="text-3xl font-extrabold text-foreground mt-2">{attemptsCount}</span>
            <span className="text-[10px] text-muted-foreground mt-1">all run attempts logged</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Paths & Timeline / Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Learning Paths + Coding Time */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Tracks */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Active Learning Paths
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web Path Card */}
              <div className="group rounded-2xl border border-border/50 bg-card p-6 flex flex-col justify-between hover:border-border hover:shadow-[0_0_15px_rgba(245,158,11,0.03)] transition-all">
                <div>
                  <h4 className="text-lg font-bold">Web Development</h4>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    HTML Structure, CSS Styling, Box Model, Flexbox, and JavaScript interaction challenges.
                  </p>
                </div>
                <Link
                  href="/labs/web"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                >
                  Enter Web Lab
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Python Path Card */}
              <div className="group rounded-2xl border border-border/50 bg-card p-6 flex flex-col justify-between hover:border-border hover:shadow-[0_0_15px_rgba(99,102,241,0.03)] transition-all">
                <div>
                  <h4 className="text-lg font-bold">Python Programming</h4>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Logic, functions, variables, list filters, classes, and browser-based Pyodide exceptions.
                  </p>
                </div>
                <Link
                  href="/labs/python"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  Enter Python Lab
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Coding Time Graph (Placeholder for MVP) */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" />
                Weekly Activity (Mock)
              </h3>
              <span className="text-xs text-muted-foreground font-semibold">Updated in real-time</span>
            </div>

            {/* Custom SVG line-bar graph */}
            <div className="h-48 w-full flex items-end gap-3 pt-6 border-b border-border/30">
              {[25, 45, 15, 60, 80, 50, 95].map((val, idx) => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="text-[10px] font-bold text-muted-foreground">{val}m</div>
                    <div className="w-full bg-muted/65 rounded-t-lg overflow-hidden h-[80%] relative">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                        className="w-full bg-gradient-to-t from-indigo-600 to-amber-500 absolute bottom-0 rounded-t-lg"
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{days[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Achievements & Recent Activity */}
        <div className="space-y-8">
          {/* Achievements Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Achievements
            </h3>

            <div className="space-y-3">
              {allAchievements.map((ach) => {
                const Icon = iconMap[ach.icon] || Trophy;
                const userXp = progress?.xp || 0;
                const unlocked = userXp >= ach.xpRequired;

                return (
                  <div
                    key={ach._id}
                    className={`flex items-center gap-4 rounded-xl border p-3.5 transition-all ${
                      unlocked
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-border/50 bg-card'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        unlocked
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5 text-muted-foreground/60" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{ach.title}</h4>
                      <p className="text-xs text-muted-foreground leading-normal mt-0.5">{ach.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {unlocked ? (
                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Unlocked</span>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          {ach.xpRequired} XP
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity (XP Logs) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              XP Transaction History
            </h3>

            {xpLogs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No activity recorded yet. Start solving challenges to earn XP!
              </div>
            ) : (
              <div className="relative border-l border-border/50 ml-3.5 pl-5 space-y-4">
                {xpLogs.map((log) => (
                  <div key={log._id} className="relative">
                    {/* Circle timeline indicator */}
                    <div className="absolute -left-[27.5px] top-1.5 h-3.5 w-3.5 rounded-full border border-amber-500 bg-background flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-sm font-bold text-foreground">{log.reason}</p>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(log.createdAt).toLocaleDateString()} at{' '}
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-amber-500">+{log.amount} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6 mx-4 transform scale-100 transition-all">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                {confirmModal.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {confirmModal.message}
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-border hover:bg-muted/40 transition-colors text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  confirmModal.onConfirm();
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-destructive hover:bg-destructive/90 text-white transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
