'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, ClipboardPaste, FileText } from 'lucide-react';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { type Resume } from '@/components/dashboard-client';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { parseResumeFromText } from '@/ai/flows/parse-resume-from-text';
import { type ParseResumeFromTextOutput } from '@/ai/flows/parse-resume-from-text-types';

function ImportResumePageContents() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [pastedText, setPastedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const mode = searchParams.get('type') || 'paste';

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleCreateResume = async (resumeText: string, title: string) => {
    if (!user) return;
    setIsLoading(true);

    try {
      // 1. Parse the resume text with AI
      const parsedContent = await parseResumeFromText({ resumeText });

      // 2. Create the new resume object with the parsed content
      const newResume: Omit<Resume, 'id'> = {
        title: title,
        updatedAt: new Date().toISOString(),
        content: parsedContent,
      };

      // 3. Save to Firestore
      const collectionRef = collection(firestore, 'users', user.uid, 'resumes');
      const newDocRef = await addDoc(collectionRef, newResume);

      toast({
        title: 'Resume Imported!',
        description: 'Your resume has been parsed and saved.',
      });
      router.push(`/dashboard?analyze=${newDocRef.id}`);

    } catch (error: any) {
      console.error("Error creating resume:", error);
      // Check if it's a Firestore permission error
      if (error.name === 'FirebaseError' && error.code === 'permission-denied') {
        const collectionRef = collection(firestore, 'users', user.uid, 'resumes');
        const contextualError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: { title, content: '...' }, // Don't log full content
        });
        errorEmitter.emit('permission-error', contextualError);
      } else {
        toast({
            title: 'Import Failed',
            description: error.message || 'Could not parse or save the resume. Please try again.',
            variant: 'destructive',
        });
      }
      setIsLoading(false);
    }
  };

  const handlePasteAndAnalyze = async () => {
    if (!pastedText.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please paste your resume content into the text area.',
        variant: 'destructive',
      });
      return;
    }
    await handleCreateResume(pastedText, 'Pasted Resume');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
        toast({
            title: 'File Required',
            description: 'Please select a PDF file to upload.',
            variant: 'destructive',
        });
        return;
    }

    setIsLoading(true);
    try {
        const text = await extractTextFromPDF(selectedFile);
        await handleCreateResume(text, selectedFile.name.replace('.pdf', ''));
    } catch (error) {
        console.error("Error processing PDF:", error);
        toast({
            title: 'PDF Processing Failed',
            description: 'Could not extract text from the PDF. The file might be corrupted or image-based.',
            variant: 'destructive',
        });
        setIsLoading(false);
    }
  };


  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {mode === 'paste' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ClipboardPaste /> Paste & Analyze</CardTitle>
              <CardDescription>
                Paste the full content of your resume below. The AI will structure it and provide feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your resume content here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="min-h-[300px] text-sm"
                disabled={isLoading}
              />
            </CardContent>
            <CardContent>
              <Button onClick={handlePasteAndAnalyze} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Save and Analyze'
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload /> Upload & Analyze</CardTitle>
              <CardDescription>
                Upload your resume (PDF). The AI will extract the text, structure it, and provide feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume-file">Resume File (PDF only)</Label>
                <Input id="resume-file" type="file" onChange={handleFileChange} accept=".pdf" disabled={isLoading} />
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted text-sm">
                  <FileText className="h-5 w-5 shrink-0"/>
                  <span className="truncate">{selectedFile.name}</span>
                </div>
              )}
              <Button onClick={handleUploadAndAnalyze} disabled={isLoading || !selectedFile} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading & Analyzing...
                  </>
                ) : (
                  'Upload and Analyze'
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


export default function ImportResumePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <ImportResumePageContents />
        </Suspense>
    )
}
