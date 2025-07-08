// src/ai/flows/survey-insights-inference.ts
'use server';

/**
 * @fileOverview Infers psychological insights from user survey data and past conversations to provide personalized support.
 *
 * - inferSurveyInsights - A function that infers insights from survey data and past messages.
 * - SurveyInsightsInput - The input type for the inferSurveyInsights function.
 * - SurveyInsightsOutput - The return type for the inferSurveyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SurveyDataSchema = z.object({
  healthStatus: z.string().describe('The health status of the user.'),
  dailyLifeChallenges: z.string().describe('Challenges the user faces in daily life.'),
  helpSeekingBarriers: z.string().describe('Barriers preventing the user from seeking help.'),
});

const MessageSchema = z.object({
  sender: z.enum(['user', 'ai']).describe('The sender of the message.'),
  content: z.string().describe('The content of the message.'),
});

const SurveyInsightsInputSchema = z.object({
  surveyData: SurveyDataSchema.describe('The user survey data.'),
  pastMessages: z.array(MessageSchema).describe('Past conversation messages between the user and the AI.'),
});
export type SurveyInsightsInput = z.infer<typeof SurveyInsightsInputSchema>;

const SurveyInsightsOutputSchema = z.object({
  psychologicalInsights: z.string().describe('Psychological insights inferred from the survey data and past conversations.'),
  suggestedSupport: z.string().describe('Suggested support and guidance based on the inferred insights.'),
});
export type SurveyInsightsOutput = z.infer<typeof SurveyInsightsOutputSchema>;

export async function inferSurveyInsights(input: SurveyInsightsInput): Promise<SurveyInsightsOutput> {
  return inferSurveyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'surveyInsightsPrompt',
  input: {schema: SurveyInsightsInputSchema},
  output: {schema: SurveyInsightsOutputSchema},
  prompt: `You are an AI psychological support tool.

You will receive user survey data and past conversation messages.
Your goal is to infer psychological insights from this information and provide relevant support and guidance.

Survey Data:
Health Status: {{{surveyData.healthStatus}}}
Daily Life Challenges: {{{surveyData.dailyLifeChallenges}}}
Help Seeking Barriers: {{{surveyData.helpSeekingBarriers}}}

Past Messages:
{{#each pastMessages}}
  {{this.sender}}: {{this.content}}
{{/each}}

Based on the survey data and past messages, infer the user's psychological state and suggest appropriate support and guidance.
Include specific reasons based on the data provided.

Psychological Insights: (Provide detailed insights)
Suggested Support: (Provide specific and actionable guidance)
`,
});

const inferSurveyInsightsFlow = ai.defineFlow(
  {
    name: 'inferSurveyInsightsFlow',
    inputSchema: SurveyInsightsInputSchema,
    outputSchema: SurveyInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
