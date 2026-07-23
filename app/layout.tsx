import type { Metadata } from "next";
import { Inter, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ProgressProvider } from "@/components/progress-provider";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brainheaters Labs | Learn Coding by Solving Challenges",
  description: "An interactive browser-only coding workspace to master HTML, CSS, JavaScript, and Python.",
};

const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })()
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geist.variable, geistMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider>
          <ProgressProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

