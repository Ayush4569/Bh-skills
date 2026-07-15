'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Terminal, Globe, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useProgress } from '@/components/progress-provider';

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export default function LabsSelection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const { progress } = useProgress();

  useEffect(() => {
    fetch('/api/labs/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCourses(false));
  }, []);

  if (loadingCourses) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="mt-4 text-sm text-muted-foreground">Loading paths...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">Choose your learning path</h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Start coding instantly. Each path contains bite-sized modules and challenges backed by behavioral validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-6">
        {courses.map((course) => {
          // Dynamic Icon selection
          const Icon = course.slug === 'web' ? Globe : Terminal;
          const isWeb = course.slug === 'web';
          
          return (
            <div
              key={course._id}
              className="group rounded-2xl border border-border/50 bg-card p-8 flex flex-col justify-between hover:border-border hover:shadow-[0_0_20px_rgba(245,158,11,0.03)] transition-all"
            >
              <div className="space-y-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    isWeb ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">{course.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Interactive workspace • Sandbox-isolated
                </div>
                <Link
                  href={`/labs/${course.slug}`}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 ${
                    isWeb ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                >
                  Start Coding
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
