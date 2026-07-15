'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, AlertCircle } from 'lucide-react';

interface Module {
  _id: string;
  title: string;
  courseId: {
    title: string;
  } | null;
}

interface ValidationRule {
  id: string;
  description: string;
  checkFn: string;
}

export default function NewChallenge() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [language, setLanguage] = useState<'html' | 'css' | 'javascript' | 'python'>('html');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'miniproject'>('easy');
  const [xp, setXp] = useState(20);
  const [starterCode, setStarterCode] = useState('');
  const [solution, setSolution] = useState('');
  const [published, setPublished] = useState(false);

  // Dynamic lists
  const [hints, setHints] = useState<string[]>(['']);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([
    { id: 'rule_1', description: '', checkFn: '' },
  ]);

  // Load modules list
  useEffect(() => {
    fetch('/api/admin/labs/modules')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setModules(data);
          if (data.length > 0) {
            setModuleId(data[0]._id);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddHint = () => setHints([...hints, '']);
  const handleRemoveHint = (index: number) => {
    const updated = [...hints];
    updated.splice(index, 1);
    setHints(updated);
  };
  const handleHintChange = (index: number, val: string) => {
    const updated = [...hints];
    updated[index] = val;
    setHints(updated);
  };

  const handleAddRule = () => {
    setValidationRules([
      ...validationRules,
      { id: `rule_${Date.now()}`, description: '', checkFn: '' },
    ]);
  };
  const handleRemoveRule = (index: number) => {
    const updated = [...validationRules];
    updated.splice(index, 1);
    setValidationRules(updated);
  };
  const handleRuleChange = (index: number, field: keyof ValidationRule, val: string) => {
    const updated = [...validationRules];
    updated[index] = { ...updated[index], [field]: val };
    setValidationRules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Filter empty values
    const filteredHints = hints.map((h) => h.trim()).filter((h) => h !== '');
    const filteredRules = validationRules.filter((r) => r.description.trim() !== '' && r.checkFn.trim() !== '');

    if (!moduleId) {
      setError('Please select a parent module.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/labs/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          moduleId,
          language,
          difficulty,
          xp,
          starterCode,
          solution,
          hints: filteredHints,
          validationRules: filteredRules,
          published,
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        router.push('/admin');
      } else {
        setError(resData.error || 'Failed to save challenge.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="mt-4 text-sm text-muted-foreground">Loading modules...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Admin
        </Link>
      </div>

      <div className="border-b border-border/40 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Create Challenge</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Define instructions, select difficulty, write starter templates, and set behavioral tests.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-center gap-3 text-sm text-rose-500">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core fields card */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground">1. Metadata</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Challenge Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Center a Div"
                required
                className="w-full rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Description & Objectives (Markdown)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="### Challenge Objectives\nDescribe the challenge and objectives here..."
                required
                rows={5}
                className="w-full rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Parent Module</label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {modules.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.title} {m.courseId ? `(${m.courseId.title})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="miniproject">Mini Project</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">XP reward</label>
              <input
                type="number"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
                min={1}
                required
                className="w-full rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Code templates card */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground">2. Code Templates</h2>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Starter Code</label>
              <textarea
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                placeholder="Starter template code provided to students..."
                rows={6}
                className="w-full rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Official Solution Code</label>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="The reference code solution shown when students give up..."
                rows={6}
                className="w-full rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Validation rules card */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-foreground">3. Behavioral Test Cases</h2>
            <button
              type="button"
              onClick={handleAddRule}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Test
            </button>
          </div>

          <div className="space-y-4">
            {validationRules.map((rule, idx) => (
              <div key={rule.id} className="relative rounded-xl border border-border/40 p-4 bg-muted/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground">Test Case #{idx + 1}</span>
                  {validationRules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="text-rose-500 hover:text-rose-600 transition-colors"
                      title="Remove test case"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={rule.description}
                    onChange={(e) => handleRuleChange(idx, 'description', e.target.value)}
                    placeholder="Test description (e.g. Verify that button turns red)"
                    required
                    className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                  
                  <textarea
                    value={rule.checkFn}
                    onChange={(e) => handleRuleChange(idx, 'checkFn', e.target.value)}
                    placeholder={
                      language === 'python'
                        ? 'assert add(2, 3) == 5, "add(2,3) should return 5"\n# __output__ variable contains stdout text'
                        : 'document.querySelector("button") !== null\n// Executes as JS function returning boolean'
                    }
                    required
                    rows={3}
                    className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hints Card */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-foreground">4. Hints</h2>
            <button
              type="button"
              onClick={handleAddHint}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Hint
            </button>
          </div>

          <div className="space-y-3">
            {hints.map((hint, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => handleHintChange(idx, e.target.value)}
                  placeholder={`Hint #${idx + 1}`}
                  className="flex-1 rounded-lg border border-border/60 bg-transparent px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
                {hints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveHint(idx)}
                    className="text-rose-500 hover:text-rose-600 transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Publish Card */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-foreground">5. Publish Challenge</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle whether the challenge is live for students immediately.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin"
            className="rounded-xl border border-border/60 hover:bg-muted/40 text-foreground px-6 py-3 text-sm font-semibold transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground px-6 py-3 text-sm font-semibold transition-all disabled:opacity-50"
          >
            <Save className="h-4.5 w-4.5" />
            {saving ? 'Saving...' : 'Save Challenge'}
          </button>
        </div>

      </form>
    </div>
  );
}
