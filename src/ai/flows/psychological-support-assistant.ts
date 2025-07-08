// src/ai/flows/psychological-support-assistant.ts
'use server';
/**
 * @fileOverview An AI-powered psychological support assistant.
 *
 * - psychologicalSupportAssistant - A function that provides psychological support based on user survey data and conversations.
 * - PsychologicalSupportAssistantInput - The input type for the psychologicalSupportAssistant function.
 * - PsychologicalSupportAssistantOutput - The return type for the psychologicalSupportAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PsychologicalSupportAssistantInputSchema = z.object({
  surveyData: z.string().describe('The user survey data.'),
  conversationHistory: z.string().describe('The conversation history with the user.'),
  userMessage: z.string().describe('The latest user message.'),
});
export type PsychologicalSupportAssistantInput = z.infer<typeof PsychologicalSupportAssistantInputSchema>;

const PsychologicalSupportAssistantOutputSchema = z.object({
  aiResponse: z.string().describe('The AI response to the user message.'),
  psychologicalInsights: z.string().describe('Psychological insights inferred from the user data and conversation.'),
});
export type PsychologicalSupportAssistantOutput = z.infer<typeof PsychologicalSupportAssistantOutputSchema>;

export async function psychologicalSupportAssistant(
  input: PsychologicalSupportAssistantInput
): Promise<PsychologicalSupportAssistantOutput> {
  return psychologicalSupportAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'psychologicalSupportAssistantPrompt',
  input: {schema: PsychologicalSupportAssistantInputSchema},
  output: {schema: PsychologicalSupportAssistantOutputSchema},
  prompt: `You are an AI-powered psychological support assistant.

You will use the survey data and conversation history to provide personalized guidance and insights to the user.

Survey Data: {{{surveyData}}}

Conversation History: {{{conversationHistory}}}

User Message: {{{userMessage}}}

Respond to the user message with a supportive and helpful message. Also, infer any psychological insights from the user data and conversation.

Format your response as follows:

AI Response: <AI response to the user message>
Psychological Insights: <Psychological insights inferred from the user data and conversation>`,
});

const psychologicalSupportAssistantFlow = ai.defineFlow(
  {
    name: 'psychologicalSupportAssistantFlow',
    inputSchema: PsychologicalSupportAssistantInputSchema,
    outputSchema: PsychologicalSupportAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
