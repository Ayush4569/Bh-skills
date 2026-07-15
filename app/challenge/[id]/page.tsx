'use client';

import React, { useEffect, useState, useRef, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Play,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Terminal,
  Eye,
  Check,
  Copy,
  ChevronDown
} from 'lucide-react';
import { useProgress } from '@/components/progress-provider';
import CodeEditor from '@/components/code-editor';

interface ValidationRule {
  id: string;
  description: string;
  checkFn: string;
}

interface Challenge {
  _id: string;
  title: string;
  description: string;
  language: 'html' | 'css' | 'javascript' | 'python';
  difficulty: 'easy' | 'medium' | 'hard' | 'miniproject';
  xp: number;
  starterCode: string;
  solution: string;
  validationRules: ValidationRule[];
  hints: string[];
  nextChallengeId: string | null;
}

interface TestStatus {
  id: string;
  passed: boolean | null;
  error: string | null;
}

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: challengeId } = use(params);
  const router = useRouter();
  const { progress, refetchProgress } = useProgress();

  // Challenge State
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Hints States
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [revealedSolution, setRevealedSolution] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  // Running & Validation States
  const [running, setRunning] = useState(false);
  const [validating, setValidating] = useState(false);
  const [solved, setSolved] = useState(false);
  const [testStatuses, setTestStatuses] = useState<Record<string, TestStatus>>({});
  const [consoleLogs, setConsoleLogs] = useState<{ text: string; severity: 'stdout' | 'stderr' | 'system' }[]>([]);
  const [activeRightTab, setActiveRightTab] = useState<'preview' | 'console'>('preview');

  // Iframe ref for preview compiling
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Pyodide Runner States
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);

  // Fetch Challenge Details
  useEffect(() => {
    setLoading(true);
    setSolved(false);
    setTestStatuses({});
    setConsoleLogs([]);
    setRevealedHints({});
    setRevealedSolution(false);

    fetch(`/api/labs/challenges/${challengeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setChallenge(data);
          
          // Check local storage auto-save first
          const savedCode = localStorage.getItem(`challenge_code_${data._id}`);
          setCode(savedCode !== null ? savedCode : data.starterCode);

          // If language is python, default tab to console
          if (data.language === 'python') {
            setActiveRightTab('console');
          } else {
            setActiveRightTab('preview');
          }

          // Initial test statuses
          const initialStatuses: Record<string, TestStatus> = {};
          data.validationRules.forEach((rule: ValidationRule) => {
            initialStatuses[rule.id] = { id: rule.id, passed: null, error: null };
          });
          setTestStatuses(initialStatuses);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [challengeId]);

  // Pyodide Initialization helper
  const initPyodide = async () => {
    if ((window as any).loadPyodide && !pyodide) {
      try {
        setConsoleLogs((prev) => [...prev, { text: 'Initializing Python Runner...', severity: 'system' }]);
        const py = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
        });
        setPyodide(py);
        setPyodideLoaded(true);
        setConsoleLogs((prev) => [...prev, { text: 'Python environment loaded successfully.', severity: 'system' }]);
      } catch (err: any) {
        setConsoleLogs((prev) => [
          ...prev,
          { text: `Failed to load Python: ${err.message}`, severity: 'stderr' },
        ]);
      }
    }
  };

  // Compile standard HTML preview
  const compileSrcDoc = useCallback(
    (userCode: string, runTests = false) => {
      if (!challenge) return '';

      let doc = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 16px; background-color: transparent; }
          </style>
        </head>
        <body>
          ${userCode}
          
          <script>
            // Intercept console.log and errors
            (function() {
              const originalLog = console.log;
              const originalError = console.error;
              
              console.log = function(...args) {
                originalLog.apply(console, args);
                window.parent.postMessage({
                  type: 'IFRAME_LOG',
                  text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
                  severity: 'stdout'
                }, '*');
              };
              
              console.error = function(...args) {
                originalError.apply(console, args);
                window.parent.postMessage({
                  type: 'IFRAME_LOG',
                  text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
                  severity: 'stderr'
                }, '*');
              };

              window.addEventListener('error', function(e) {
                window.parent.postMessage({
                  type: 'IFRAME_LOG',
                  text: e.message,
                  severity: 'stderr'
                }, '*');
              });
            })();
          </script>
      `;

      if (runTests) {
        doc += `
          <script>
            (function() {
              function runChecks() {
                const rules = ${JSON.stringify(challenge.validationRules)};
                const results = [];
                for (const rule of rules) {
                  try {
                    let checkCode = rule.checkFn.trim();
                    // Auto-prepend return for simple expression rules
                    if (!checkCode.startsWith('return') && !checkCode.startsWith('const') && !checkCode.startsWith('let') && !checkCode.startsWith('var') && !checkCode.startsWith('function') && !checkCode.startsWith('if')) {
                      checkCode = 'return ' + checkCode;
                    }
                    
                    const fn = new Function(checkCode);
                    const passed = fn();
                    results.push({ id: rule.id, passed: !!passed, error: null });
                  } catch (err) {
                    results.push({ id: rule.id, passed: false, error: err.message });
                  }
                }
                window.parent.postMessage({ type: 'VALIDATION_RESULTS', results: results }, '*');
              }

              if (document.readyState === 'complete') {
                setTimeout(runChecks, 150);
              } else {
                window.addEventListener('load', function() {
                  setTimeout(runChecks, 150);
                });
              }
            })();
          </script>
        `;
      }

      doc += `
        </body>
        </html>
      `;
      return doc;
    },
    [challenge]
  );

  // Iframe Message Listener for web validation and log catching
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg) return;

      if (msg.type === 'IFRAME_LOG') {
        setConsoleLogs((prev) => [...prev, { text: msg.text, severity: msg.severity }]);
      } else if (msg.type === 'VALIDATION_RESULTS') {
        const results: { id: string; passed: boolean; error: string | null }[] = msg.results;
        
        const updatedStatuses = { ...testStatuses };
        let allPassed = true;
        
        results.forEach((res) => {
          updatedStatuses[res.id] = { id: res.id, passed: res.passed, error: res.error };
          if (!res.passed) allPassed = false;
        });

        setTestStatuses(updatedStatuses);
        setValidating(false);

        if (allPassed) {
          handleChallengePassed();
        } else {
          setConsoleLogs((prev) => [
            ...prev,
            { text: '❌ Validation Failed. Please review the failing test cases.', severity: 'stderr' },
          ]);
        }
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [testStatuses, compileSrcDoc]);

  // Award XP and complete challenge handler
  const handleChallengePassed = async () => {
    setSolved(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setConsoleLogs((prev) => [
      ...prev,
      { text: '🎉 SUCCESS! All behavioral validations passed!', severity: 'system' },
    ]);

    try {
      const res = await fetch(`/api/labs/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, passed: true }),
      });
      if (res.ok) {
        await refetchProgress();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run Code logic (does not validate behavior)
  const handleRunCode = async () => {
    if (!challenge) return;
    setRunning(true);
    setConsoleLogs([]);

    if (challenge.language === 'python') {
      if (!pyodide) {
        await initPyodide();
      }

      try {
        setConsoleLogs((prev) => [...prev, { text: 'Running python script...', severity: 'system' }]);
        
        let localStdout = '';
        pyodide.setStdout({
          batched: (text: string) => {
            localStdout += text + '\n';
            setConsoleLogs((prev) => [...prev, { text, severity: 'stdout' }]);
          },
        });
        pyodide.setStderr({
          batched: (text: string) => {
            setConsoleLogs((prev) => [...prev, { text, severity: 'stderr' }]);
          },
        });

        await pyodide.runPythonAsync(code);
        setConsoleLogs((prev) => [...prev, { text: 'Process finished successfully.', severity: 'system' }]);
      } catch (err: any) {
        setConsoleLogs((prev) => [...prev, { text: err.message, severity: 'stderr' }]);
      } finally {
        setRunning(false);
      }
    } else {
      // For HTML/CSS/JS, reload standard iframe
      if (iframeRef.current) {
        setConsoleLogs((prev) => [...prev, { text: 'Compiling live workspace...', severity: 'system' }]);
        iframeRef.current.srcdoc = compileSrcDoc(code, false);
      }
      setTimeout(() => setRunning(false), 500);
    }
  };

  // Validate Code logic
  const handleValidateCode = async () => {
    if (!challenge) return;
    setValidating(true);
    setConsoleLogs([]);

    // Check backend run attempt log
    try {
      await fetch(`/api/labs/challenges/${challengeId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
    } catch (e) {
      console.error('Failed to log attempts:', e);
    }

    if (challenge.language === 'python') {
      if (!pyodide) {
        await initPyodide();
      }

      setConsoleLogs((prev) => [...prev, { text: 'Running behavioral check assertions...', severity: 'system' }]);
      
      let localStdout = '';
      pyodide.setStdout({
        batched: (text: string) => {
          localStdout += text + '\n';
          setConsoleLogs((prev) => [...prev, { text, severity: 'stdout' }]);
        },
      });
      pyodide.setStderr({
        batched: (text: string) => {
          setConsoleLogs((prev) => [...prev, { text, severity: 'stderr' }]);
        },
      });

      // 1. Run student script first
      try {
        await pyodide.runPythonAsync(code);
      } catch (err: any) {
        setConsoleLogs((prev) => [
          ...prev,
          { text: `Runtime Error: ${err.message}`, severity: 'stderr' },
        ]);
        setValidating(false);
        return;
      }

      // 2. Run each assertion script in Pyodide
      const updatedStatuses = { ...testStatuses };
      let allPassed = true;

      for (const rule of challenge.validationRules) {
        try {
          // Set stdout log variable inside python for checks
          pyodide.globals.set('__output__', localStdout);
          await pyodide.runPythonAsync(rule.checkFn);
          
          updatedStatuses[rule.id] = { id: rule.id, passed: true, error: null };
        } catch (err: any) {
          allPassed = false;
          updatedStatuses[rule.id] = { id: rule.id, passed: false, error: err.message };
        }
      }

      setTestStatuses(updatedStatuses);
      setValidating(false);

      if (allPassed) {
        handleChallengePassed();
      } else {
        setConsoleLogs((prev) => [
          ...prev,
          { text: '❌ Assertions Failed. Please check the tests panel.', severity: 'stderr' },
        ]);
      }
    } else {
      // Web challenges: mount iframe with test runner script
      if (iframeRef.current) {
        setConsoleLogs((prev) => [...prev, { text: 'Mounting sandboxed validator...', severity: 'system' }]);
        iframeRef.current.srcdoc = compileSrcDoc(code, true);
      }
    }
  };

  // Reset Code logic
  const handleResetCode = () => {
    if (!challenge) return;
    if (!confirm('Are you sure you want to reset the editor to the starter template?')) return;
    
    setCode(challenge.starterCode);
    localStorage.removeItem(`challenge_code_${challenge._id}`);
    
    // Clear test statuses
    const initialStatuses: Record<string, TestStatus> = {};
    challenge.validationRules.forEach((rule: ValidationRule) => {
      initialStatuses[rule.id] = { id: rule.id, passed: null, error: null };
    });
    setTestStatuses(initialStatuses);
    setSolved(false);
    setConsoleLogs((prev) => [...prev, { text: 'Editor reset to starter template.', severity: 'system' }]);
  };

  // Copy solution logic
  const handleCopySolution = () => {
    if (!challenge) return;
    navigator.clipboard.writeText(challenge.solution);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="mt-4 text-sm text-muted-foreground">Loading workspace details...</span>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold">Challenge not found</h2>
        <Link href="/labs" className="mt-4 text-sm text-amber-500 hover:underline">
          Back to paths
        </Link>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    hard: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    miniproject: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  }[challenge.difficulty];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Script loading for Pyodide */}
      {challenge.language === 'python' && (
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js"
          strategy="afterInteractive"
          onLoad={initPyodide}
          crossOrigin="anonymous"
        />
      )}

      {/* Main workspace layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-background">
        
        {/* Left Pane: Details & Instructions */}
        <div className="flex flex-col border-r border-border/40 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 pb-4">
            <Link href="/labs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Labs
            </Link>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${difficultyColors}`}>
                {challenge.difficulty}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {challenge.xp} XP reward
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{challenge.title}</h1>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 inline-block">
              LANGUAGE: {challenge.language}
            </span>
          </div>

          {/* Instructions (markdown output styled) */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
            {challenge.description.split('\n\n').map((para, i) => {
              if (para.startsWith('###')) {
                return <h3 key={i} className="text-lg font-bold text-foreground mt-4">{para.replace('###', '').trim()}</h3>;
              }
              if (para.startsWith('*') || para.startsWith('-')) {
                return (
                  <ul key={i} className="list-disc pl-5 space-y-1.5 mt-2">
                    {para.split('\n').map((item, idx) => (
                      <li key={idx}>{item.replace(/^[*-\s]+/, '').trim()}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="leading-relaxed">{para}</p>;
            })}
          </div>

          {/* Validation Checklist */}
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-500" />
              Verification Tests
            </h3>
            
            <div className="space-y-2">
              {challenge.validationRules.map((rule) => {
                const status = testStatuses[rule.id];
                return (
                  <div key={rule.id} className="flex items-start gap-2.5 text-sm py-1.5 border-b border-border/20 last:border-b-0">
                    {status?.passed === true ? (
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : status?.passed === false ? (
                      <XCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full border-2 border-muted-foreground/30 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${status?.passed === false ? 'text-rose-500' : 'text-foreground/90'}`}>
                        {rule.description}
                      </p>
                      {status?.passed === false && status.error && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1 bg-rose-500/5 p-1.5 rounded-md border border-rose-500/10">
                          Error: {status.error}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hints Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-indigo-500" />
              Hints & Help
            </h3>

            <div className="space-y-2.5">
              {challenge.hints.map((hint, idx) => {
                const isRevealed = revealedHints[idx] || false;
                const isPreviousRevealed = idx === 0 || revealedHints[idx - 1] === true;

                return (
                  <div key={idx} className="rounded-lg border border-border/40 bg-card/40 overflow-hidden text-sm">
                    {isRevealed ? (
                      <div className="p-3 bg-muted/20 text-muted-foreground leading-relaxed">
                        <span className="font-bold text-foreground">Hint {idx + 1}:</span> {hint}
                      </div>
                    ) : (
                      <button
                        onClick={() => setRevealedHints((prev) => ({ ...prev, [idx]: true }))}
                        disabled={!isPreviousRevealed}
                        className="w-full text-left p-3 flex justify-between items-center hover:bg-muted/40 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                      >
                        <span className="font-semibold text-muted-foreground">Reveal Hint {idx + 1}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Reveal Solution */}
              <div className="rounded-lg border border-border/40 bg-card/40 overflow-hidden text-sm">
                {revealedSolution ? (
                  <div className="p-4 bg-muted/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">Official Solution</span>
                      <button
                        onClick={handleCopySolution}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600"
                      >
                        {copiedSolution ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copiedSolution ? 'Copied' : 'Copy Solution'}
                      </button>
                    </div>
                    <pre className="text-xs font-mono p-3 bg-black/40 rounded-lg overflow-x-auto text-amber-500/90 whitespace-pre-wrap">
                      {challenge.solution}
                    </pre>
                  </div>
                ) : (
                  <button
                    onClick={() => setRevealedSolution(true)}
                    className="w-full text-left p-3 flex justify-between items-center hover:bg-muted/40 transition-colors text-rose-500/80 hover:text-rose-500 font-semibold"
                  >
                    <span>Reveal Official Solution</span>
                    <ChevronDown className="h-4 w-4 text-rose-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor + Preview/Console */}
        <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
          
          {/* Top Half: Code Editor */}
          <div className="flex-1 min-h-[40%] flex flex-col p-4 pb-2">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground px-1 pb-2">
              <span className="uppercase tracking-wider">Monaco Editor Workspace</span>
              <span>Auto-saved locally</span>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                challengeId={challenge._id}
                language={challenge.language}
                defaultValue={challenge.starterCode}
                value={code}
                onChange={setCode}
              />
            </div>
          </div>

          {/* Bottom Half: Preview / Console */}
          <div className="h-[40%] min-h-[250px] flex flex-col p-4 pt-2 border-t border-border/30">
            {/* Tabs */}
            <div className="flex justify-between items-center border-b border-border/20 pb-2 mb-2">
              <div className="flex items-center gap-3">
                {challenge.language !== 'python' && (
                  <button
                    onClick={() => setActiveRightTab('preview')}
                    className={`flex items-center gap-1.5 text-xs font-bold uppercase pb-1 border-b-2 ${
                      activeRightTab === 'preview'
                        ? 'border-amber-500 text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Live Preview
                  </button>
                )}
                <button
                  onClick={() => setActiveRightTab('console')}
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase pb-1 border-b-2 ${
                    activeRightTab === 'console'
                      ? 'border-indigo-500 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  Console Output
                </button>
              </div>
              <span className="text-[10px] text-muted-foreground font-semibold">Workspace Outputs</span>
            </div>

            {/* Content areas */}
            <div className="flex-1 min-h-0 bg-black/40 rounded-xl overflow-hidden border border-border/20">
              {activeRightTab === 'preview' && challenge.language !== 'python' ? (
                <iframe
                  ref={iframeRef}
                  title="Sandboxed Live Preview"
                  sandbox="allow-scripts"
                  className="w-full h-full bg-white dark:bg-white"
                  srcDoc={compileSrcDoc(code, false)}
                />
              ) : (
                /* Console Output Terminal */
                <div className="w-full h-full p-4 overflow-y-auto font-mono text-xs space-y-1 bg-[#0f0f0f] text-neutral-200">
                  {consoleLogs.length === 0 ? (
                    <span className="text-muted-foreground/60 italic">Console is quiet. Click 'Run' to see outputs.</span>
                  ) : (
                    consoleLogs.map((log, idx) => {
                      const colors = {
                        stdout: 'text-neutral-200',
                        stderr: 'text-rose-500 font-bold',
                        system: 'text-amber-500/90 italic font-semibold',
                      }[log.severity];
                      return (
                        <div key={idx} className={`${colors} whitespace-pre-wrap`}>
                          {log.text}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="h-16 border-t border-border/40 bg-card px-6 flex items-center justify-between z-10 shrink-0">
        <button
          onClick={handleResetCode}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 hover:bg-muted/40 text-foreground px-4 py-2.5 text-xs font-bold transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Template
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCode}
            disabled={running || validating}
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 hover:bg-muted/40 text-foreground px-5 py-2.5 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 text-emerald-500" />
            {running ? 'Running...' : 'Run Code'}
          </button>

          <button
            onClick={handleValidateCode}
            disabled={validating || running}
            className="inline-flex items-center gap-2 rounded-lg bg-primary hover:opacity-90 text-primary-foreground px-5 py-2.5 text-xs font-bold transition-all disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {validating ? 'Validating...' : 'Validate & Submit'}
          </button>

          {challenge.nextChallengeId && (
            <button
              onClick={() => router.push(`/challenge/${challenge.nextChallengeId}`)}
              disabled={!solved}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold transition-all disabled:opacity-50 disabled:hover:bg-amber-500"
            >
              Next Challenge
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
