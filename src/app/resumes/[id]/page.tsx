'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Printer, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { type Resume } from '@/components/dashboard-client';
import ResumeForm from '@/components/resume-form';
import ResumePreview from '@/components/resume-preview';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

const newResumeTemplate: Omit<Resume, 'id'> = {
  title: 'Untitled Resume',
  updatedAt: new Date().toISOString(),
  content: {
    personal: { name: '', email: '', phone: '', location: '', website: '' },
    summary: '',
    experience: [{ title: '', company: '', location: '', dates: '', description: '' }],
    education: [{ degree: '', school: '', location: '', dates: '' }],
    skills: [],
  },
};

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;
  const { toast } = useToast();
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [resume, setResume] = useState<Resume | Omit<Resume, 'id'> | null>(null);
  const printTriggered = useRef(false);

  const isNewResume = id === 'new';

  const resumeRef = useMemoFirebase(() => 
    !isNewResume && user ? doc(firestore, 'users', user.uid, 'resumes', id as string) : null,
  [firestore, user, id, isNewResume]);

  const { data: fetchedResume, isLoading: isDocLoading } = useDoc<Resume>(resumeRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (isNewResume) {
      setResume(newResumeTemplate);
    } else if (fetchedResume) {
      setResume(fetchedResume);
    }
  }, [id, isNewResume, fetchedResume]);

  const handlePrint = () => {
    window.print();
  };

  useLayoutEffect(() => {
    if (searchParams.get('download') === 'true' && resume && !printTriggered.current) {
      printTriggered.current = true; // Prevents re-triggering
      // A small timeout ensures the component has rendered before printing
      setTimeout(() => {
        handlePrint();
        // Clean up the URL after printing
        router.replace(`/resumes/${id}`);
      }, 100);
    }
  }, [resume, searchParams, router, id]);


  const handleSave = async () => {
    if (!user || !resume) return;

    const resumeData = {
      ...resume,
      updatedAt: new Date().toISOString(),
    };
    
    if (isNewResume) {
      if (!firestore) return;
      const collectionRef = collection(firestore, 'users', user.uid, 'resumes');
      addDoc(collectionRef, resumeData)
        .then(newDocRef => {
          toast({
            title: 'Resume Created!',
            description: `"${resume.title}" has been saved.`,
          });
          router.replace(`/resumes/${newDocRef.id}`);
        })
        .catch(error => {
            const contextualError = new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: resumeData
            });
            errorEmitter.emit('permission-error', contextualError);
        });

    } else if ('id' in resume) {
      if (!firestore) return;
      const docRef = doc(firestore, 'users', user.uid, 'resumes', resume.id);
      setDoc(docRef, resumeData, { merge: true })
        .then(() => {
            toast({
              title: 'Resume Saved!',
              description: `"${resume.title}" has been saved.`,
            });
        })
        .catch(error => {
            const contextualError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: resumeData
            });
            errorEmitter.emit('permission-error', contextualError);
        });
    }
  };
  
  const isLoading = isUserLoading || isDocLoading;

  if (isLoading) {
     return (
      <div className="flex h-screen items-center justify-center">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Resume not found</h2>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.14))]">
       <div className="flex-shrink-0 bg-background/80 backdrop-blur-lg border-b border-border print:hidden">
         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Button variant="ghost" asChild>
                <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back</Link>
            </Button>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Export PDF</Button>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/> Save</Button>
            </div>
         </div>
       </div>

      <div className="flex-grow grid md:grid-cols-2 overflow-hidden print:block">
        <div className="overflow-y-auto no-scrollbar print:hidden">
          <ResumeForm resume={resume as Resume} setResume={setResume as any} />
        </div>
        <div className="overflow-y-auto bg-muted/20 print:overflow-visible print:bg-transparent md:block">
           <div id="resume-preview-container" className="p-8">
             <ResumePreview resume={resume as Resume} />
           </div>
        </div>
      </div>
    </div>
  );
}
