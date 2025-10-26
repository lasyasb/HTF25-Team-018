import Link from 'next/link';
import { FileText, Sparkles, Crosshair, Download, Trash2, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Resume } from '@/components/dashboard-client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GlowingIconButton from './glowing-icon-button';

interface ResumeCardProps {
  resume: Resume;
  onAnalyze: () => void;
  onMatch: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ResumeCard({
  resume,
  onAnalyze,
  onMatch,
  onDelete,
  onDuplicate,
}: ResumeCardProps) {
  const lastUpdated = formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true });

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 relative holographic-sheen">
      <CardHeader>
         <Link href={`/resumes/${resume.id}`}>
          <div className="relative w-full h-40 rounded-md overflow-hidden mb-4 group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"/>
              <div className="absolute bottom-4 left-4">
                  <CardTitle className="font-headline text-primary-foreground truncate group-hover:text-primary transition-colors">{resume.title}</CardTitle>
                  <CardDescription className="text-primary-foreground/80">Updated {lastUpdated}</CardDescription>
              </div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-2 text-sm">{resume.content.summary || 'No summary available.'}</p>
      </CardContent>
      <Separator />
      <CardFooter className="p-2 grid grid-cols-6 gap-1">
        <Link href={`/resumes/${resume.id}`} className="col-span-1">
          <GlowingIconButton
            icon={FileText}
            tooltip="Edit"
          />
        </Link>
        <GlowingIconButton
          className="col-span-1"
          icon={Sparkles}
          tooltip="AI Analyze"
          onClick={onAnalyze}
        />
        <GlowingIconButton
          className="col-span-1"
          icon={Crosshair}
          tooltip="Job Match"
          onClick={onMatch}
        />
         <Link href={`/resumes/${resume.id}?download=true`} className="col-span-1">
            <GlowingIconButton
                icon={Download}
                tooltip="Download PDF"
            />
        </Link>
        <GlowingIconButton
          className="col-span-1"
          icon={Copy}
          tooltip="Duplicate"
          onClick={onDuplicate}
        />
        <GlowingIconButton
          className="col-span-1"
          icon={Trash2}
          tooltip="Delete"
          onClick={onDelete}
          variant='destructive'
        />
      </CardFooter>
    </Card>
  );
}
