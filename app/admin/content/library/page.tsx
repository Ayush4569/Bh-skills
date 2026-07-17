'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Globe, Terminal, Award, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { LoadingScreen } from '@/components/loader';

interface Challenge {
  _id: string;
  title: string;
  language: string;
  difficulty: string;
  xp: number;
  published: boolean;
  moduleId: {
    _id: string;
    title: string;
  } | null;
}

export default function AdminDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes',
    cancelText: 'Cancel',
    showCancel: true,
    onConfirm: () => {},
  });

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/admin/labs/challenge');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      } else {
        setError('Failed to fetch challenges.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Challenge',
      message: `Are you sure you want to delete the challenge "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => executeDelete(id),
    });
  };

  const executeDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/labs/challenge/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setChallenges((prev) => prev.filter((c) => c._id !== id));
      } else {
        const errData = await res.json();
        showErrorModal(`Delete failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      showErrorModal('Delete failed.');
    }
  };

  const showErrorModal = (message: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Error',
      message,
      confirmText: 'OK',
      showCancel: false,
      onConfirm: () => {},
    });
  };

  if (loading) {
    return <LoadingScreen message="Loading admin details..." />;
  }

  const publishedCount = challenges.filter((c) => c.published).length;
  const draftCount = challenges.length - publishedCount;

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your courses, modules, coding templates, and validation logic.
          </p>
        </div>
        <Link
          href="/admin/challenge/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Create Challenge
        </Link>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Total Challenges</span>
          <p className="text-2xl font-extrabold text-foreground mt-1">{challenges.length}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <span className="text-xs font-semibold text-emerald-500 uppercase">Published Live</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">{publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <span className="text-xs font-semibold text-amber-500 uppercase">Unpublished Drafts</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">{draftCount}</p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-center gap-3 text-sm text-rose-500">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table list */}
      <div className="rounded-2xl border border-border/40 overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/40 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">Challenge Title</th>
                <th className="p-4">Language</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">XP</th>
                <th className="p-4">Parent Module</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 font-medium">
              {challenges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground italic">
                    No challenges exist in the system. Create one above to get started!
                  </td>
                </tr>
              ) : (
                challenges.map((chal) => (
                  <tr key={chal._id} className="hover:bg-muted/15 transition-colors">
                    <td className="p-4 font-bold text-foreground">{chal.title}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 uppercase text-xs">
                        {chal.language === 'python' ? (
                          <Terminal className="h-3.5 w-3.5 text-indigo-500" />
                        ) : (
                          <Globe className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        {chal.language}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-xs">{chal.difficulty}</span>
                    </td>
                    <td className="p-4 text-xs font-semibold">{chal.xp} XP</td>
                    <td className="p-4 text-muted-foreground text-xs truncate max-w-[180px]">
                      {chal.moduleId?.title || <span className="italic text-muted-foreground/60">Unassigned</span>}
                    </td>
                    <td className="p-4">
                      {chal.published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2.5 whitespace-nowrap">
                      <Link
                        href={`/admin/challenge/${chal._id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border hover:bg-muted/50 text-foreground px-2.5 py-1.5 text-xs font-semibold transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(chal._id, chal.title)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 px-2.5 py-1.5 text-xs font-semibold transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Confirmation/Alert Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6 mx-4 transform scale-100 transition-all">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                {confirmModal.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {confirmModal.message}
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              {confirmModal.showCancel && (
                <button
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-border hover:bg-muted/40 transition-colors text-foreground"
                >
                  {confirmModal.cancelText || 'Cancel'}
                </button>
              )}
              <button
                onClick={() => {
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  confirmModal.onConfirm();
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg text-white transition-colors ${
                  confirmModal.title === 'Error'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-destructive hover:bg-destructive/90'
                }`}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
