'use client';

import React, { useEffect, useState, use, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
          title: 'CSS Flexbox & Layouts',
          description: 'Master display flex, flex-direction, justify-content, and align-items.',
          moduleOrders: [5]
        },
        {
          title: 'CSS Grid & Positioning',
          description: 'Master grid templates, gap spacing, and absolute/relative positioning.',
          moduleOrders: [6]
        }
      ]
    },
    {
      title: 'JavaScript Interactivity',
      description: 'DOM selection, event handlers, state logic, dynamic renders, and algorithms.',
      badge: 'LOGIC',
      duration: '4-5 Days',
      subtopics: [
        {
          title: 'JavaScript DOM & Events',
          description: 'Master getElementById, querySelector, and addEventListener.',
          moduleOrders: [7]
        },
        {
          title: 'JavaScript Logic & State',
          description: 'Master conditionals, array methods, local state updates, and functions.',
          moduleOrders: [8]
        },
        {
          title: 'JavaScript Async & APIs',
          description: 'Master fetch API, Promises, async/await, and JSON parsing.',
          moduleOrders: [9]
        }
      ]
    }
  ],
  python: [
    {
      title: 'Python Core',
      description: 'Variables, basic IO, control structures, and loops.',
      badge: 'FOUNDATION',
      duration: '2-3 Days',
      subtopics: [
        {
          title: 'Python Basics & Variables',
          description: 'Learn print statements, variable assignment, and basic math.',
          moduleOrders: [1]
        },
        {
          title: 'Control Flow & Conditionals',
          description: 'Master if/elif/else statements and boolean logic.',
          moduleOrders: [2]
        },
        {
          title: 'Loops & Iteration',
          description: 'Master for loops, while loops, range(), and break/continue.',
          moduleOrders: [3]
        }
      ]
    },
    {
      title: 'Data Structures & Functions',
      description: 'Lists, dictionaries, tuples, and modular programming.',
      badge: 'STRUCTURES',
      duration: '3-4 Days',
      subtopics: [
        {
          title: 'Functions & Scope',
          description: 'Define reusable functions, parameters, return values, and scope.',
          moduleOrders: [4]
        },
        {
          title: 'Lists & Strings',
          description: 'Manipulate lists, string formatting, slicing, and methods.',
          moduleOrders: [5]
        },
        {
          title: 'Dictionaries & Sets',
          description: 'Work with key-value pairs, hash maps, and set operations.',
          moduleOrders: [6]
        }
      ]
    }
  ]
};

const FINAL_PROJECT_TITLES = new Set([
  'Build Portfolio Website',
  'Pricing Card',
  'Dashboard',
  'Landing Page',
  'Calculator',
  'Quiz App',
  'Todo App',
  'Weather App',
  'Quiz Game',
  'Password Generator',
  'Student Manager'
]);

export default function CoursePath({ params }: { params: Promise<{ path: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { path } = use(params);
  const { progress } = useProgress();

  const focusedTopic = searchParams.get('topic');

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/labs/courses/${path}`)
      .then((res) => res.json())
      .then((data) => setCourseData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [path]);

  if (loading) {
    return <LoadingScreen message="Loading roadmap details..." />;
  }

  if (!courseData || !courseData.course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-sm font-semibold text-rose-500">Path not found</p>
        <Link href="/labs">
          <Button variant="outline">Back to paths</Button>
        </Link>
      </div>
    );
  }

  const { course, modules } = courseData;
  const isWeb = course.slug === 'web';
  const roadmapConfig = ROADMAP_CONFIGS[course.slug] || [];

  const groupedTopics = roadmapConfig.map((config) => {
    // 1. Map regular subtopics, using DB module titles dynamically so they match /labs 100%
    const subtopics = config.subtopics.map((subConfig) => {
      const matchedModules = modules.filter((m) =>
        subConfig.moduleOrders.includes(m.order)
      );
      matchedModules.sort((a, b) => a.order - b.order);
      const challenges = matchedModules
        .flatMap((m) => m.challenges || [])
        .filter((c) => !FINAL_PROJECT_TITLES.has(c.title));

      const title = matchedModules.length > 0 ? matchedModules[0].title : subConfig.title;
      const description = matchedModules.length > 0 ? matchedModules[0].description : subConfig.description;

      return {
        title,
        description,
        challenges,
      };
    });

    // 2. Collect final projects that belong to this config
    const configModuleOrders = config.subtopics.flatMap(s => s.moduleOrders);
    const configModules = modules.filter(m => configModuleOrders.includes(m.order));
    const configProjects = configModules
      .flatMap(m => m.challenges || [])
      .filter(c => FINAL_PROJECT_TITLES.has(c.title));

    // Sort configProjects in the desired order
    if (course.slug === 'web') {
      const webOrder = [
        'Build Portfolio Website',
        'Pricing Card',
        'Dashboard',
        'Landing Page',
        'Calculator',
        'Quiz App',
        'Todo App',
        'Weather App'
      ];
      configProjects.sort((a, b) => webOrder.indexOf(a.title) - webOrder.indexOf(b.title));
    } else if (course.slug === 'python') {
      const pythonOrder = [
        'Calculator',
        'Quiz Game',
        'Password Generator',
        'Student Manager'
      ];
      configProjects.sort((a, b) => pythonOrder.indexOf(a.title) - pythonOrder.indexOf(b.title));
    }

    // 3. Append the Final Projects subtopic card to this config if there are any projects
    if (configProjects.length > 0) {
      let title = 'Final Projects';
      let desc = '';
      if (config.title === 'HTML Foundation') {
        title = 'Final Project';
        desc = 'Complete the HTML Capstone project to build your personal developer portfolio.';
      } else if (config.title === 'CSS Styling') {
        desc = 'Complete the CSS Capstone projects to build pricing cards, dashboards, and landing page layouts.';
      } else if (config.title === 'JavaScript Interactivity') {
        desc = 'Complete the JavaScript Capstone projects to build interactive calculators, quizzes, todos, and weather widgets.';
      } else if (config.title === 'Python Programming') {
        desc = 'Complete the Python Capstone projects to build terminal calculators, quizzes, generators, and managers.';
      }

      subtopics.push({
        title,
        description: desc,
        challenges: configProjects
      });
    }

    return {
      title: config.title,
      description: config.description,
      badge: config.badge,
      duration: config.duration,
      subtopics,
    };
  });

  const allChallenges = modules.flatMap(m => m.challenges);
  const totalProblems = allChallenges.length;
  const solvedProblems = allChallenges.filter(c => progress?.completedChallenges?.includes(c._id)).length;
  const totalTopics = groupedTopics.flatMap(t => t.subtopics).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl w-full px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        <div className="flex items-center">
          <Link href="/labs">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to paths
            </Button>
          </Link>
        </div>

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

        <div className="relative pt-12 pb-24 max-w-4xl mx-auto space-y-20">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-border/60 z-0" />

          {groupedTopics.map((topic, topicIdx) => (
            <div key={topicIdx} className="space-y-12 relative z-10">
              <div className="relative flex justify-center w-full z-20">
                <Card className="w-full md:max-w-md ml-12 md:ml-0 p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/10 shrink-0">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5  flex-1 text-left">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h2 className="text-base font-extrabold tracking-tight text-foreground leading-snug">
                          {topic.title}
                        </h2>
                        <Badge variant="secondary" className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
                          {topic.badge}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">
                          {topic.duration}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-10 relative">
                {topic.subtopics.map((subtopic, subIdx) => (
                  <SubtopicTimelineCard
                    key={subIdx}
                    subtopic={subtopic}
                    subIdx={subIdx}
                    isWeb={isWeb}
                    progress={progress}
                    focusedTopic={focusedTopic}
                  />
                ))}
              </div>
            </div>
          ))}
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
  focusedTopic,
}: {
  subtopic: SubTopicItem;
  subIdx: number;
  isWeb: boolean;
  progress: any;
  focusedTopic: string | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isRight = subIdx % 2 === 0;

  const cleanSub = subtopic.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanFocused = focusedTopic ? focusedTopic.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  const isFocused =
    Boolean(focusedTopic) &&
    (subtopic.title.toLowerCase().trim() === focusedTopic!.toLowerCase().trim() ||
      subtopic.title.toLowerCase().includes(focusedTopic!.toLowerCase()) ||
      focusedTopic!.toLowerCase().includes(subtopic.title.toLowerCase()) ||
      (cleanSub.length > 3 && cleanFocused.length > 3 && (cleanSub.includes(cleanFocused) || cleanFocused.includes(cleanSub))));

  useEffect(() => {
    if (isFocused) {
      setIsHovered(true);
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isFocused]);

  const subChallenges = subtopic.challenges;
  const totalSub = subChallenges.length;
  const solvedSub = subChallenges.filter((c) => progress?.completedChallenges?.includes(c._id)).length;
  const isSubCompleted = totalSub > 0 && solvedSub === totalSub;

  return (
    <div
      className={`relative flex  items-center w-full min-h-[120px] ${
        isRight ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {/* Horizontal Connector Line */}
      <div
        className={`hidden  md:block absolute top-1/2 -translate-y-1/2 h-0.5 bg-border/60 z-0 ${
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
      <div ref={cardRef} className="w-full md:w-[420px] rounded-md ml-14 md:ml-0">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsHovered(!isHovered)}
          whileHover={{ scale: 1.01 }}
        >
          <Card
            className={`p-4 sm:p-5 transition-all duration-300 relative cursor-pointer ${
              isFocused
                ? isWeb
                  ? 'border-amber-500 ring-4 ring-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                  : 'border-indigo-500 ring-4 ring-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.2)]'
                : isHovered
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
                <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground ml-2 shrink-0">
                  {totalSub} {totalSub === 1 ? 'problem' : 'problems'}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {subtopic.description}
              </p>

              {/* Collapsible Challenges Checklist */}
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

                      const difficultyVariant = {
                        easy: 'success' as const,
                        medium: 'warning' as const,
                        hard: 'destructive' as const,
                        miniproject: 'secondary' as const,
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
                              <Badge variant="outline" className={`gap-0.5 text-[8px] font-extrabold uppercase tracking-wider ${isWeb ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10'}`}>
                                <Sparkles className="h-2 w-2 animate-bounce" />
                                Next Up
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant={difficultyVariant} className="text-[9px] font-extrabold uppercase">
                              {chal.difficulty}
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover/item:text-foreground/60 transition-colors" />
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Blank spacer placeholder on desktop layout */}
      <div className="hidden md:block flex-1" />
    </div>
  );
}

