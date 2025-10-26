'use server';
/**
 * @fileOverview Parses resume text into a structured JSON format.
 *
 * This file is designated as a "use server" module. It only exports the main
 * async function `parseResumeFromText` to be used as a Next.js Server Action.
 * Type definitions are kept in `parse-resume-from-text-types.ts`.
 *
 * - parseResumeFromText - An async function that handles the resume parsing process.
 */

import { ai } from '@/ai/genkit';
import {
  ParseResumeFromTextInputSchema,
  ParseResumeFromTextOutputSchema,
  type ParseResumeFromTextInput,
  type ParseResumeFromTextOutput,
} from './parse-resume-from-text-types';

export async function parseResumeFromText(
  input: ParseResumeFromTextInput
): Promise<ParseResumeFromTextOutput> {
  return parseResumeFromTextFlow(input);
}

const parseResumePrompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: { schema: ParseResumeFromTextInputSchema },
  output: { schema: ParseResumeFromTextOutputSchema },
  prompt: `You are an expert resume parser. Your task is to analyze the following resume text and extract the information into a structured JSON format.

  **Instructions:**
  1.  **Identify Sections:** First, identify the different sections of the resume, such as "Personal Information", "Summary" or "Objective", "Experience" or "Work History", "Education", and "Skills". The section headings might vary.
  2.  **Extract Personal Information:** Extract the full name, email, phone number, location, and any personal website or portfolio links. This is usually at the top.
  3.  **Extract Summary:** Identify and extract the professional summary or objective statement. If no explicit summary is present, look for an introductory paragraph that describes the person's goals or high-level experience. If there is no summary or objective, leave the field empty.
  4.  **Extract Work Experience:** For each job listed, extract the job title, company name, location, dates of employment, and the description of responsibilities and achievements. Each job should be a separate object in the 'experience' array.
  5.  **Extract Education:** For each educational entry, extract the degree, school name, location, and dates of attendance. Each entry should be a separate object in the 'education' array.
  6.  **Extract Skills:** Compile a list of all mentioned skills. These might be in a dedicated "Skills" section or mentioned throughout the resume. Create a flat array of strings for the skills.
  7.  **Handle Missing Information:** If a piece of information is not present in the resume text, return an empty string or an empty array for the corresponding field. Do not invent information. For example, if there is no 'experience' section, the 'experience' array should be empty.

  Resume Text:
  {{resumeText}}
`,
});

const parseResumeFromTextFlow = ai.defineFlow(
  {
    name: 'parseResumeFromTextFlow',
    inputSchema: ParseResumeFromTextInputSchema,
    outputSchema: ParseResumeFromTextOutputSchema,
  },
  async (input) => {
    const { output } = await parseResumePrompt(input);
    return output!;
  }
);
