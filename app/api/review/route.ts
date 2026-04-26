import { NextRequest, NextResponse } from 'next/server';
import { performArchitecturalReview } from '@/lib/ai/reviewer';
import { ReviewRequest } from '@/types/review';

/**
 * @api {post} /api/review Perform Architectural Review
 * @apiDescription Ingests a pull request diff and returns architectural insights.
 */
export async function POST(req: NextRequest) {
  try {
    const body: ReviewRequest = await req.json();

    if (!body.diff) {
      return NextResponse.json(
        { error: 'Missing "diff" in request body.' },
        { status: 400 }
      );
    }

    // Default policies if none provided
    const defaultPolicies = [
      'No business logic in Controllers/Route Handlers.',
      'Domain layer isolation: No infrastructure imports in domain code.',
      'Enforce Service Pattern for complex business logic.',
      'Use existing shared utilities instead of re-implementing logic.'
    ];

    const result = await performArchitecturalReview({
      ...body,
      policies: body.policies || defaultPolicies,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
