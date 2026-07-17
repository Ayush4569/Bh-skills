'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Globe, 
  ArrowRight, 
  Plus, 
  LayoutGrid, 
  Map, 
  Layers,
  Lock
} from 'lucide-react';
import { useProgress } from '@/components/progress-provider';
import { LoadingScreen } from '@/components/loader';

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
  order: number;
  challenges: Challenge[];
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  modules?: Module[];
}

export default function LabsSelection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'topics' | 'guided'>('topics');
  
  const { progress } = useProgress();

  useEffect(() => {
    fetch('/api/labs/courses')
      .then((res) => res.json())
      .then(async (coursesData: Course[]) => {
        if (Array.isArray(coursesData)) {
          const detailedCourses = await Promise.all(
            coursesData.map(async (course) => {
              try {
                const res = await fetch(`/api/labs/courses/${course.slug}`);
                const data = await res.json();
                return {
                  ...course,
                  modules: data.modules || [],
                };
              } catch (e) {
                console.error(`Failed to fetch details for course ${course.slug}:`, e);
                return { ...course, modules: [] };
              }
            })
          );
          setCourses(detailedCourses);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading guided paths & topics..." />;
  }

  // Get statistics for a course
  const getCourseStats = (course: Course) => {
    const challenges = course.modules?.flatMap(m => m.challenges) || [];
    const total = challenges.length;
    const solved = challenges.filter(c => progress?.completedChallenges?.includes(c._id)).length;
    return { total, solved };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span>Brainheaters</span>
          <span>&rsaquo;</span>
          <span className="text-foreground">DSA & Coding</span>
        </div>

        {/* Dynamic Title / Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">Topic Library</h1>
            <p className="text-base text-muted-foreground max-w-2xl">
              {activeTab === 'topics' 
                ? 'Master programming and web development topics step-by-step.' 
                : 'Choose a curated path to master coding concepts at your own speed with real-time feedback.'}
            </p>
          </div>

          {/* Switcher Control */}
          <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/40 self-start md:self-auto shadow-sm">
            <button
              onClick={() => setActiveTab('topics')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'topics'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Topics
            </button>
            <button
              onClick={() => setActiveTab('guided')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'guided'
                  ? 'bg-card text-foreground shadow shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              Guided Path
            </button>
          </div>
        </div>

        {/* Tab Content Rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'topics' ? (
            <motion.div
              key="topics-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl pt-4"
            >
              {courses.map((course) => {
                const Icon = course.slug === 'web' ? Globe : Terminal;
                const isWeb = course.slug === 'web';
                const stats = getCourseStats(course);
                const percentSolved = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;

                return (
                  <Link
                    key={course._id}
                    href={`/labs/${course.slug}`}
                    className="group relative flex flex-col justify-between p-8 rounded-2xl border border-border/50 bg-card hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.05)] transition-all duration-300 min-h-[220px]"
                  >
                    <div className="space-y-4">
                      <div className={`p-3 rounded-xl inline-block ${
                        isWeb 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' 
                          : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/10'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold group-hover:text-indigo-500 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    {/* Problem Counter & Progress Bar */}
                    <div className="mt-8 pt-5 border-t border-border/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                        <span>{stats.total} challenges</span>
                        <span>{stats.solved} / {stats.total} solved</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWeb ? 'bg-amber-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${percentSolved}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="guided-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              {/* Guided Paths Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                {courses.map((course) => {
                  const Icon = course.slug === 'web' ? Globe : Terminal;
                  const isWeb = course.slug === 'web';
                  const stats = getCourseStats(course);
                  const isStarted = stats.solved > 0;
                  const isCompleted = stats.total > 0 && stats.solved === stats.total;

                  return (
                    <div
                      key={course._id}
                      className="group relative rounded-2xl border border-border/50 bg-card p-8 flex flex-col justify-between hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.06)] transition-all duration-300"
                    >
                      <div className="space-y-5">
                        <div className="flex justify-between items-center">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                            isWeb 
                              ? 'bg-amber-500/10 border-amber-500/10 text-amber-500' 
                              : 'bg-indigo-500/10 border-indigo-500/10 text-indigo-500'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>

                          <div className="flex gap-2">
                            <span className="text-[10px] font-extrabold uppercase bg-muted/40 text-muted-foreground border px-2 py-0.5 rounded-md">
                              {isWeb ? '1-2 Weeks' : '2-3 Weeks'}
                            </span>
                            <span className="text-[10px] font-extrabold uppercase bg-muted/40 text-muted-foreground border px-2 py-0.5 rounded-md">
                              {stats.total} Problems
                            </span>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-2xl font-extrabold text-foreground tracking-tight group-hover:text-indigo-500 transition-colors">
                            {course.title} Roadmap
                          </h2>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                            {course.description}
                          </p>
                        </div>
                      </div>

                      {/* Launch Path Bar */}
                      <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
                        <div className="text-xs font-bold text-muted-foreground">
                          {isCompleted 
                            ? '🎉 Fully Completed!' 
                            : isStarted 
                            ? `In Progress • ${stats.solved}/${stats.total} Solved`
                            : 'Not Started yet'}
                        </div>
                        
                        <Link
                          href={`/labs/${course.slug}`}
                          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] ${
                            isWeb ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                        >
                          {isCompleted ? 'Review Path' : isStarted ? 'Continue Coding' : 'Start Path'}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
