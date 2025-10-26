import { type Resume } from '@/components/dashboard-client';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume | Omit<Resume, 'id'>;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const { personal, summary, experience, education, skills } = resume.content;
  
  return (
    <div className="bg-white text-black shadow-2xl shadow-primary/10 rounded-lg p-8 A4-ratio print:shadow-none print:rounded-none">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview-container, #resume-preview-container * {
            visibility: visible;
          }
          #resume-preview-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
          }
          .A4-ratio {
            width: 210mm;
            min-height: 297mm;
            box-shadow: none !important;
            border-radius: 0 !important;
            background-color: white !important;
            color: black !important;
          }
          .text-primary {
             color: hsl(var(--primary)) !important;
          }
           .text-accent {
             color: hsl(var(--accent)) !important;
          }
          .text-muted-foreground {
              color: #6b7280 !important;
          }
          .border-accent\/30 {
              border-color: hsla(var(--accent), 0.3) !important;
          }
           .bg-secondary {
              background-color: hsl(var(--secondary)) !important;
           }
           .text-secondary-foreground {
              color: hsl(var(--secondary-foreground)) !important;
           }
        }
      `}</style>
      <header className="text-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-4xl font-bold font-headline text-primary">{personal.name || 'Your Name'}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2 flex-wrap">
          {personal.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{personal.phone}</span>}
          {personal.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{personal.location}</span>}
          {personal.website && <a href={personal.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary"><Globe className="h-3 w-3" />{personal.website}</a>}
        </div>
      </header>
      
      <main className="space-y-6">
        <section>
          <h2 className="text-xl font-bold font-headline text-accent mb-2 border-b border-accent/30 pb-1">Summary</h2>
          <p className="text-sm text-gray-600">{summary || 'A brief professional summary about yourself.'}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-accent mb-2 border-b border-accent/30 pb-1">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{exp.title || 'Job Title'}</h3>
                  <span className="text-xs text-gray-500">{exp.dates || 'Date Range'}</span>
                </div>
                <div className="flex justify-between items-baseline text-gray-600">
                    <p>{exp.company || 'Company Name'}</p>
                    <p className="text-xs">{exp.location || 'Location'}</p>
                </div>
                <ul className="list-disc list-inside mt-1 text-gray-500/80 text-xs space-y-1">
                  {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-accent mb-2 border-b border-accent/30 pb-1">Education</h2>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{edu.degree || 'Degree'}</h3>
                  <span className="text-xs text-gray-500">{edu.dates || 'Date Range'}</span>
                </div>
                <div className="flex justify-between items-baseline text-gray-600">
                    <p>{edu.school || 'School Name'}</p>
                    <p className="text-xs">{edu.location || 'Location'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-accent mb-2 border-b border-accent/30 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.filter(s => s).map((skill, index) => (
              <span key={index} className="bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
