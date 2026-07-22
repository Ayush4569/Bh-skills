'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Trophy,
  ArrowLeft,
  Check,
  BookOpen,
  Layers,
  Globe,
  Terminal
} from 'lucide-react';
import { useProgress } from '@/components/progress-provider';
import { LoadingScreen } from '@/components/loader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  order: number;
}

interface CourseData {
  course: {
    title: string;
    description: string;
    slug: string;
  };
  modules: Module[];
}

interface SubtopicConfig {
  title: string;
  description: string;
  moduleOrders: number[];
}

interface MainTopicConfig {
  title: string;
  description: string;
  badge: string;
  duration: string;
  subtopics: SubtopicConfig[];
}

const ROADMAP_CONFIGS: Record<string, MainTopicConfig[]> = {
  web: [
    {
      title: 'HTML Foundation',
      description: 'Learn the skeleton of the web: page structure, elements, metadata, and media elements.',
      badge: 'FOUNDATION',
      duration: '2-3 Days',
      subtopics: [
        {
          title: 'HTML Text Elements',
          description: 'Learn headings, paragraphs, and hyperlinks.',
          moduleOrders: [1]
        },
        {
          title: 'HTML Structure & Media',
          description: 'Master text inputs, unordered lists, and images.',
          moduleOrders: [2]
        },
        {
          title: 'HTML Forms & Tables',
          description: 'Implement tables, textareas, radio buttons, and checkboxes.',
          moduleOrders: [3]
        }
      ]
    },
    {
      title: 'CSS Styling',
      description: 'Styling, layout systems, grids, relative/absolute positioning, and animations.',
      badge: 'DESIGN',
      duration: '3-4 Days',
      subtopics: [
        {
          title: 'CSS Basics & Box Model',
          description: 'Understand background colors, dimensions, padding, margins, and Flexbox.',
          moduleOrders: [4]
        },
        {
          title: 'CSS Styling & Typography',
          description: 'Control font sizes, weights, border radius, and text alignment.',
          moduleOrders: [5]
        },
        {
          title: 'CSS Advanced Layouts',
          description: 'Master grid layouts, absolute positioning, hover transitions, and drop shadows.',
          moduleOrders: [6]
        }
      ]
    },
    {
      title: 'JavaScript Interactivity',
      description: 'Add logic, DOM interaction, loops, dynamic rendering, and local storage to build web apps.',
      badge: 'LOGIC',
      duration: '4-5 Days',
      subtopics: [
        {
          title: 'JS DOM & Events',
          description: 'Handle click counters, toggle background colors, and process input greetings.',
          moduleOrders: [7]
        },
        {
          title: 'JS Controls & Logic',
          description: 'Toggle visibility modals, render array items to the DOM, and calculate temperature conversions.',
          moduleOrders: [8]
        },
        {
          title: 'JS Advanced Browser APIs',
          description: 'Manage class name toggling, intervals, list filters, and localStorage.',
          moduleOrders: [9]
        }
      ]
    }
  ],
  python: [
    {
      title: 'Python Programming',
      description: 'Master Python core syntax, data structures, conditional control flow, loops, and Object-Oriented programming.',
      badge: 'CORE LANGUAGE',
      duration: '1-2 Weeks',
      subtopics: [
        {
          title: 'Python Fundamentals',
          description: 'Get started with print statements, variables, basic arithmetic, conditionals, loops, and string slicing.',
          moduleOrders: [1, 2]
        },
        {
          title: 'Functions & Data Structures',
          description: 'Master custom functions, vowel counting, recursion, lists, dictionaries, sets, and word frequencies.',
          moduleOrders: [3, 4]
        },
        {
          title: 'OOP & Algorithms',
          description: 'Create classes with constructors, handle divide errors, inherit classes, and validate IP addresses.',
          moduleOrders: [5, 6]
        }
      ]
    }
  ]
};

export default function PathLabs({ params }: { params: Promise<{ path: string }> }) {
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
    return <LoadingScreen message="Loading roadmap modules..." />;
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <h2 className="text-xl font-bold">Path not found</h2>
        <Link href="/labs" className="mt-4 text-sm text-indigo-600 hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to paths
        </Link>
      </div>
    );
  }

  const { course, modules } = data;
  const isWeb = course.slug === 'web';

  const configs = ROADMAP_CONFIGS[course.slug] || [];

  // Group fetched database modules into the configuration topics
  const groupedTopics = configs.map((config) => {
    const subtopics = config.subtopics.map((subConfig) => {
      const matchedModules = modules.filter((m) =>
        subConfig.moduleOrders.includes(m.order)
      );
      matchedModules.sort((a, b) => a.order - b.order);
      const challenges = matchedModules.flatMap((m) => m.challenges || []);

      return {
        title: subConfig.title,
        description: subConfig.description,
        challenges,
      };
    });

    return {
      title: config.title,
      description: config.description,
      badge: config.badge,
      duration: config.duration,
      subtopics,
    };
  });

  // Calculate stats based on challenges
  const allChallenges = modules.flatMap(m => m.challenges);
  const totalProblems = allChallenges.length;
  const solvedProblems = allChallenges.filter(c => progress?.completedChallenges?.includes(c._id)).length;
  const totalTopics = configs.flatMap(c => c.subtopics).length || modules.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl w-full px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div className="flex items-center">
          <Link
            href="/labs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors border border-border/40 px-2.5 py-1.5 rounded-lg bg-card"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to paths
          </Link>
        </div>

        {/* Path Main Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/10 text-indigo-500 mb-2">
            <Trophy className="h-8 w-8" />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            {course.title} Roadmap
          </h1>
          
          <p className="text-base text-muted-foreground leading-relaxed">
            {course.description}
          </p>

          {/* Stats Capsule */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-full border border-border bg-card px-8 py-3 text-xs sm:text-sm font-bold shadow-sm text-muted-foreground divide-x divide-border">
              <div className="flex items-center gap-2 text-foreground/80">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>{totalProblems} problems</span>
              </div>
              <div className="flex items-center gap-2 pl-4 text-foreground/80">
                <Layers className="h-4 w-4 text-indigo-500" />
                <span>{totalTopics} topics</span>
              </div>
              <div className="flex items-center gap-2 pl-4 text-emerald-600 dark:text-emerald-400 font-extrabold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{solvedProblems} / {totalProblems} solved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Roadmap */}
        <div className="relative pt-12 pb-24 max-w-4xl mx-auto space-y-20">
          {/* Main vertical timeline line - sits at z-0 */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-border/60 z-0" />

          {groupedTopics.map((topic, topicIdx) => {
            return (
              <div key={topicIdx} className="space-y-12 relative z-10">
                {/* Main Topic Center Card */}
                <div className="relative flex justify-center w-full z-20">
                  <div className="w-full md:max-w-md ml-12 md:ml-0 bg-card border border-border/80 rounded-3xl p-5 shadow-sm relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
                    {/* Decorative background glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
                    
                    <div className="flex items-start gap-4">
                      {/* Icon Box */}
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/10 shrink-0">
                        {course.slug === 'web' ? (
                          topicIdx === 0 ? <Globe className="h-5 w-5" /> :
                          topicIdx === 1 ? <Layers className="h-5 w-5" /> :
                          <Terminal className="h-5 w-5" />
                        ) : (
                          <Terminal className="h-5 w-5" />
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 text-left">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h2 className="text-base font-extrabold tracking-tight text-foreground leading-snug">
                            {topic.title}
                          </h2>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                            {topic.badge}
                          </span>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40">
                            {topic.duration}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtopics of this Main Topic */}
                <div className="space-y-10 relative">
                  {topic.subtopics.map((subtopic, subIdx) => (
                    <SubtopicTimelineCard
                      key={subIdx}
                      subtopic={subtopic}
                      subIdx={subIdx}
                      isWeb={isWeb}
                      progress={progress}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SubTopicItem {
  title: string;
  description: string;
  challenges: Challenge[];
}

function SubtopicTimelineCard({
  subtopic,
  subIdx,
  isWeb,
  progress,
}: {
  subtopic: SubTopicItem;
  subIdx: number;
  isWeb: boolean;
  progress: any;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isRight = subIdx % 2 === 0;

  // Calculate subtopic completion progress
  const subChallenges = subtopic.challenges;
  const totalSub = subChallenges.length;
  const solvedSub = subChallenges.filter((c) => progress?.completedChallenges?.includes(c._id)).length;
  const isSubCompleted = totalSub > 0 && solvedSub === totalSub;

  return (
    <div
      className={`relative flex items-center w-full min-h-[120px] ${
        isRight ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {/* Horizontal Connector Line */}
      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-0.5 bg-border/60 z-0 ${
          isRight ? 'left-1/2 w-12' : 'right-1/2 w-12'
        }`}
      />
      <div className="block md:hidden absolute left-6 w-8 h-0.5 bg-border/60 top-1/2 -translate-y-1/2 z-0" />

      {/* Interactive Timeline Circle Node */}
      <div
        className={`absolute left-6 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-20 bg-background border transition-all duration-300 ${
          isHovered
            ? isWeb
              ? 'border-amber-500 ring-4 ring-amber-500/20 scale-110 shadow-md'
              : 'border-indigo-600 ring-4 ring-indigo-500/20 scale-110 shadow-md'
            : 'border-border'
        }`}
      >
        {isSubCompleted ? (
          <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white border border-background shadow-sm">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        ) : (
          <div
            className={`h-6 w-6 rounded-full border-2 ${
              isWeb ? 'border-amber-500 bg-amber-500/10' : 'border-indigo-600 bg-indigo-500/10'
            } flex items-center justify-center relative shadow-sm`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isWeb ? 'bg-amber-500' : 'bg-indigo-600'
              } animate-ping absolute`}
            />
            <div
              className={`h-2 w-2 rounded-full ${
                isWeb ? 'bg-amber-500' : 'bg-indigo-600'
              } relative`}
            />
          </div>
        )}
      </div>

      {/* Subtopic Card wrapper */}
      <div className="w-full md:w-[420px] ml-14 md:ml-0">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsHovered(!isHovered)}
          whileHover={{ scale: 1.01 }}
          className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 relative bg-card shadow-sm cursor-pointer ${
            isHovered
              ? isWeb
                ? 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                : 'border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.08)]'
              : 'border-border/80'
          }`}
        >
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold text-foreground leading-snug">
                {subtopic.title}
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/40 ml-2 shrink-0">
                {totalSub} {totalSub === 1 ? 'problem' : 'problems'}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {subtopic.description}
            </p>

            {/* Collapsible Challenges Checklist - hidden by default, visible when hovered/clicked (Image 4) */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="mt-4 pt-4 border-t border-border/40 space-y-2 overflow-hidden"
                >
                  {subtopic.challenges.map((chal) => {
                    const isCompleted = progress?.completedChallenges?.includes(chal._id) || false;
                    const isUnlocked = progress?.unlockedChallenges?.includes(chal._id) || false;
                    const isNextUp = isUnlocked && !isCompleted;

                    const difficultyBadgeColor = {
                      easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15',
                      medium: 'bg-amber-500/10 text-amber-500 border-amber-500/15',
                      hard: 'bg-rose-500/10 text-rose-500 border-rose-500/15',
                      miniproject: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/15',
                    }[chal.difficulty];

                    return (
                      <Link
                        key={chal._id}
                        href={`/challenge/${chal._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group/item ${
                          isCompleted
                            ? 'border-emerald-500/10 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03]'
                            : isNextUp
                            ? isWeb
                              ? 'border-amber-500/30 bg-amber-500/[0.01] hover:border-amber-500 hover:bg-amber-500/[0.03]'
                              : 'border-indigo-500/30 bg-indigo-500/[0.01] hover:border-indigo-500 hover:bg-indigo-500/[0.03]'
                            : 'border-border/60 hover:border-border hover:bg-muted/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm shrink-0">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div
                              className={`h-5 w-5 rounded-full border-2 ${
                                isWeb
                                  ? 'border-amber-500/60 group-hover/item:border-amber-500'
                                  : 'border-indigo-500/60 group-hover/item:border-indigo-500'
                              } bg-transparent shrink-0`}
                            />
                          )}

                          <span className="text-sm font-bold text-foreground/90 group-hover/item:text-foreground transition-colors">
                            {chal.title}
                          </span>

                          {isNextUp && (
                            <span
                              className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${
                                isWeb
                                  ? 'bg-amber-500/15 text-amber-500 border border-amber-500/15'
                                  : 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/15'
                              }`}
                            >
                              <Sparkles className="h-2 w-2 animate-bounce" />
                              Next Up
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-extrabold uppercase border px-2 py-0.5 rounded-md ${difficultyBadgeColor}`}
                          >
                            {chal.difficulty}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover/item:text-foreground/60 transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Blank spacer placeholder on desktop layout */}
      <div className="hidden md:block flex-1" />
    </div>
  );
}

