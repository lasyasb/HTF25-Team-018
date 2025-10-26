import { z } from 'genkit';

/**
 * @fileOverview Type definitions for the resume parser flow.
 *
 * This file contains the Zod schemas and TypeScript types for the resume parsing functionality.
 * Separating types from the "use server" file allows them to be imported in both
 * client and server components without breaking Next.js rules.
 */

const PersonalInfoSchema = z.object({
  name: z.string().describe('Full name of the person.'),
  email: z.string().describe('Email address.'),
  phone: z.string().describe('Phone number.'),
  location: z.string().describe('City and state, e.g., San Francisco, CA.'),
  website: z.string().optional().describe('Personal website or portfolio URL.'),
});

const ExperienceSchema = z.object({
  title: z.string().describe('Job title.'),
  company: z.string().describe('Company name.'),
  location: z.string().describe('Company location.'),
  dates: z.string().describe('Employment dates (e.g., Jan 2020 - Present).'),
  description: z.string().describe('Bulleted or paragraph description of responsibilities and achievements.'),
});

const EducationSchema = z.object({
  degree: z.string().describe('Degree or certificate obtained.'),
  school: z.string().describe('Name of the school or institution.'),
  location: z.string().describe('Location of the school.'),
  dates: z.string().describe('Dates of attendance.'),
});

export const ParseResumeFromTextInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume.'),
});
export type ParseResumeFromTextInput = z.infer<typeof ParseResumeFromTextInputSchema>;

export const ParseResumeFromTextOutputSchema = z.object({
  personal: PersonalInfoSchema.describe('Personal contact information.'),
  summary: z.string().describe('The professional summary or objective statement.'),
  experience: z.array(ExperienceSchema).describe('A list of work experiences.'),
  education: z.array(EducationSchema).describe('A list of educational qualifications.'),
  skills: z.array(z.string()).describe('A list of skills.'),
});
export type ParseResumeFromTextOutput = z.infer<typeof ParseResumeFromTextOutputSchema>;
