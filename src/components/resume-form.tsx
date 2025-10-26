'use client';

import { type Dispatch, type SetStateAction } from 'react';
import { type Resume } from '@/components/dashboard-client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ResumeFormProps {
  resume: Resume | Omit<Resume, 'id'>;
  setResume: Dispatch<SetStateAction<Resume | Omit<Resume, 'id'> | null>>;
}

export default function ResumeForm({ resume, setResume }: ResumeFormProps) {
    
  const handleContentChange = <T extends keyof Resume['content']>(section: T, value: Resume['content'][T]) => {
    setResume(prev => prev ? { ...prev, content: { ...prev.content, [section]: value } } : null);
  };
  
  const handlePersonalChange = (field: keyof Resume['content']['personal'], value: string) => {
    handleContentChange('personal', { ...resume.content.personal, [field]: value });
  };

  const handleExperienceChange = (index: number, field: keyof Resume['content']['experience'][0], value: string) => {
    const newExperience = [...resume.content.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    handleContentChange('experience', newExperience);
  };

  const addExperience = () => {
    handleContentChange('experience', [...resume.content.experience, { title: '', company: '', location: '', dates: '', description: '' }]);
  };

  const removeExperience = (index: number) => {
    handleContentChange('experience', resume.content.experience.filter((_, i) => i !== index));
  };
  
  const handleEducationChange = (index: number, field: keyof Resume['content']['education'][0], value: string) => {
    const newEducation = [...resume.content.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    handleContentChange('education', newEducation);
  };
  
  const addEducation = () => {
    handleContentChange('education', [...resume.content.education, { degree: '', school: '', location: '', dates: '' }]);
  };

  const removeEducation = (index: number) => {
    handleContentChange('education', resume.content.education.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
        <div>
            <Label htmlFor="resume-title">Resume Title</Label>
            <Input 
                id="resume-title"
                value={resume.title}
                onChange={(e) => setResume(prev => prev ? {...prev, title: e.target.value} : null)}
                className="text-lg font-bold"
            />
        </div>
      <Accordion type="multiple" defaultValue={['personal', 'summary']} className="w-full">
        
        <AccordionItem value="personal">
          <AccordionTrigger className="font-headline">Personal Details</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={resume.content.personal.name} onChange={e => handlePersonalChange('name', e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" value={resume.content.personal.email} onChange={e => handlePersonalChange('email', e.target.value)} /></div>
                <div><Label>Phone Number</Label><Input value={resume.content.personal.phone} onChange={e => handlePersonalChange('phone', e.target.value)} /></div>
                <div><Label>Location</Label><Input value={resume.content.personal.location} onChange={e => handlePersonalChange('location', e.target.value)} /></div>
            </div>
             <div><Label>Website / Portfolio</Label><Input value={resume.content.personal.website} onChange={e => handlePersonalChange('website', e.target.value)} /></div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="summary">
          <AccordionTrigger className="font-headline">Professional Summary</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
             <Textarea value={resume.content.summary} onChange={e => handleContentChange('summary', e.target.value)} className="min-h-[120px]" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger className="font-headline">Work Experience</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {resume.content.experience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-md relative space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Job Title</Label><Input value={exp.title} onChange={e => handleExperienceChange(index, 'title', e.target.value)} /></div>
                        <div><Label>Company</Label><Input value={exp.company} onChange={e => handleExperienceChange(index, 'company', e.target.value)} /></div>
                        <div><Label>Location</Label><Input value={exp.location} onChange={e => handleExperienceChange(index, 'location', e.target.value)} /></div>
                        <div><Label>Dates</Label><Input value={exp.dates} onChange={e => handleExperienceChange(index, 'dates', e.target.value)} /></div>
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea value={exp.description} onChange={e => handleExperienceChange(index, 'description', e.target.value)} className="min-h-[100px]" />
                    </div>
                     <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            ))}
            <Button variant="outline" onClick={addExperience}><Plus className="mr-2 h-4 w-4"/>Add Experience</Button>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="education">
          <AccordionTrigger className="font-headline">Education</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {resume.content.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-md relative space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Degree / Certificate</Label><Input value={edu.degree} onChange={e => handleEducationChange(index, 'degree', e.target.value)} /></div>
                        <div><Label>School / Institution</Label><Input value={edu.school} onChange={e => handleEducationChange(index, 'school', e.target.value)} /></div>
                        <div><Label>Location</Label><Input value={edu.location} onChange={e => handleEducationChange(index, 'location', e.target.value)} /></div>
                        <div><Label>Dates</Label><Input value={edu.dates} onChange={e => handleEducationChange(index, 'dates', e.target.value)} /></div>
                    </div>
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            ))}
             <Button variant="outline" onClick={addEducation}><Plus className="mr-2 h-4 w-4"/>Add Education</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger className="font-headline">Skills</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Label>Skills (comma separated)</Label>
            <Textarea value={resume.content.skills.join(', ')} onChange={e => handleContentChange('skills', e.target.value.split(',').map(s => s.trim()))} />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
