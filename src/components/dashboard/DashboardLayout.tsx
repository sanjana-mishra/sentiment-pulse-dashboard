
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { AlertStatus } from '@/types/sentiment';
import { fetchAlertStatus } from '@/services/mockDataService';
import Header from './Header';
import TimeSeriesChart from './TimeSeriesChart';
import SentimentPieChart from './SentimentPieChart';
import FeedbackTable from './FeedbackTable';
import RecommendedActions from './RecommendedActions';
import AlertBanner from './AlertBanner';
import Footer from './Footer';

const DashboardLayout = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [alertStatus, setAlertStatus] = useState<AlertStatus | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch of alert status
    fetchAlertStatus().then(data => {
      setAlertStatus(data);
    });

    // Set up auto-refresh interval
    let intervalId: number | null = null;
    
    if (autoRefresh) {
      intervalId = window.setInterval(() => {
        setLastUpdated(new Date());
        
        // Check alert status on each refresh
        fetchAlertStatus().then(data => {
          setAlertStatus(data);
          
          // Show toast notification if alert becomes active
          if (data.isActive && (!alertStatus || !alertStatus.isActive)) {
            toast({
              title: "Alert Triggered",
              description: data.message,
              variant: "destructive",
            });
          }
        });
      }, 10000);
    }
    
    // Clean up interval on component unmount or when autoRefresh changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, alertStatus, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh} />
      
      {alertStatus?.isActive && (
        <AlertBanner
          message={alertStatus.message}
          count={alertStatus.count}
          threshold={alertStatus.threshold}
          timeWindow={alertStatus.timeWindow}
        />
      )}
      
      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Analytics Overview */}
          <div className="flex flex-col gap-6">
            <TimeSeriesChart refresh={autoRefresh} lastUpdated={lastUpdated} />
            <SentimentPieChart refresh={autoRefresh} lastUpdated={lastUpdated} />
          </div>
          
          {/* Right Column - Detailed Feedback & Actions */}
          <div className="flex flex-col gap-6">
            <RecommendedActions refresh={autoRefresh} lastUpdated={lastUpdated} />
            <FeedbackTable refresh={autoRefresh} lastUpdated={lastUpdated} />
          </div>
        </div>
      </main>
      
      <Footer lastUpdated={lastUpdated} />
    </div>
  );
};

export default DashboardLayout;
