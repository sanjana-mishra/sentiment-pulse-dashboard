
import { 
  SentimentData, 
  SentimentBreakdown, 
  FeedbackItem, 
  RecommendedAction, 
  AlertStatus,
  SentimentLabel,
  FeedbackSource
} from '../types/sentiment';

// Helper to generate random numbers within a range
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate time-series data points for the past 24 hours
export const fetchTimeSeriesData = (): Promise<SentimentData[]> => {
  return new Promise((resolve) => {
    const now = new Date();
    const data: SentimentData[] = [];

    // Generate data points for the past 24 hours, one per hour
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
      
      // Generate more positive than negative feedback by default
      const positive = randomInRange(5, 25);
      const neutral = randomInRange(3, 15);
      const negative = randomInRange(1, 10);

      data.push({
        timestamp: timestamp.toISOString(),
        positive,
        neutral,
        negative
      });
    }

    setTimeout(() => resolve(data), 500);
  });
};

// Generate sentiment breakdown by source
export const fetchSentimentBreakdown = (): Promise<SentimentBreakdown[]> => {
  return new Promise((resolve) => {
    const breakdown: SentimentBreakdown[] = [
      {
        source: 'app',
        positive: randomInRange(50, 80),
        neutral: randomInRange(20, 40),
        negative: randomInRange(5, 20)
      },
      {
        source: 'web',
        positive: randomInRange(40, 70),
        neutral: randomInRange(25, 45),
        negative: randomInRange(10, 25)
      },
      {
        source: 'email',
        positive: randomInRange(30, 60),
        neutral: randomInRange(30, 50),
        negative: randomInRange(15, 30)
      }
    ];

    setTimeout(() => resolve(breakdown), 500);
  });
};

const sentimentTexts: Record<SentimentLabel, string[]> = {
  positive: [
    "Great experience with the new feature!",
    "Customer service was excellent.",
    "Loving the updated interface!",
    "This product really meets all my needs.",
    "Very impressed with the quality.",
    "The support team was very helpful.",
    "Amazing service, will definitely recommend.",
    "Works perfectly every time I use it.",
    "Best solution I've found for my needs!"
  ],
  neutral: [
    "The product works as expected.",
    "Service was adequate.",
    "I'm still learning how to use all the features.",
    "It's okay, but could be improved.",
    "Not bad, but not spectacular either.",
    "Does what it says it does.",
    "I have mixed feelings about the new design.",
    "Some features work well, others need improvement.",
    "Still evaluating if this meets all my needs."
  ],
  negative: [
    "Encountered an error during checkout.",
    "Customer service took too long to respond.",
    "The app keeps crashing when I try to save.",
    "Very disappointed with the quality.",
    "Couldn't figure out how to use this feature.",
    "Too expensive for what it offers.",
    "The website is too slow to load.",
    "Found the interface confusing and complicated.",
    "Needs significant improvement to be usable."
  ]
};

const generateRandomFeedback = (): FeedbackItem => {
  const sources: FeedbackSource[] = ['app', 'web', 'email'];
  const sentimentLabels: SentimentLabel[] = ['positive', 'neutral', 'negative'];
  
  const source = sources[Math.floor(Math.random() * sources.length)];
  const sentimentLabel = sentimentLabels[Math.floor(Math.random() * sentimentLabels.length)];
  const sentimentScore = sentimentLabel === 'positive' 
    ? Math.random() * 0.5 + 0.5 
    : sentimentLabel === 'neutral' 
      ? Math.random() * 0.4 + 0.3 
      : Math.random() * 0.3;
      
  const texts = sentimentTexts[sentimentLabel];
  const text = texts[Math.floor(Math.random() * texts.length)];
  
  const now = new Date();
  const timestamp = new Date(now.getTime() - randomInRange(0, 24 * 60 * 60 * 1000));
  
  return {
    id: `feedback-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: timestamp.toISOString(),
    source,
    userId: `user-${Math.random().toString(36).substr(2, 6)}`,
    text,
    sentimentLabel,
    sentimentScore: Number(sentimentScore.toFixed(2))
  };
};

// Generate mock feedback items
export const fetchFeedbackData = (): Promise<FeedbackItem[]> => {
  return new Promise((resolve) => {
    const feedbackItems: FeedbackItem[] = [];
    
    for (let i = 0; i < 20; i++) {
      feedbackItems.push(generateRandomFeedback());
    }
    
    // Sort by timestamp, most recent first
    feedbackItems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setTimeout(() => resolve(feedbackItems), 600);
  });
};

// Generate recommended actions
export const fetchRecommendedActions = (): Promise<RecommendedAction[]> => {
  return new Promise((resolve) => {
    const actions: RecommendedAction[] = [
      {
        id: '1',
        description: 'Review mobile app checkout process for error reports',
        impact: 'high',
        category: 'Product'
      },
      {
        id: '2',
        description: 'Improve response time for customer service emails',
        impact: 'medium',
        category: 'Support'
      },
      {
        id: '3',
        description: 'Create FAQ section for commonly reported issues',
        impact: 'low',
        category: 'Documentation'
      }
    ];
    
    setTimeout(() => resolve(actions), 700);
  });
};

// Generate alert status
export const fetchAlertStatus = (): Promise<AlertStatus> => {
  return new Promise((resolve) => {
    // Randomly determine if alert should be active (20% chance)
    const isActive = Math.random() < 0.2;
    const count = isActive ? randomInRange(5, 15) : randomInRange(0, 4);
    
    const alert: AlertStatus = {
      isActive,
      message: 'High volume of negative feedback detected',
      threshold: 5,
      count,
      timeWindow: '5 minutes'
    };
    
    setTimeout(() => resolve(alert), 400);
  });
};

// Mock real-time data update by adding a random new feedback
export const fetchNewFeedback = (): Promise<FeedbackItem> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateRandomFeedback()), 300);
  });
};
