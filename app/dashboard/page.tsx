'use client';

import React, { useState, useEffect } from 'react';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  const [customPaths, setCustomPaths] = useState<any[]>([]);
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

  useEffect(() => {
    fetch('/api/labs/custom-path')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomPaths(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Level boundary calculations
  // Level threshold is 150 XP per level
  const xpInCurrentLevel = progress ? progress.xp % 150 : 0;
  const levelProgressPercent = Math.min((xpInCurrentLevel / 150) * 100, 100);
  const xpNeededForNextLevel = 150 - xpInCurrentLevel;

  // Compute real-time weekly activity from xpLogs
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const currentDayIdx = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  const monday = new Date(now);
  monday.setDate(now.getDate() - currentDayIdx);
  monday.setHours(0, 0, 0, 0);

  const weekStats = days.map((dayName, idx) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + idx);

    const startOfDay = new Date(dayDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dayDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dayLogs = (xpLogs || []).filter((log) => {
      const logDate = new Date(log.createdAt);
      return logDate >= startOfDay && logDate <= endOfDay;
    });

    const count = dayLogs.length;
    const xp = dayLogs.reduce((sum, l) => sum + (l.amount || 0), 0);

    return {
      day: dayName,
      count,
      xp,
      isToday: idx === currentDayIdx,
    };
  });

  const maxCount = Math.max(...weekStats.map((w) => w.count), 1);
  const activeDaysCount = weekStats.filter((w) => w.count > 0).length;

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
        <Button
          variant="destructive"
          size="sm"
          onClick={handleResetProgress}
          disabled={resetting}
          className="gap-2 font-bold"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {resetting ? 'Resetting...' : 'Reset Progress'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP & Level Progress */}
        <Card className="col-span-1 md:col-span-2 p-6 flex flex-col justify-between border-border/60 bg-card">
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
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 flex flex-col justify-between border-border/60 bg-card">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Challenges Completed</span>
            <span className="text-3xl font-extrabold text-foreground mt-2">
              {progress?.completedChallenges?.length || 0}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1">unlocked the next step</span>
          </Card>
          <Card className="p-5 flex flex-col justify-between border-border/60 bg-card">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Submissions</span>
            <span className="text-3xl font-extrabold text-foreground mt-2">{attemptsCount}</span>
            <span className="text-[10px] text-muted-foreground mt-1">all run attempts logged</span>
          </Card>
        </div>
      </div>

      {/* Main Grid: Paths & Timeline / Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Learning Paths + Coding Time */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Tracks */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Active Learning Paths
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web Path Card */}
              <Card className="group p-6 flex flex-col justify-between border-border/60 bg-card hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.03)] transition-all">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Web Development</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    HTML Structure, CSS Styling, Box Model, Flexbox, and JavaScript interaction challenges.
                  </CardDescription>
                </div>
                <Link
                  href="/labs/web"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                >
                  Enter Web Lab
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>

              {/* Python Path Card */}
              <Card className="group p-6 flex flex-col justify-between border-border/60 bg-card hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.03)] transition-all">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Python Programming</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Logic, functions, variables, list filters, classes, and browser-based Pyodide exceptions.
                  </CardDescription>
                </div>
                <Link
                  href="/labs/python"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  Enter Python Lab
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>

              {/* Custom Paths Cards */}
              {customPaths.map((cPath) => {
                const total = cPath.challengeIds?.length || 0;
                const solved = cPath.challengeIds?.filter((c: any) => progress?.completedChallenges?.includes(c._id)).length || 0;

                return (
                  <Card key={cPath._id} className="group p-6 flex flex-col justify-between border-indigo-500/30 bg-card hover:border-indigo-500/60 hover:shadow-[0_0_15px_rgba(99,102,241,0.04)] transition-all">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <CardTitle className="text-lg font-bold text-foreground truncate">{cPath.title}</CardTitle>
                        <Badge variant="outline" className="text-[9px] font-bold text-indigo-500 border-indigo-500/30 bg-indigo-500/10">
                          Custom Path
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                        {total} challenges ({solved} solved) • {cPath.difficultyProfile} difficulty profile.
                      </CardDescription>
                    </div>
                    <Link
                      href={`/labs/custom/${cPath._id}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      Launch Custom Roadmap
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Real-time Coding Activity Graph */}
          <Card className="p-6 space-y-4 border-border/60 bg-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Activity className="h-5 w-5 text-indigo-500" />
                  Weekly Activity
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time problem solving activity for the current week
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-bold gap-1 text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeDaysCount} / 7 Days Active
                </Badge>
              </div>
            </div>

            {/* Real-time bar graph */}
            <div className="h-48 w-full flex items-end gap-3 pt-6 border-b border-border/30">
              {weekStats.map((val, idx) => {
                const heightPercent = val.count > 0 ? Math.max((val.count / maxCount) * 100, 15) : 4;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="text-[10px] font-bold text-muted-foreground">
                      {val.count > 0 ? `${val.count} solved` : '-'}
                    </div>
                    <div className="w-full bg-muted/40 rounded-t-lg overflow-hidden h-[80%] relative flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        className={`w-full absolute bottom-0 rounded-t-lg transition-colors ${
                          val.isToday
                            ? 'bg-gradient-to-t from-indigo-600 to-amber-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                            : val.count > 0
                            ? 'bg-gradient-to-t from-indigo-700/80 to-indigo-500/80'
                            : 'bg-muted-foreground/20'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-bold ${val.isToday ? 'text-indigo-400' : 'text-muted-foreground'}`}>
                      {val.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Achievements & Recent Activity */}
        <div className="space-y-8">
          {/* Achievements Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
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
                        ? 'border-emerald-500/40 bg-card shadow-[0_0_15px_rgba(16,185,129,0.06)]'
                        : 'border-border/60 bg-card'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                        unlocked
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-muted/40 border-border/40 text-muted-foreground/60'
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
                        <Badge variant="success" className="text-[10px] font-bold uppercase">Unlocked</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-bold uppercase text-muted-foreground">
                          {ach.xpRequired} XP
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity (XP Logs) */}
          <Card className="p-5 space-y-4 border-border/60 bg-card">
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                <Activity className="h-4.5 w-4.5 text-amber-500" />
                XP Transaction History
              </h3>
              <Badge variant="outline" className="text-[10px] font-bold uppercase text-muted-foreground">
                {xpLogs.length} {xpLogs.length === 1 ? 'record' : 'records'}
              </Badge>
            </div>

            {xpLogs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
                No activity recorded yet. Start solving challenges to earn XP!
              </div>
            ) : (
              <div className="max-h-[340px] overflow-y-auto pr-1 space-y-2.5">
                {xpLogs.map((log) => {
                  const isSkipped = log.reason.toLowerCase().includes('skipped');
                  return (
                    <div
                      key={log._id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            isSkipped
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-500'
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {isSkipped ? <Zap className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate">{log.reason}</p>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(log.createdAt).toLocaleDateString()} at{' '}
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={log.amount > 0 ? 'success' : 'outline'}
                        className="text-[10px] font-bold shrink-0 ml-2"
                      >
                        +{log.amount} XP
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog (Shadcn UI) */}
      <Dialog open={confirmModal.isOpen} onOpenChange={(open) => setConfirmModal((prev) => ({ ...prev, isOpen: open }))}>
        <DialogContent showCloseButton className="max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmModal.title}</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              {confirmModal.message}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                confirmModal.onConfirm();
              }}
            >
              Yes, Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
