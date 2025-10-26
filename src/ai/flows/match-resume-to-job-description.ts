'use server';
/**
 * @fileOverview Matches a resume to a job description, providing a match score,
 * highlighting strengths and missing skills, and suggesting improvements.
 *
 * - matchResumeToJobDescription - A function that handles the resume matching process.
 * - MatchResumeToJobDescriptionInput - The input type for the matchResumeToJobDescription function.
 * - MatchResumeToJobDescriptionOutput - The return type for the matchResumeToJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchResumeToJobDescriptionInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be analyzed.'),
  jobDescriptionText: z
    .string()
    .describe('The text content of the job description to match against.'),
});
export type MatchResumeToJobDescriptionInput = z.infer<
  typeof MatchResumeToJobDescriptionInputSchema
>;

const MatchResumeToJobDescriptionOutputSchema = z.object({
  matchScore: z
    .number()
    .describe(
      'A numerical score (0-100) indicating how well the resume matches the job description.'
    ),
  strengths: z
    .string()
    .describe('Key strengths of the resume in relation to the job description.'),
  missingSkills: z
    .string()
    .describe('Skills missing from the resume that are required in the job description.'),
  improvementSuggestions: z
    .string()
    .describe('Suggestions for improving the resume to better match the job description.'),
});
export type MatchResumeToJobDescriptionOutput = z.infer<
  typeof MatchResumeToJobDescriptionOutputSchema
>;

export async function matchResumeToJobDescription(
  input: MatchResumeToJobDescriptionInput
): Promise<MatchResumeToJobDescriptionOutput> {
  return matchResumeToJobDescriptionFlow(input);
}

const matchResumeToJobDescriptionPrompt = ai.definePrompt({
  name: 'matchResumeToJobDescriptionPrompt',
  input: {schema: MatchResumeToJobDescriptionInputSchema},
  output: {schema: MatchResumeToJobDescriptionOutputSchema},
  prompt: `You are an AI resume analyst. You will receive a resume and a job description. 
Your task is to compare the resume against the job description and provide a match score (0-100), highlight strengths, missing skills, and improvement suggestions.

Resume:
{{resumeText}}

Job Description:
{{jobDescriptionText}}

Provide your analysis in the following format:
Match Score: [score]
Strengths: [strengths]
Missing Skills: [missing skills]
Improvement Suggestions: [suggestions]`,
});

const matchResumeToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'matchResumeToJobDescriptionFlow',
    inputSchema: MatchResumeToJobDescriptionInputSchema,
    outputSchema: MatchResumeToJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await matchResumeToJobDescriptionPrompt(input);
    return output!;
  }
);
