'use server';
/**
 * @fileOverview A conversational chatbot for providing resume advice.
 *
 * This file is designated as a "use server" module, meaning it's treated as a server-side
 * API endpoint by Next.js. As such, it can only export async functions that will be
 * callable from client components.
 *
 * We are defining the Zod schemas and types in another file (`resume-chatbot-types.ts`)
 * to keep this file clean and compliant with the "use server" directive.
 *
 * - resumeChatbot - An async function that handles the chatbot conversation.
 */

import { ai } from '@/ai/genkit';
import {
  ResumeChatbotInputSchema,
  ResumeChatbotOutputSchema,
  type ResumeChatbotInput,
  type ResumeChatbotOutput,
} from './resume-chatbot-types';

/**
 * Handles the chatbot conversation by taking history and returning the model's response.
 * This is the only function exported from this server module.
 * @param input - The conversation history.
 * @returns The chatbot's response as a string.
 */
export async function resumeChatbot(
  input: ResumeChatbotInput
): Promise<ResumeChatbotOutput> {
  return resumeChatbotFlow(input);
}

// Define the prompt for the chatbot.
const resumeChatbotPrompt = ai.definePrompt(
  {
    name: 'resumeChatbotPrompt',
    input: { schema: ResumeChatbotInputSchema },
    output: { format: 'text' },
    prompt: `You are a helpful and friendly AI resume assistant. Your goal is to provide clear, concise, and actionable advice to users asking for help with their resumes.

    Here is the conversation history:
    {{#each history}}
    {{role}}: {{content}}
    {{/each}}
    
    Based on the history, provide a helpful response to the user's latest message.`,
  }
);

// Define the Genkit flow that orchestrates the chatbot logic.
const resumeChatbotFlow = ai.defineFlow(
  {
    name: 'resumeChatbotFlow',
    inputSchema: ResumeChatbotInputSchema,
    outputSchema: ResumeChatbotOutputSchema,
  },
  async (input) => {
    const { text } = await resumeChatbotPrompt(input);
    return text;
  }
);
