
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SentimentData } from '@/types/sentiment';
import { fetchTimeSeriesData } from '@/services/mockDataService';

interface TimeSeriesChartProps {
  refresh: boolean;
  lastUpdated: Date;
}

const TimeSeriesChart = ({ refresh, lastUpdated }: TimeSeriesChartProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SentimentData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const timeSeriesData = await fetchTimeSeriesData();
      setData(timeSeriesData);
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

  // Format data for the chart
  const formattedData = data.map(item => ({
    ...item,
    time: format(new Date(item.timestamp), 'HH:mm'),
    date: format(new Date(item.timestamp), 'MMM dd')
  }));

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sentiment Trends (Last 24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-80">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value} feedbacks`]} 
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend verticalAlign="top" height={36} />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  name="Positive" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="neutral" 
                  name="Neutral" 
                  stroke="#9CA3AF" 
                  strokeWidth={2} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="negative" 
                  name="Negative" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;
