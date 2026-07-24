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
  const [savedCustomPaths, setSavedCustomPaths] = useState<any[]>([]);

  const { progress } = useProgress();

  const fetchCustomPaths = () => {
    fetch('/api/labs/custom-path')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedCustomPaths(data);
        }
      })
      .catch((err) => console.error(err));
  };

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

    fetchCustomPaths();
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
          totalProblems,
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

  const handleGenerateCustomPath = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/labs/custom-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customPathName,
          selectedTopics,
          problemCount,
          difficultyProfile,
        }),
      });

      const data = await res.json();
      if (res.ok && data.customPath?._id) {
        setCustomModalOpen(false);
        fetchCustomPaths();
        router.push(`/labs/custom/${data.customPath._id}`);
      } else {
        alert(data.error || 'Failed to create custom roadmap.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during path generation.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-10">

        {/* Tab Selection Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Practice Labs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Explore topic libraries or follow structured guided paths.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/30 border border-border/40">
            <Button
              variant={activeTab === 'topics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('topics')}
              className={`gap-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'topics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground'
                }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Topic Library
            </Button>
            <Button
              variant={activeTab === 'guided' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('guided')}
              className={`gap-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'guided' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted-foreground'
                }`}
            >
              <Map className="h-4 w-4" />
              Guided Paths
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
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setCategoryFilter("All")}
                  className={`rounded-xl text-xs font-bold border transition-colors ${categoryFilter === "All"
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    : "bg-card text-foreground border-border/60 hover:bg-muted/40"
                    }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1" />
                  All
                </Button>

                <Button
                  size="sm"
                  onClick={() => setCategoryFilter("Foundation")}
                  className={`rounded-xl text-xs font-bold border transition-colors ${categoryFilter === "Foundation"
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    : "bg-card text-foreground border-border/60 hover:bg-muted/40"
                    }`}
                >
                  <BookOpen className="h-3.5 w-3.5 mr-1" />
                  Foundation
                </Button>

                <Button
                  size="sm"
                  onClick={() => setCategoryFilter("Intermediate")}
                  className={`rounded-xl text-xs font-bold border transition-colors ${categoryFilter === "Intermediate"
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    : "bg-card text-foreground border-border/60 hover:bg-muted/40"
                    }`}
                >
                  <Layers className="h-3.5 w-3.5 mr-1" />
                  Intermediate
                </Button>

                <Button
                  size="sm"
                  onClick={() => setCategoryFilter("Advanced")}
                  className={`rounded-xl text-xs font-bold border transition-colors ${categoryFilter === "Advanced"
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    : "bg-card text-foreground border-border/60 hover:bg-muted/40"
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

              {/* Grid of Topic Cards */}
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
                      href={`/labs/${topic.courseSlug}?topic=${encodeURIComponent(topic.title)}`}
                      className="group flex"
                    >
                      <Card className="w-full flex flex-col p-4 sm:p-5 min-h-[190px] border border-border/60 bg-card hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)] transition-all duration-300">
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

                            <Badge variant={difficultyBadgeVariant} className="mt-2 text-[9px] font-bold uppercase">
                              {topic.difficulty}
                            </Badge>
                          </div>
                        </div>

                        {/* Card Footer Info */}
                        <div className="pt-4 mt-2 border-t border-border/30 flex items-center justify-between text-xs font-bold text-muted-foreground">
                          <span>{topic.totalProblems} {topic.totalProblems === 1 ? 'problem' : 'problems'}</span>
                          {percentSolved === 100 ? (
                            <span className="text-emerald-500 flex items-center gap-1">
                              <Check className="h-3.5 w-3.5" /> Solved
                            </span>
                          ) : topic.solvedProblems > 0 ? (
                            <span className="text-amber-500">{topic.solvedProblems}/{topic.totalProblems} Solved</span>
                          ) : (
                            <span className="group-hover:text-indigo-500 transition-colors flex items-center gap-0.5">
                              Start <ArrowRight className="h-3 w-3" />
                            </span>
                          )}
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
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => {
                  const stats = getCourseStats(course);
                  const isCompleted = stats.total > 0 && stats.solved === stats.total;
                  const isStarted = stats.solved > 0;
                  const isWeb = course.slug === 'web';

                  return (
                    <Card
                      key={course._id}
                      className="group p-6 sm:p-8 flex flex-col justify-between border border-border/60 bg-card hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)] transition-all duration-300"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/10">
                            {isWeb ? <Globe className="h-7 w-7" /> : <Terminal className="h-7 w-7" />}
                          </div>

                          <Badge variant="outline" className="text-xs font-bold">
                            {course.modules?.length || 0} Modules • {stats.total} Challenges
                          </Badge>
                        </div>

                        <div>
                          <h2 className="text-xl font-extrabold tracking-tight group-hover:text-indigo-500 transition-colors">
                            {course.title}
                          </h2>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between">
                        <div className="text-xs font-bold text-muted-foreground">
                          {isCompleted
                            ? 'Path Completed 🎉'
                            : isStarted
                              ? `In Progress • ${stats.solved}/${stats.total} Solved`
                              : 'Not Started yet'}
                        </div>

                        <Link href={`/labs/${course.slug}`}>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                            {isCompleted ? 'Review' : isStarted ? 'Continue' : 'Start'}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}

                {/* Saved Custom Paths */}
                {savedCustomPaths.map((cPath) => {
                  const total = cPath.challengeIds?.length || 0;
                  const solved = cPath.challengeIds?.filter((c: any) => progress?.completedChallenges?.includes(c._id)).length || 0;
                  const isDone = total > 0 && solved === total;

                  return (
                    <Card
                      key={cPath._id}
                      className="group p-6 sm:p-8 flex flex-col justify-between border border-indigo-500/30 bg-card hover:border-indigo-500/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                            <Sparkles className="h-7 w-7" />
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-bold text-indigo-500 border-indigo-500/30 bg-indigo-500/10">
                              Custom Roadmap
                            </Badge>
                            <Badge variant="outline" className="text-[10px] font-bold">
                              {cPath.difficultyProfile}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-xl font-extrabold tracking-tight group-hover:text-indigo-500 transition-colors">
                            {cPath.title}
                          </h2>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            Personalized roadmap containing {total} challenges tailored to your practice setup.
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between">
                        <div className="text-xs font-bold text-muted-foreground">
                          {isDone
                            ? 'Roadmap Completed 🎉'
                            : solved > 0
                              ? `In Progress • ${solved}/${total} Solved`
                              : 'Not Started yet'}
                        </div>

                        <Link href={`/labs/custom/${cPath._id}`}>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                            Launch Path
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Create Custom Path Button Card */}
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

        {/* Create Custom Path Modal Popup */}
        <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
          <DialogContent showCloseButton className="max-w-2xl sm:max-w-3xl w-full p-6 sm:p-8 space-y-6 bg-card border-border/60 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-extrabold text-foreground">Create Custom Path</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Design your personalized learning roadmap by configuring scope, problem volume, and difficulty mix.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* Path Name Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Path Name
                  </label>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    {customPathName.length}/80
                  </span>
                </div>
                <input
                  type="text"
                  value={customPathName}
                  onChange={(e) => setCustomPathName(e.target.value.slice(0, 80))}
                  placeholder="e.g. Frontend Mastery & Python Logic Sprint"
                  className="w-full rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Topics Selection Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Include Topics ({selectedTopics.length} of {availableTopicNames.length} selected)
                  </label>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <Button variant="link" size="xs" onClick={handleSelectAllTopics} className="p-0 h-auto text-indigo-500 hover:text-indigo-600">
                      Select All
                    </Button>
                    <span className="text-muted-foreground/40">•</span>
                    <Button variant="link" size="xs" onClick={handleClearTopics} className="p-0 h-auto text-muted-foreground hover:text-foreground">
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 max-h-52 overflow-y-auto p-3.5 rounded-2xl border border-border/50 bg-muted/10">
                  {availableTopicNames.map((topicName) => {
                    const isSelected = selectedTopics.includes(topicName);
                    return (
                      <button
                        key={topicName}
                        type="button"
                        onClick={() => toggleTopicSelection(topicName)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-card text-muted-foreground border-border/60 hover:bg-muted/40 hover:text-foreground'
                          }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        {topicName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem Count Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Target Problem Count
                  </label>
                  <Badge variant="outline" className="text-xs font-bold text-indigo-500 border-indigo-500/30 bg-indigo-500/10">
                    {problemCount} Problems (~{Math.round(problemCount * 1.5)} mins)
                  </Badge>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={10}
                  value={problemCount}
                  onChange={(e) => setProblemCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-muted rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                  <span>20 • Quick Sprint</span>
                  <span>60 • Standard Track</span>
                  <span>100 • Deep Dive</span>
                </div>
              </div>

              {/* Difficulty Profile Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Difficulty Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
                        className={`p-4 text-center space-y-1.5 transition-all cursor-pointer border ${isSelected
                            ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20 shadow-md'
                            : 'border-border/60 bg-card hover:border-border hover:bg-muted/30'
                          }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <h4 className="text-sm font-extrabold text-foreground">{profile}</h4>
                          {isSelected && <Check className="h-3.5 w-3.5 text-indigo-500 stroke-[3]" />}
                        </div>
                        <p className="text-[10px] font-semibold text-muted-foreground">{ratios}</p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
                <span>Instant AI Roadmap Generation • 100% Free</span>
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-bold px-6"
                >
                  <Sparkles className="h-4 w-4" />
                  {generating ? 'Generating Path...' : 'Generate Path'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
