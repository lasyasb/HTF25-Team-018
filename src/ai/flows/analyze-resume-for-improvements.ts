// @ts-nocheck
'use server';
/**
 * @fileOverview Analyzes a resume for potential improvements using AI.
 *
 * - analyzeResumeForImprovements - A function that analyzes the resume.
 * - AnalyzeResumeForImprovementsInput - The input type for the analyzeResumeForImprovements function.
 * - AnalyzeResumeForImprovementsOutput - The return type for the analyzeResumeForImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeForImprovementsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be analyzed.'),
  sectionToRewrite: z
    .string()
    .optional()
    .describe('Optional: A specific section of the resume to rewrite.'),
});
export type AnalyzeResumeForImprovementsInput = z.infer<
  typeof AnalyzeResumeForImprovementsInputSchema
>;

const AnalyzeResumeForImprovementsOutputSchema = z.object({
  overallFeedback: z
    .string()
    .describe('Overall feedback on the resume, including spelling, clarity, and formatting.'),
  skillsGapAnalysis: z
    .string()
    .describe('Analysis of skills gaps and suggestions for improvement.'),
  suggestedActions: z
    .string()
    .describe('Suggested actions or revisions to improve the resume.'),
  rewrittenSection: z
    .string()
    .optional()
    .describe('The rewritten section of the resume, if requested.'),
});
export type AnalyzeResumeForImprovementsOutput = z.infer<
  typeof AnalyzeResumeForImprovementsOutputSchema
>;

export async function analyzeResumeForImprovements(
  input: AnalyzeResumeForImprovementsInput
): Promise<AnalyzeResumeForImprovementsOutput> {
  return analyzeResumeForImprovementsFlow(input);
}

const rewriteSection = ai.defineTool({
  name: 'rewriteSection',
  description: 'Rewrites a specific section of the resume to improve its quality.',
  inputSchema: z.object({
    resumeText: z.string().describe('The entire text of the resume.'),
    sectionToRewrite: z
      .string()
      .describe('The specific section of the resume to rewrite.'),
  }),
  outputSchema: z.string().describe('The rewritten section of the resume.'),
},
async (input) => {
  // Just return the value, the LLM will do the actual rewriting.
  // No actual rewrite logic here, this is handled by the LLM.
  return input.sectionToRewrite;
});

const analyzeResumeForImprovementsPrompt = ai.definePrompt({
  name: 'analyzeResumeForImprovementsPrompt',
  input: {schema: AnalyzeResumeForImprovementsInputSchema},
  output: {schema: AnalyzeResumeForImprovementsOutputSchema},
  tools: [rewriteSection],
  prompt: `You are an AI resume expert providing feedback on a resume.

  Analyze the following resume and provide feedback on spelling, clarity, and formatting.
  Identify any skills gaps and suggest actions to improve the resume.

  Resume:
  {{resumeText}}

  {% if sectionToRewrite %}
  The user has requested that you rewrite the following section:
  {{sectionToRewrite}}
  Use the rewriteSection tool to rewrite the section.
  {% endif %}

  Make sure to fill out all the fields in the output schema. Be specific, and concise.
  `, // Ensure all fields are populated
});

const analyzeResumeForImprovementsFlow = ai.defineFlow(
  {
    name: 'analyzeResumeForImprovementsFlow',
    inputSchema: AnalyzeResumeForImprovementsInputSchema,
    outputSchema: AnalyzeResumeForImprovementsOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumeForImprovementsPrompt(input);
    return output!;
  }
);
