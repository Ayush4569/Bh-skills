'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  BookOpen,
  CheckCircle2,
  Check,
  ChevronRight,
  Trash2,
  Layers,
  Zap,
} from 'lucide-react';
import { useProgress } from '@/components/progress-provider';
import { LoadingScreen } from '@/components/loader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChallengeItem {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'miniproject';
  language: string;
  xp: number;
  moduleId?: {
    _id: string;
    title: string;
  };
}

interface CustomPathData {
  _id: string;
  title: string;
  selectedTopics: string[];
  problemCount: number;
  difficultyProfile: 'Beginner' | 'Balanced' | 'Challenge';
  challengeIds: ChallengeItem[];
  createdAt: string;
}

export default function CustomPathView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { progress } = useProgress();

  const [pathData, setPathData] = useState<CustomPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/labs/custom-path/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load custom roadmap');
        return res.json();
      })
      .then((data) => setPathData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this custom roadmap?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/labs/custom-path/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/labs');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Building custom roadmap view..." />;
  }

  if (error || !pathData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-sm font-semibold text-rose-500">{error || 'Roadmap not found'}</p>
        <Link href="/labs">
          <Button variant="outline">Back to Labs</Button>
        </Link>
      </div>
    );
  }

  const challenges = pathData.challengeIds || [];
  const total = challenges.length;
  const solved = challenges.filter((c) => progress?.completedChallenges?.includes(c._id)).length;
  const progressPercent = total > 0 ? Math.round((solved / total) * 100) : 0;

  // Group challenges by module or topic name
  const groupedByTopic: Record<string, ChallengeItem[]> = {};
  challenges.forEach((chal) => {
    const topicName = chal.moduleId?.title || 'General Practice';
    if (!groupedByTopic[topicName]) {
      groupedByTopic[topicName] = [];
    }
    groupedByTopic[topicName].push(chal);
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl w-full px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link href="/labs">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Labs
            </Button>
          </Link>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-1.5 text-xs font-bold"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? 'Deleting...' : 'Delete Roadmap'}
          </Button>
        </div>

        {/* Roadmap Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-1">
            <Sparkles className="h-8 w-8" />
          </div>

          <div className="flex justify-center items-center gap-2">
            <Badge variant="outline" className="text-xs font-bold text-indigo-500 border-indigo-500/30 bg-indigo-500/10">
              Custom AI Roadmap
            </Badge>
            <Badge variant="outline" className="text-xs font-bold">
              {pathData.difficultyProfile} Profile
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            {pathData.title}
          </h1>

          {pathData.selectedTopics.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {pathData.selectedTopics.map((topic) => (
                <Badge key={topic} variant="secondary" className="text-[10px] font-bold">
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats Bar */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-full border border-border/60 bg-card px-8 py-3 text-xs sm:text-sm font-bold shadow-sm text-muted-foreground divide-x divide-border/60">
              <div className="flex items-center gap-2 text-foreground/80">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>{total} challenges</span>
              </div>
              <div className="flex items-center gap-2 pl-4 text-foreground/80">
                <Layers className="h-4 w-4 text-indigo-500" />
                <span>{Object.keys(groupedByTopic).length} topic sections</span>
              </div>
              <div className="flex items-center gap-2 pl-4 text-emerald-500 font-extrabold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{solved} / {total} solved ({progressPercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Topics & Challenges Timeline */}
        <div className="space-y-8 max-w-4xl mx-auto pt-6">
          {Object.entries(groupedByTopic).map(([topicTitle, topicChallenges], idx) => {
            const topicSolved = topicChallenges.filter((c) => progress?.completedChallenges?.includes(c._id)).length;
            const topicTotal = topicChallenges.length;
            const isTopicDone = topicTotal > 0 && topicSolved === topicTotal;

            return (
              <Card key={topicTitle} className="p-6 border border-border/60 bg-card space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-extrabold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-foreground">{topicTitle}</h3>
                      <p className="text-xs text-muted-foreground">{topicTotal} practice challenges in this topic</p>
                    </div>
                  </div>

                  <Badge variant={isTopicDone ? 'success' : 'outline'} className="text-xs font-bold">
                    {topicSolved} / {topicTotal} Completed
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {topicChallenges.map((chal) => {
                    const isCompleted = progress?.completedChallenges?.includes(chal._id);

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
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group/item ${
                          isCompleted
                            ? 'border-emerald-500/20 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]'
                            : 'border-border/60 hover:border-indigo-500/50 hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isCompleted ? (
                            <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm shrink-0">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-indigo-500/60 group-hover/item:border-indigo-500 bg-transparent shrink-0" />
                          )}

                          <span className="text-sm font-bold text-foreground truncate">
                            {chal.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <Badge variant={difficultyVariant} className="text-[9px] font-extrabold uppercase">
                            {chal.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-[9px] font-bold">
                            +{chal.xp} XP
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover/item:text-foreground transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
