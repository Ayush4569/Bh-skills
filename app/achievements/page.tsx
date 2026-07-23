'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flag, Shield, Compass, Zap, Flame, Award, Lock, CheckCircle2 } from 'lucide-react';
import { useProgress } from '@/components/progress-provider';
import { LoadingScreen } from '@/components/loader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, React.ComponentType<any>> = {
  Flag: Flag,
  Shield: Shield,
  Compass: Compass,
  Zap: Zap,
  Flame: Flame,
  Award: Award,
};

export default function AchievementsPage() {
  const { progress, allAchievements, loading } = useProgress();

  if (loading) {
    return <LoadingScreen message="Loading achievements..." />;
  }

  const userXp = progress ? progress.xp : 0;
  const unlockedCount = allAchievements.filter((ach) => userXp >= ach.xpRequired).length;
  const percentComplete = allAchievements.length
    ? Math.round((unlockedCount / allAchievements.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-5xl w-full px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center justify-center gap-2.5">
          <Trophy className="h-9 w-9 text-amber-500 fill-amber-500/10 animate-bounce" />
          Developer Achievements
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Earn XP by passing challenge behavioral checks and unlock these prestige achievements. Master Web development and Python to secure the ultimate Brainheaters Wizard badge.
        </p>

        {/* Progress summary bar */}
        <Card className="p-5 mt-6 text-left max-w-xl mx-auto space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-muted-foreground">Prestige Progress</span>
            <span className="text-foreground">
              {unlockedCount} of {allAchievements.length} Unlocked ({percentComplete}%)
            </span>
          </div>
          <div className="h-3 w-full bg-muted/65 rounded-full overflow-hidden border border-border/10">
            <div
              style={{ width: `${percentComplete}%` }}
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-full transition-all duration-800"
            />
          </div>
        </Card>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {allAchievements.map((ach, idx) => {
          const Icon = iconMap[ach.icon] || Trophy;
          const unlocked = userXp >= ach.xpRequired;

          return (
            <motion.div
              key={ach._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card
                className={`group h-full p-6 flex flex-col justify-between transition-all ${
                  unlocked
                    ? 'border-emerald-500/40 bg-card shadow-[0_0_20px_rgba(16,185,129,0.08)] hover:border-emerald-500/60'
                    : 'border-border/60 bg-card hover:border-border'
                }`}
              >
                <div className="space-y-4">
                  {/* Badge Icon circle */}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform group-hover:scale-105 ${
                      unlocked
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-muted/40 border-border/40 text-muted-foreground/50'
                    }`}
                  >
                    {unlocked ? (
                      <Icon className="h-7 w-7" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground/45" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <CardTitle className="text-lg font-bold flex items-center gap-1.5 text-foreground">
                      {ach.title}
                      {unlocked && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                      {ach.description}
                    </CardDescription>
                  </div>
                </div>

                {/* Requirement badge */}
                <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Milestone</span>
                  {unlocked ? (
                    <Badge variant="success" className="text-[10px] font-bold uppercase">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-bold uppercase text-muted-foreground">
                      {ach.xpRequired} XP required
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
