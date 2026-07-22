'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Globe, Terminal, Award, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { LoadingScreen } from '@/components/loader';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
        <Link href="/admin/challenge/new">
          <Button className='rounded-md bg-[#522BFF] text-white' >
            <Plus className="h-4 w-4" />
            Create Challenge
          </Button>
        </Link>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-5">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Total Challenges</span>
          <p className="text-2xl font-extrabold text-foreground mt-1">{challenges.length}</p>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-semibold text-emerald-500 uppercase">Published Live</span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">{publishedCount}</p>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-semibold text-amber-500 uppercase">Unpublished Drafts</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">{draftCount}</p>
        </Card>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-center gap-3 text-sm text-rose-500">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table list */}
      <Card className="overflow-hidden">
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
                      <Badge variant="outline" className="capitalize text-xs font-semibold">{chal.difficulty}</Badge>
                    </td>
                    <td className="p-4 text-xs font-semibold">{chal.xp} XP</td>
                    <td className="p-4 text-muted-foreground text-xs truncate max-w-[180px]">
                      {chal.moduleId?.title || <span className="italic text-muted-foreground/60">Unassigned</span>}
                    </td>
                    <td className="p-4">
                      {chal.published ? (
                        <Badge variant="success" className="uppercase text-[10px] font-bold">
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="uppercase text-[10px] font-bold">
                          Draft
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2.5 whitespace-nowrap">
                      <Link href={`/admin/challenge/${chal._id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-1 font-semibold">
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(chal._id, chal.title)}
                        className="gap-1 font-semibold"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation/Alert Dialog */}
      <Dialog open={confirmModal.isOpen} onOpenChange={(open) => setConfirmModal((prev) => ({ ...prev, isOpen: open }))}>
        <DialogContent showCloseButton className="max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmModal.title}</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              {confirmModal.message}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-3 pt-4">
            {confirmModal.showCancel && (
              <Button
                variant="outline"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
              >
                {confirmModal.cancelText || 'Cancel'}
              </Button>
            )}
            <Button
              variant={confirmModal.title === 'Error' ? 'default' : 'destructive'}
              onClick={() => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                confirmModal.onConfirm();
              }}
            >
              {confirmModal.confirmText || 'Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
