'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResumeCard from '@/components/resume-card';
import JobMatchModal from '@/components/modals/job-match-modal';
import AnalysisModal from '@/components/modals/analysis-modal';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { fullResumeText } from '@/lib/resume-text';

// Define the Resume type based on Firestore structure
export interface Resume {
  id: string;
  title: string;
  updatedAt: string; // ISO string
  content: {
    personal: { name: string; email: string; phone: string; location: string; website: string; };
    summary: string;
    experience: { title: string; company: string; location: string; dates: string; description: string; }[];
    education: { degree: string; school: string; location: string; dates: string; }[];
    skills: string[];
  };
}

export default function DashboardClient() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const resumesQuery = useMemoFirebase(() => 
    user ? collection(firestore, 'users', user.uid, 'resumes') : null
  , [firestore, user]);

  const { data: resumes, isLoading: isResumesLoading } = useCollection<Resume>(resumesQuery);

  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isMatchModalOpen, setMatchModalOpen] = useState(false);
  const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
  
  // Check for analyze query param on load
  useEffect(() => {
    const analyzeId = searchParams.get('analyze');
    if (analyzeId && resumes) {
      const resumeToAnalyze = resumes.find(r => r.id === analyzeId);
      if (resumeToAnalyze) {
        handleOpenAnalysisModal(resumeToAnalyze);
        // Clean the URL
        router.replace('/dashboard', { scroll: false });
      }
    }
  }, [resumes, searchParams, router]);


  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleOpenMatchModal = (resume: Resume) => {
    setSelectedResume(resume);
    setMatchModalOpen(true);
  };

  const handleOpenAnalysisModal = (resume: Resume) => {
    setSelectedResume(resume);
    setAnalysisModalOpen(true);
  };

  const handleDeleteResume = async (id: string) => {
    if (!user) return;
    const docRef = doc(firestore, 'users', user.uid, 'resumes', id);
    deleteDoc(docRef)
        .then(() => {
            toast({ title: "Resume deleted" });
        })
        .catch(error => {
            const contextualError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete'
            });
            errorEmitter.emit('permission-error', contextualError);
        });
  };

  const handleDuplicateResume = async (resumeToDuplicate: Resume) => {
    if (!user) return;
    const newResumeData = {
      ...resumeToDuplicate,
      title: `${resumeToDuplicate.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    // remove id from data to be added
    const { id, ...dataToAdd } = newResumeData;
    
    if (resumesQuery) {
        addDoc(resumesQuery, dataToAdd)
            .then(() => {
                toast({ title: "Resume duplicated" });
            })
            .catch(error => {
                 const contextualError = new FirestorePermissionError({
                    path: resumesQuery.path,
                    operation: 'create',
                    requestResourceData: dataToAdd
                });
                errorEmitter.emit('permission-error', contextualError);
            });
    }
  };
  

  if (isUserLoading || isResumesLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Your Resumes</h1>
        <Button asChild>
          <Link href="/resumes/new">
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Link>
        </Button>
      </div>

      {resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onMatch={() => handleOpenMatchModal(resume)}
              onAnalyze={() => handleOpenAnalysisModal(resume)}
              onDelete={() => handleDeleteResume(resume.id)}
              onDuplicate={() => handleDuplicateResume(resume)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">You don&apos;t have any resumes yet.</p>
          <Button asChild variant="link" className="text-accent">
            <Link href="/resumes/new">Create your first resume</Link>
          </Button>
        </div>
      )}

      
        <>
          <JobMatchModal
            isOpen={isMatchModalOpen}
            onOpenChange={setMatchModalOpen}
            resume={selectedResume}
          />
          <AnalysisModal
            isOpen={isAnalysisModalOpen}
            onOpenChange={setAnalysisModalOpen}
            resumeText={fullResumeText(selectedResume)}
          />
        </>
      
    </>
  );
}
