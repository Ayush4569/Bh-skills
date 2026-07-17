import React from 'react';

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = 'h-8 w-8' }: SpinnerProps) {
  return (
    <div className={`relative ${className} shrink-0`} id="custom-loading-spinner">
      {/* Outer track */}
      <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10" />
      {/* Spinning glow ring */}
      <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin" />
    </div>
  );
}

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[350px] w-full p-8 bg-background" id="custom-loading-screen">
      <div className="relative flex items-center justify-center mb-5">
        <div className="absolute -inset-4 bg-indigo-500/5 rounded-full blur-xl animate-pulse" />
        <Spinner className="h-12 w-12" />
      </div>
      <span className="text-sm font-semibold text-muted-foreground tracking-wide animate-pulse">
        {message}
      </span>
    </div>
  );
}
