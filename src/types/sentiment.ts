
export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export type FeedbackSource = 'app' | 'web' | 'email';

export interface SentimentData {
  timestamp: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentBreakdown {
  source: FeedbackSource;
  positive: number;
  neutral: number;
  negative: number;
}

export interface FeedbackItem {
  id: string;
  timestamp: string;
  source: FeedbackSource;
  userId: string;
  text: string;
  sentimentLabel: SentimentLabel;
  sentimentScore: number;
}

export interface RecommendedAction {
  id: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export interface AlertStatus {
  isActive: boolean;
  message: string;
  threshold: number;
  count: number;
  timeWindow: string;
}
