'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  analyzeResumeForImprovements,
  type AnalyzeResumeForImprovementsOutput,
} from '@/ai/flows/analyze-resume-for-improvements';
import { Award, BookCheck, Bot, CheckCircle, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';

interface AnalysisModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resumeText: string;
}

export default function AnalysisModal({
  isOpen,
  onOpenChange,
  resumeText,
}: AnalysisModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResumeForImprovementsOutput | null>(null);
  const [sectionToRewrite, setSectionToRewrite] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !result) {
      handleAnalysis();
    }
    if (!isOpen) {
      // Reset state on close
       setTimeout(() => {
        setResult(null);
        setIsLoading(false);
        setSectionToRewrite('');
        setIsRewriting(false);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleAnalysis = async (section?: string) => {
    if (section) {
        setIsRewriting(true);
    } else {
        setIsLoading(true);
        setResult(null);
    }

    try {
      const response = await analyzeResumeForImprovements({
        resumeText: resumeText,
        ...(section && { sectionToRewrite: section }),
      });
      setResult(prev => ({...(prev || {}), ...response}));
      if (response.rewrittenSection) {
          toast({
              title: "Section Rewritten!",
              description: "The AI has provided a new version of your section."
          })
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred during the analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRewriting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> AI Resume Analysis
          </DialogTitle>
          <DialogDescription>
            Get instant feedback on your resume to improve its impact.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p>Performing AI analysis... please wait.</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1 pr-4">
            <div className="space-y-2 text-sm">
                <h3 className="font-semibold flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" />Overall Feedback</h3>
                <p className="text-muted-foreground whitespace-pre-line">{result.overallFeedback}</p>
            </div>
             <div className="space-y-2 text-sm">
                <h3 className="font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-accent" />Skills Gap Analysis</h3>
                <p className="text-muted-foreground whitespace-pre-line">{result.skillsGapAnalysis}</p>
            </div>
             <div className="space-y-2 text-sm">
                <h3 className="font-semibold flex items-center gap-2"><BookCheck className="h-4 w-4 text-accent" />Suggested Actions</h3>
                <p className="text-muted-foreground whitespace-pre-line">{result.suggestedActions}</p>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-lg"><Wand2 className="h-5 w-5 text-primary" />Rewrite a Section</h3>
                <p className="text-sm text-muted-foreground">
                    Copy and paste a section of your resume below (e.g., a job description or summary) and let the AI rewrite it for you.
                </p>
                <Textarea 
                    placeholder="Paste section here..."
                    value={sectionToRewrite}
                    onChange={e => setSectionToRewrite(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isRewriting}
                />
                 <Button onClick={() => handleAnalysis(sectionToRewrite)} disabled={!sectionToRewrite.trim() || isRewriting}>
                    {isRewriting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4" />}
                    {isRewriting ? 'Rewriting...' : 'Rewrite with AI'}
                </Button>

                {result.rewrittenSection && (
                    <div className="p-4 border border-dashed border-accent rounded-md bg-accent/10">
                        <h4 className="font-semibold mb-2">AI Suggestion:</h4>
                        <p className="text-muted-foreground whitespace-pre-line text-sm">{result.rewrittenSection}</p>
                    </div>
                )}
            </div>

          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
