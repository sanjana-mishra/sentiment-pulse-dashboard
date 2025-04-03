
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { FeedbackItem, FeedbackSource, SentimentLabel } from '@/types/sentiment';
import { fetchFeedbackData, fetchNewFeedback } from '@/services/mockDataService';

interface FeedbackTableProps {
  refresh: boolean;
  lastUpdated: Date;
}

const FeedbackTable = ({ refresh, lastUpdated }: FeedbackTableProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [sourceFilter, setSourceFilter] = useState<FeedbackSource | 'all'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentLabel | 'all'>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const feedbackData = await fetchFeedbackData();
      setData(feedbackData);
      setLoading(false);
    };

    loadData();

    // Set up refresh
    if (refresh) {
      const interval = setInterval(async () => {
        // For realistic real-time updates, add one new feedback item
        const newFeedback = await fetchNewFeedback();
        setData(currentData => [newFeedback, ...currentData.slice(0, 19)]);
      }, 10000); // refresh every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [refresh, lastUpdated]);

  // Filter data based on selected source and sentiment
  const filteredData = data.filter(item => {
    const matchesSource = sourceFilter === 'all' || item.source === sourceFilter;
    const matchesSentiment = sentimentFilter === 'all' || item.sentimentLabel === sentimentFilter;
    return matchesSource && matchesSentiment;
  });

  // Helper function to get badge color based on sentiment
  const getSentimentBadgeColor = (sentiment: SentimentLabel) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-sentiment-positive text-white';
      case 'neutral':
        return 'bg-sentiment-neutral text-white';
      case 'negative':
        return 'bg-sentiment-negative text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Helper function to get source badge color
  const getSourceBadgeColor = (source: FeedbackSource) => {
    switch (source) {
      case 'app':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'web':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'email':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-lg font-medium">Latest Customer Feedback</CardTitle>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={sourceFilter} onValueChange={(val) => setSourceFilter(val as FeedbackSource | 'all')}>
              <SelectTrigger className="w-full sm:w-[110px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="app">App</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sentimentFilter} onValueChange={(val) => setSentimentFilter(val as SentimentLabel | 'all')}>
              <SelectTrigger className="w-full sm:w-[110px]">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                  <div className="flex flex-wrap gap-2 mb-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className={getSourceBadgeColor(item.source)}>
                        {item.source.toUpperCase()}
                      </Badge>
                      <Badge className={getSentimentBadgeColor(item.sentimentLabel)}>
                        {item.sentimentLabel} ({(item.sentimentScore * 100).toFixed(0)}%)
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(item.timestamp), 'MMM dd, h:mm a')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{item.text}</p>
                  <p className="text-xs text-gray-500">User ID: {item.userId}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No feedback matches your filters. Try adjusting your criteria.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackTable;
