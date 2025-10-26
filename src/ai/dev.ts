import { config } from 'dotenv';
config();

import '@/ai/flows/match-resume-to-job-description.ts';
import '@/ai/flows/analyze-resume-for-improvements.ts';
import '@/ai/flows/parse-resume-from-text.ts';
import '@/ai/flows/resume-chatbot.ts';
import '@/ai/flows/parse-resume-from-text-types.ts';