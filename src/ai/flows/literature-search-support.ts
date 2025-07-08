'use server';

/**
 * @fileOverview Implements the LiteratureSearchSupport flow, allowing the AI to search psychological literature.
 *
 * - literatureSearchSupport - A function that triggers the literature search and returns the findings.
 * - LiteratureSearchSupportInput - The input type for the literatureSearchSupport function.
 * - LiteratureSearchSupportOutput - The return type for the literatureSearchSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LiteratureSearchSupportInputSchema = z.object({
  query: z.string().describe('The query to search the psychological literature for.'),
});
export type LiteratureSearchSupportInput = z.infer<typeof LiteratureSearchSupportInputSchema>;

const LiteratureSearchSupportOutputSchema = z.object({
  results: z.string().describe('The search results from the psychological literature.'),
});
export type LiteratureSearchSupportOutput = z.infer<typeof LiteratureSearchSupportOutputSchema>;

export async function literatureSearchSupport(input: LiteratureSearchSupportInput): Promise<LiteratureSearchSupportOutput> {
  return literatureSearchSupportFlow(input);
}

const literatureSearchSupportPrompt = ai.definePrompt({
  name: 'literatureSearchSupportPrompt',
  input: {schema: LiteratureSearchSupportInputSchema},
  output: {schema: LiteratureSearchSupportOutputSchema},
  prompt: `You are an AI assistant designed to search psychological literature and provide guidance based on the search results. Given the user's query, search the literature and provide relevant information.

Query: {{{query}}}`,
});

const literatureSearchSupportFlow = ai.defineFlow(
  {
    name: 'literatureSearchSupportFlow',
    inputSchema: LiteratureSearchSupportInputSchema,
    outputSchema: LiteratureSearchSupportOutputSchema,
  },
  async input => {
    const {output} = await literatureSearchSupportPrompt(input);
    return output!;
  }
);
