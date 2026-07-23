'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Globe,
  ArrowRight,
  Plus,
  LayoutGrid,
  Map,
  BookOpen,
  Layers,
  Zap,
  Check,
  X,
  Sparkles,
  Sliders,
  Type,
  Search,
  ArrowUpDown,
  Link as LinkIcon,
  Hash,
  Share2
} from 'lucide-react';
import { useProgress } from '@/components/progress-provider';
import { LoadingScreen } from '@/components/loader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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

interface TopicCardItem {
  id: string;
  title: string;
  category: 'Foundation' | 'Intermediate' | 'Advanced';
  difficulty: 'easy' | 'medium' | 'hard';
  courseSlug: string;
  moduleId: string;
  totalProblems: number;
  solvedProblems: number;
  icon: React.ComponentType<any>;
}

export default function LabsSelection() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'topics' | 'guided'>('topics');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Foundation' | 'Intermediate' | 'Advanced'>('All');

  // Custom Path Modal State
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customPathName, setCustomPathName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [problemCount, setProblemCount] = useState(40);
  const [difficultyProfile, setDifficultyProfile] = useState<'Beginner' | 'Balanced' | 'Challenge'>('Balanced');
  const [generating, setGenerating] = useState(false);

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
    return <LoadingScreen message="Loading topic library & paths..." />;
  }

  // Get statistics for a course
  const getCourseStats = (course: Course) => {
    const challenges = course.modules?.flatMap(m => m.challenges) || [];
    const total = challenges.length;
    const solved = challenges.filter(c => progress?.completedChallenges?.includes(c._id)).length;
    return { total, solved };
  };

  // Convert all course modules into individual Topic Cards for the Topics Grid
  const getTopicCards = (): TopicCardItem[] => {
    const iconList = [Type, Globe, Search, ArrowUpDown, LinkIcon, Layers, Hash, Share2, Zap, Terminal];
    const cards: TopicCardItem[] = [];

    courses.forEach((course) => {
      course.modules?.forEach((mod, idx) => {
        const challenges = mod.challenges || [];
        const totalProblems = challenges.length;
        const solvedProblems = challenges.filter(c => progress?.completedChallenges?.includes(c._id)).length;

        // Assign category & difficulty based on module order
        let category: 'Foundation' | 'Intermediate' | 'Advanced' = 'Foundation';
        if (mod.order >= 4 && mod.order <= 6) category = 'Intermediate';
        if (mod.order >= 7) category = 'Advanced';

        let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
        if (category === 'Intermediate') difficulty = 'medium';
        if (category === 'Advanced') difficulty = 'hard';

        cards.push({
          id: mod._id,
          title: mod.title,
          category,
          difficulty,
          courseSlug: course.slug,
          moduleId: mod._id,
          totalProblems: totalProblems || 3,
          solvedProblems,
          icon: iconList[idx % iconList.length],
        });
      });
    });

    return cards;
  };

  const allTopicCards = getTopicCards();
  const filteredTopicCards = categoryFilter === 'All'
    ? allTopicCards
    : allTopicCards.filter(c => c.category === categoryFilter);

  // Available topics for custom path selector
  const availableTopicNames = Array.from(new Set(allTopicCards.map(c => c.title)));

  const handleSelectAllTopics = () => {
    setSelectedTopics([...availableTopicNames]);
  };

  const handleClearTopics = () => {
    setSelectedTopics([]);
  };

  const toggleTopicSelection = (topicName: string) => {
    if (selectedTopics.includes(topicName)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topicName));
    } else {
      setSelectedTopics([...selectedTopics, topicName]);
    }
  };

  const handleGenerateCustomPath = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setCustomModalOpen(false);
      // Navigate to the first matching course path or default web path
      const webCourse = courses.find(c => c.slug === 'web') || courses[0];
      if (webCourse) {
        router.push(`/labs/${webCourse.slug}`);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 space-y-10">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span>Brainheaters</span>
          <span>&rsaquo;</span>
          <span className="text-foreground">Skills </span>
        </div>

        {/* Dynamic Title / Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/30 pb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Topic Library</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Master programming and web development topics step-by-step.
            </p>
          </div>

          {/* Switcher Control Capsule */}
          <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/40 self-start md:self-auto shadow-sm gap-1">
            <Button
              size="sm"
              onClick={() => setActiveTab("topics")}
              className={`gap-2 text-xs font-bold border transition-colors ${activeTab === "topics"
                ? "bg-[#522BFF] text-white border-[#522BFF] hover:bg-[#522BFF]"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Topics
            </Button>

            <Button
              size="sm"
              onClick={() => setActiveTab("guided")}
              className={`gap-2 text-xs font-bold border transition-colors ${activeTab === "guided"
                ? "bg-[#522BFF] text-white border-[#522BFF] hover:bg-[#522BFF]"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
            >
              <Map className="h-3.5 w-3.5" />
              Guided Path
            </Button>
          </div>
        </div>

        {/* Tab Content Rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'topics' ? (
            <motion.div
              key="topics-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Category Filter Pills (Image 1) */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setCategoryFilter("All")}
                  className={`rounded-xl text-xs font-bold border transition-colors ${categoryFilter === "All"
                    ? "bg-[#522BFF] text-white border-[#522BFF] hover:bg-[#522BFF]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1" />
                  All
                </Button>

                <Button
                  size="sm"
                  onClick={() => setCategoryFilter("Foundation")}
                  className={`rounded-xl text-xs font-bold border transition-colors ${categoryFilter === "Foundation"
                    ? "bg-[#522BFF] text-white border-[#522BFF] hover:bg-[#522BFF]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  <BookOpen className="h-3.5 w-3.5 mr-1" />
                  Foundation
                </Button>

                <Button
                  size="sm"
                  onClick={() => setCategoryFilter("Intermediate")}
                  className={`rounded-xl text-xs font-bold border transition-colors ${categoryFilter === "Intermediate"
                    ? "bg-[#522BFF] text-white border-[#522BFF] hover:bg-[#522BFF]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  <Layers className="h-3.5 w-3.5 mr-1" />
                  Intermediate
                </Button>

                <Button
                  size="sm"
                  onClick={() => setCategoryFilter("Advanced")}
                  className={`rounded-xl text-xs font-bold border transition-colors ${categoryFilter === "Advanced"
                    ? "bg-[#522BFF] text-white border-[#522BFF] hover:bg-[#522BFF]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Advanced
                </Button>
              </div>

              {/* Section Header Label */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  ALL TOPICS
                </span>
              </div>

              {/* Grid of Topic Cards (4 cards per row on large screens as per Image 1) */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredTopicCards.map((topic) => {
                  const TopicIcon = topic.icon;
                  const percentSolved = topic.totalProblems > 0 ? (topic.solvedProblems / topic.totalProblems) * 100 : 0;

                  const difficultyBadgeVariant = {
                    easy: 'success' as const,
                    medium: 'warning' as const,
                    hard: 'destructive' as const,
                  }[topic.difficulty];

                  return (
                    <Link
                      key={topic.id}
                      href={`/labs/${topic.courseSlug}#module-${topic.moduleId}`}
                      className="group flex"
                    >
                      <Card className="w-full flex flex-col p-4 sm:p-5 minh-[190px] border hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)] transition-all duration-300">
                        <div className="flex-1 space-y-2">
                          {/* Icon */}
                          <div className="inline-flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/10 p-2">
                            <TopicIcon className="h-4 w-4 text-indigo-500" />
                          </div>

                          {/* Title */}
                          <div>
                            <CardTitle className="text-sm sm:text-base font-bold line-clamp-2 group-hover:text-indigo-500 transition-colors">
                              {topic.title}
                            </CardTitle>

                            <CardDescription className="mt-1 text-[11px] sm:text-xs font-medium">
                              {topic.category} • {topic.totalProblems} problems
                            </CardDescription>
                          </div>

                          <Badge
                            variant={difficultyBadgeVariant}
                            className="w-fit text-[10px] uppercase font-bold"
                          >
                            {topic.difficulty}
                          </Badge>
                        </div>

                        <div className="mt-4 border-t border-border/30 pt-3">
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                              style={{ width: `${percentSolved}%` }}
                            />
                          </div>

                          <div className="mt-2 text-right text-[10px] font-bold text-muted-foreground">
                            {topic.solvedProblems} / {topic.totalProblems} solved
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="guided-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-12 max-w-5xl mx-auto"
            >
              {/* Guided Paths Header (Image 2) */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  Guided Paths
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Choose a curated path to master data structures and algorithms at your own pace. Built for clarity and speed.
                </p>
              </div>

              {/* Cards Grid (Image 2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courses.map((course) => {
                  const Icon = course.slug === 'web' ? Globe : Terminal;
                  const isWeb = course.slug === 'web';
                  const stats = getCourseStats(course);
                  const isStarted = stats.solved > 0;
                  const isCompleted = stats.total > 0 && stats.solved === stats.total;

                  return (
                    <Card
                      key={course._id}
                      className="group relative p-8  flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)] transition-all duration-300"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${isWeb
                            ? 'bg-amber-500/10 border-amber-500/10 text-amber-500'
                            : 'bg-indigo-500/10 border-indigo-500/10 text-indigo-500'
                            }`}>
                            <Icon className="h-6 w-6" />
                          </div>

                          <div>
                            <CardTitle className="text-xl font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                              {course.title} Roadmap
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] uppercase font-extrabold">
                                ⏱ {isWeb ? '1-2 Weeks' : '2-3 Weeks'}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] uppercase font-extrabold">
                                ⚡ {stats.total} problems
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <CardDescription className="text-xs text-muted-foreground leading-relaxed pt-2">
                          {course.description}
                        </CardDescription>
                      </div>

                      {/* Launch Path Bar */}
                      <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between">
                        <div className="text-xs font-bold text-muted-foreground">
                          {isCompleted
                            ? '🎉 Fully Completed!'
                            : isStarted
                              ? `In Progress • ${stats.solved}/${stats.total} Solved`
                              : 'Not Started yet'}
                        </div>

                        <Link href={`/labs/${course.slug}`}>
                          <Button
                            variant="default"
                            className={`gap-2 text-xs font-bold text-white transition-all ${isWeb ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                              }`}
                          >
                            {isCompleted ? 'Review Path' : isStarted ? 'Continue Coding' : 'Start Path'}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Create Custom Path Button Card (Dashed Border Card - Image 2) */}
              <div className="flex justify-center">
                <button
                  onClick={() => setCustomModalOpen(true)}
                  className="w-full max-w-xl rounded-2xl border-2 border-dashed border-indigo-500/30 bg-card hover:bg-indigo-500/[0.02] hover:border-indigo-500/60 transition-all p-8 flex flex-col items-center text-center space-y-3 group cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                      Create Custom Path
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pick topics, set difficulty, and build your own roadmap
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Custom Path Modal Popup (Using official Shadcn Dialog) */}
        <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
          <DialogContent showCloseButton className="max-w-lg space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold">Create Custom Path</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Customize your practice scope and difficulty parameters.
              </DialogDescription>
            </DialogHeader>

            {/* Path Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Path name
              </label>
              <input
                type="text"
                value={customPathName}
                onChange={(e) => setCustomPathName(e.target.value.slice(0, 80))}
                placeholder="e.g. My HTML & CSS Sprint"
                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-foreground"
              />
              <div className="text-right text-[10px] text-muted-foreground font-semibold">
                {customPathName.length}/80
              </div>
            </div>

            {/* Topics Selection Pill Tags */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Topics
                </label>
                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                  <Button variant="link" size="xs" onClick={handleSelectAllTopics} className="p-0 h-auto">
                    Select All
                  </Button>
                  <span>•</span>
                  <Button variant="link" size="xs" onClick={handleClearTopics} className="p-0 h-auto">
                    Clear
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableTopicNames.map((topicName) => {
                  const isSelected = selectedTopics.includes(topicName);
                  return (
                    <Badge
                      key={topicName}
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => toggleTopicSelection(topicName)}
                      className="cursor-pointer py-1 px-3 text-xs font-bold transition-all"
                    >
                      {topicName}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Problem Count Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Problem count: {problemCount} problems
                </label>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={10}
                value={problemCount}
                onChange={(e) => setProblemCount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                <span>20 • Quick</span>
                <span>60 • Standard</span>
                <span>100 • Deep Dive</span>
              </div>
            </div>

            {/* Difficulty Profile Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Difficulty profile
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Beginner', 'Balanced', 'Challenge'] as const).map((profile) => {
                  const isSelected = difficultyProfile === profile;
                  const ratios = {
                    Beginner: '60% Easy • 30% Med • 10% Hard',
                    Balanced: '30% Easy • 50% Med • 20% Hard',
                    Challenge: '10% Easy • 40% Med • 50% Hard',
                  }[profile];

                  return (
                    <Card
                      key={profile}
                      onClick={() => setDifficultyProfile(profile)}
                      className={`p-3 text-center space-y-1 transition-all cursor-pointer ${isSelected
                        ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20'
                        : 'border-border bg-card hover:border-border/80'
                        }`}
                    >
                      <h4 className="text-xs font-extrabold text-foreground">{profile}</h4>
                      <p className="text-[9px] text-muted-foreground leading-tight">{ratios}</p>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                <span>Powered by AI • usually takes 5-10 seconds</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  onClick={() => setCustomModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleGenerateCustomPath}
                  disabled={generating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {generating ? 'Generating...' : 'Generate Path'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

