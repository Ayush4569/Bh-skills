'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Flame, Trophy, LayoutDashboard, Terminal, Settings, Menu, X } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useProgress } from './progress-provider';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { progress } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Labs', href: '/labs', icon: Terminal },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
    { name: 'Admin', href: '/admin/content/library', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
              
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent text-lg font-extrabold font-sans">
                Brainheaters <span className="text-sm font-semibold text-muted-foreground">labs</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    active
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-foreground' : 'text-muted-foreground'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Level & XP Badge */}
            {progress && (
              <Badge variant="outline" className="gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-muted/30">
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-muted-foreground">LVL</span>
                <span className="text-foreground">{progress.currentLevel}</span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-foreground">{progress.xp} XP</span>
              </Badge>
            )}

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 px-4 py-3 space-y-2 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                  active
                    ? 'bg-muted/60 text-foreground'
                    : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          
          {progress && (
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span className="text-muted-foreground">LVL {progress.currentLevel}</span>
              </div>
              <span className="text-foreground">{progress.xp} XP total</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
