import { type Resume } from "@/components/dashboard-client";

export const fullResumeText = (resume: Resume | null): string => {
    if (!resume) return '';
    const { personal, summary, experience, education, skills } = resume.content;
    const experienceText = experience.map(exp => `Title: ${exp.title}\nCompany: ${exp.company}\nLocation: ${exp.location}\nDates: ${exp.dates}\nDescription:\n${exp.description}`).join('\n\n');
    const educationText = education.map(edu => `Degree: ${edu.degree}\nSchool: ${edu.school}\nLocation: ${edu.location}\nDates: ${edu.dates}`).join('\n\n');
    
    // Handle cases where personal info might be null or undefined
    const personalDetails = [
      personal.name ? `Name: ${personal.name}` : '',
      personal.email ? `Email: ${personal.email}` : '',
      personal.phone ? `Phone: ${personal.phone}` : '',
      personal.location ? `Location: ${personal.location}` : '',
      personal.website ? `Website: ${personal.website}` : ''
    ].filter(Boolean).join('\n');

    return `${personalDetails}\n\nSummary:\n${summary}\n\nExperience:\n${experienceText}\n\nEducation:\n${educationText}\n\nSkills:\n${skills.join(', ')}`;
}
