'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, Globe, Award, Sparkles, ArrowRight, CheckCircle2, Code2, Cpu } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col justify-center">
      {/* Visual background enhancements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-500">
            <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
            <span>Interactive Labs are now Live</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans leading-[1.1] sm:leading-[1.05]"
          >
            Learn coding by{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-500 bg-clip-text text-transparent">
              writing actual code.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Skip the endless video tutorials. Dive straight into a web-based code editor, execute logic instantly, and pass behavioral validations to earn XP and level up.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              Enter Sandbox
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/labs"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border/60 bg-muted/20 px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-muted/50 hover:scale-[1.02]"
            >
              Explore Paths
            </Link>
          </motion.div>

          {/* Feature Showcase Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left"
          >
            {/* Card 1 */}
            <div className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-[0_0_20px_rgba(245,158,11,0.05)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Live Web Previews</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Build HTML, CSS, and JS. See your designs render in real-time inside a fully isolated, sandboxed preview iframe.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-[0_0_20px_rgba(99,102,241,0.05)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Python in the Browser</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Run actual Python logic with Pyodide. No remote servers required. Watch console outputs and exceptions execute locally.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Behavioral Validation</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Our engine checks actual behavior (e.g. style rules, click interactions, and return assertions) instead of simple string-matching.
              </p>
            </div>
          </motion.div>

          {/* Workflow Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Free to Learn</span>
            </div>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-amber-500" />
              <span>Monaco-Editor Integrated</span>
            </div>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-500" />
              <span>Zero Server Setup</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
