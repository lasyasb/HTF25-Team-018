'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  matchResumeToJobDescription,
  type MatchResumeToJobDescriptionOutput,
} from '@/ai/flows/match-resume-to-job-description';
import { Loader2, Percent, Target, ThumbsUp, ZoomIn, Crosshair } from 'lucide-react';
import { type Resume } from '../dashboard-client';
import { fullResumeText } from '@/lib/resume-text';

interface JobMatchModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resume: Resume | null;
}

export default function JobMatchModal({
  isOpen,
  onOpenChange,
  resume,
}: JobMatchModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchResumeToJobDescriptionOutput | null>(null);
  const { toast } = useToast();

  const handleMatch = async () => {
    if (!resume) {
        toast({ title: 'No resume selected', variant: 'destructive'});
        return;
    }
    if (!jobDescription.trim()) {
      toast({
        title: 'Job Description Required',
        description: 'Please paste a job description to start the analysis.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await matchResumeToJobDescription({
        resumeText: fullResumeText(resume),
        jobDescriptionText: jobDescription,
      });
      setResult(response);
    } catch (error) {
      console.error('Error matching resume:', error);
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred while matching the resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state on close after a short delay to allow for exit animation
    setTimeout(() => {
        setJobDescription('');
        setResult(null);
        setIsLoading(false);
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Crosshair className="h-6 w-6 text-primary" /> Job Match Analysis
          </DialogTitle>
          <DialogDescription>
            Paste a job description below to see how well your resume matches.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[150px] text-sm"
            disabled={isLoading}
          />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p>Analyzing... this may take a moment.</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4">
            <div className="flex justify-center">
                <div className="relative h-32 w-32">
                    <svg className="h-full w-full" viewBox="0 0 36 36">
                        <path
                        className="text-muted/20"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        />
                        <path
                        className="text-primary"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${result.matchScore}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-foreground">{result.matchScore}</span>
                        <Percent className="h-6 w-6 text-muted-foreground" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-accent" />Strengths</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{result.strengths}</p>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-destructive" />Missing Skills</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{result.missingSkills}</p>
                </div>
            </div>
             <div className="space-y-2 text-sm">
                <h3 className="font-semibold flex items-center gap-2"><ZoomIn className="h-4 w-4 text-primary" />Improvement Suggestions</h3>
                <p className="text-muted-foreground whitespace-pre-line">{result.improvementSuggestions}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleMatch} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Matching...
              </>
            ) : (
              'Match Resume'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
