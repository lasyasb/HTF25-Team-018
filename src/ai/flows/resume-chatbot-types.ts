import { z } from 'genkit';

/**
 * @fileOverview Type definitions for the resume chatbot.
 *
 * This file contains the Zod schemas and TypeScript types for the chatbot functionality.
 * Separating types from the "use server" file allows us to import them in both
 * client and server components without breaking Next.js rules.
 */

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ResumeChatbotInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
});
export type ResumeChatbotInput = z.infer<typeof ResumeChatbotInputSchema>;

export const ResumeChatbotOutputSchema = z.string().describe("The chatbot's response.");
export type ResumeChatbotOutput = z.infer<typeof ResumeChatbotOutputSchema>;
