
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RecommendedAction } from '@/types/sentiment';
import { fetchRecommendedActions } from '@/services/mockDataService';

interface RecommendedActionsProps {
  refresh: boolean;
  lastUpdated: Date;
}

const RecommendedActions = ({ refresh, lastUpdated }: RecommendedActionsProps) => {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<RecommendedAction[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchRecommendedActions();
      setActions(data);
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

  // Helper function to get impact badge color
  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to get category badge color
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Product':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Support':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Documentation':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Top Recommended Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((action, index) => (
              <div key={action.id} className="flex gap-4">
                <div className="flex-none">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-medium">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-2">{action.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getImpactBadgeColor(action.impact)}>
                      {action.impact.charAt(0).toUpperCase() + action.impact.slice(1)} Impact
                    </Badge>
                    <Badge variant="outline" className={getCategoryBadgeColor(action.category)}>
                      {action.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedActions;
