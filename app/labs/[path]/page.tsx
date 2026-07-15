'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Play,
  Lock,
  ChevronRight,
  Sparkles,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { useProgress } from '@/components/progress-provider';

interface Challenge {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'miniproject';
  language: string;
  xp: number;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  challenges: Challenge[];
}

interface CourseData {
  course: {
    title: string;
    description: string;
    slug: string;
  };
  modules: Module[];
}

export default function PathLabs({ params }: { params: Promise<{ path: string }> }) {
  // Await params using React.use() in Next.js 15/16
  const { path } = use(params);

  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();

  useEffect(() => {
    fetch(`/api/labs/courses/${path}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.course) {
          setData(resData);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [path]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="mt-4 text-sm text-muted-foreground">Loading path modules...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold">Path not found</h2>
        <Link href="/labs" className="mt-4 text-sm text-amber-500 hover:underline">
          Back to paths
        </Link>
      </div>
    );
  }

  const { course, modules } = data;
  const isWeb = course.slug === 'web';
  const themeColorClass = isWeb ? 'text-amber-500 border-amber-500/20' : 'text-indigo-500 border-indigo-500/20';
  const themeBgClass = isWeb ? 'bg-amber-500/10' : 'bg-indigo-500/10';

  return (
    <div className="mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to paths
        </Link>
      </div>

      {/* Path Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <span className={`inline-flex items-center justify-center rounded-xl p-2.5 ${themeBgClass} ${themeColorClass} border`}>
            <Trophy className="h-7 w-7" />
          </span>
          {course.title} Path
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Modules listing */}
      <div className="space-y-10 pt-4">
        {modules.map((mod, modIdx) => (
          <div key={mod._id} className="space-y-5">
            {/* Module header */}
            <div className="border-b border-border/40 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Module {modIdx + 1}
              </span>
              <h2 className="text-xl font-extrabold text-foreground mt-0.5">{mod.title}</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">{mod.description}</p>
            </div>

            {/* Challenges list */}
            <div className="grid grid-cols-1 gap-4">
              {mod.challenges.map((chal) => {
                const isCompleted = progress?.completedChallenges?.some((id) => id === chal._id) || false;
                const isUnlocked = progress?.unlockedChallenges?.some((id) => id === chal._id) || false;
                const isLocked = !isCompleted && !isUnlocked;
                
                // We highlight the first unlocked but incomplete challenge as "Next Up"
                const isNextUp = isUnlocked && !isCompleted;

                const difficultyColor = {
                  easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                  hard: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
                  miniproject: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                }[chal.difficulty];

                return (
                  <div
                    key={chal._id}
                    className={`relative flex items-center justify-between rounded-xl border p-4 transition-all ${
                      isCompleted
                        ? 'border-emerald-500/15 bg-emerald-500/5 hover:border-emerald-500/30'
                        : isNextUp
                        ? isWeb
                          ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                          : 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                        : isLocked
                        ? 'border-border/30 bg-muted/10 opacity-60'
                        : 'border-border/50 bg-card hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Status indicator icon */}
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                        ) : isLocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground/60" />
                        ) : (
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${isWeb ? 'border-amber-500 text-amber-500' : 'border-indigo-500 text-indigo-500'}`}>
                            <div className={`h-2 w-2 rounded-full ${isWeb ? 'bg-amber-500' : 'bg-indigo-500'} animate-ping`} />
                          </span>
                        )}
                      </div>

                      {/* Challenge details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                            {chal.title}
                          </h3>
                          {isNextUp && (
                            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${isWeb ? 'bg-amber-500/15 text-amber-500' : 'bg-indigo-500/15 text-indigo-500'}`}>
                              <Sparkles className="h-2.5 w-2.5 animate-bounce" />
                              Next Up
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 mt-1">
                          <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md ${difficultyColor}`}>
                            {chal.difficulty}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {chal.xp} XP
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            • {chal.language}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div>
                      {isLocked ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/20 text-muted-foreground/50">
                          <Lock className="h-4 w-4" />
                        </div>
                      ) : (
                        <Link
                          href={`/challenge/${chal._id}`}
                          className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-colors ${
                            isCompleted
                              ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : isNextUp
                              ? isWeb
                                ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                                : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700'
                              : 'border-border/60 hover:bg-muted text-foreground'
                          }`}
                        >
                          {isCompleted ? 'Solve Again' : 'Start'}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
