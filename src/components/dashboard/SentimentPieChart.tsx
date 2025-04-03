
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SentimentBreakdown, FeedbackSource } from '@/types/sentiment';
import { fetchSentimentBreakdown } from '@/services/mockDataService';

interface SentimentPieChartProps {
  refresh: boolean;
  lastUpdated: Date;
}

const SentimentPieChart = ({ refresh, lastUpdated }: SentimentPieChartProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SentimentBreakdown[]>([]);
  const [activeSource, setActiveSource] = useState<FeedbackSource | 'all'>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const breakdownData = await fetchSentimentBreakdown();
      setData(breakdownData);
      setLoading(false);
    };

    loadData();

    // Set up refresh
    if (refresh) {
      const interval = setInterval(() => {
        loadData();
      }, 10000); // refresh every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [refresh, lastUpdated]);

  // Transform data for the pie chart
  const getPieData = () => {
    if (activeSource === 'all') {
      // Aggregate all sources
      const totals = {
        positive: data.reduce((sum, item) => sum + item.positive, 0),
        neutral: data.reduce((sum, item) => sum + item.neutral, 0),
        negative: data.reduce((sum, item) => sum + item.negative, 0)
      };
      
      return [
        { name: 'Positive', value: totals.positive },
        { name: 'Neutral', value: totals.neutral },
        { name: 'Negative', value: totals.negative }
      ];
    } else {
      // Get data for specific source
      const sourceData = data.find(item => item.source === activeSource);
      
      if (sourceData) {
        return [
          { name: 'Positive', value: sourceData.positive },
          { name: 'Neutral', value: sourceData.neutral },
          { name: 'Negative', value: sourceData.negative }
        ];
      }
      
      return [];
    }
  };

  const COLORS = ['#3B82F6', '#9CA3AF', '#EF4444']; // Blue, Gray, Red

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sentiment Breakdown by Source</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="w-full h-64" />
          </div>
        ) : (
          <>
            <Tabs value={activeSource} onValueChange={(value) => setActiveSource(value as FeedbackSource | 'all')}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Sources</TabsTrigger>
                <TabsTrigger value="app">App</TabsTrigger>
                <TabsTrigger value="web">Web</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>

              <TabsContent value={activeSource} className="mt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} feedbacks`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentPieChart;
