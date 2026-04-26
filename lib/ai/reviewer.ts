import { ReviewResponse, ReviewRequest } from '@/types/review';
import { SYSTEM_PROMPT, ARCHITECTURAL_RULES_TEMPLATE } from './prompts';
import { processDiff } from '../utils/diff-processor';

export async function performArchitecturalReview(
  request: ReviewRequest
): Promise<ReviewResponse> {
  const { diff, policies = [] } = request;
  const processedDiff = processDiff(diff);
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable.');
  }

  const fullPrompt = `
    ${ARCHITECTURAL_RULES_TEMPLATE(policies)}
    
    ANALYSIS TARGET (GIT DIFF):
    ${processedDiff}
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using the latest high-reasoning model for architectural depth
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: fullPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2, // Low temperature for consistent architectural enforcement
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`AI Provider Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content) as ReviewResponse;

    return {
      ...result,
      status: 'success',
    };
  } catch (error: any) {
    console.error('Review Engine Error:', error);
    return {
      summary: 'An error occurred during the architectural review process.',
      architectural_health_score: 0,
      comments: [],
      status: 'error',
    };
  }
}
