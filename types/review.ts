export interface ReviewComment {
  file: string;
  line: number;
  type: 'architectural' | 'pattern' | 'redundancy' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion: string;
  context_snippet: string;
}

export interface ReviewResponse {
  summary: string;
  architectural_health_score: number;
  comments: ReviewComment[];
  status: 'success' | 'partial' | 'error';
}

export interface ReviewRequest {
  diff: string;
  repo_context?: string;
  policies?: string[];
}
