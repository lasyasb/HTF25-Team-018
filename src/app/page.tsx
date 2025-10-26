'use client';

import Link from 'next/link';
import { FileText, Upload, ClipboardPaste, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline tracking-tight mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Supercharge Your Career with ResumeAI
        </h1>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground">
          Build a professional resume from scratch, get instant AI-powered analysis on your existing one, or see how you stack up against a job description.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <OptionCard
          icon={FileText}
          title="Create New Resume"
          description="Build a new resume step-by-step with our guided editor."
          href="/resumes/new"
          cta="Start from Scratch"
        />
        <OptionCard
          icon={Upload}
          title="Upload & Analyze"
          description="Upload your existing resume in PDF format for AI analysis."
          href="/resumes/import?type=upload"
          cta="Upload PDF"
        />
        <OptionCard
          icon={ClipboardPaste}
          title="Paste & Analyze"
          description="Paste the text of your resume to get instant feedback and suggestions."
          href="/resumes/import?type=paste"
          cta="Paste Text"
        />
      </div>

       <div className="text-center mt-16">
        <Button size="lg" asChild>
          <Link href="/dashboard">
            Go to Your Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface OptionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  cta: string;
  disabled?: boolean;
}

function OptionCard({ icon: Icon, title, description, href, cta, disabled }: OptionCardProps) {
  return (
    <Card className="flex flex-col text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 relative holographic-sheen">
      <CardHeader>
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-end justify-center">
        <Button asChild variant="outline" className="w-full" disabled={disabled}>
          <Link href={href}>{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
