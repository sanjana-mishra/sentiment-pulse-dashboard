
import { AlertTriangle } from 'lucide-react';

interface AlertBannerProps {
  message: string;
  count: number;
  threshold: number;
  timeWindow: string;
}

const AlertBanner = ({ message, count, threshold, timeWindow }: AlertBannerProps) => {
  return (
    <div className="bg-red-500 text-white p-3 animate-pulse-subtle">
      <div className="container flex items-center gap-3">
        <AlertTriangle className="h-5 w-5" />
        <div className="flex-1">
          <span className="font-semibold">{message}:</span>{' '}
          <span>
            {count} negative feedbacks in the last {timeWindow} (threshold: {threshold})
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
