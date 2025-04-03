
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface HeaderProps {
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
}

const Header = ({ autoRefresh, setAutoRefresh }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-4">
      <div className="container flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Sentiment Analytics</h1>
          <p className="text-gray-500">Real-time insights into customer feedback trends</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Label htmlFor="auto-refresh" className="text-sm font-medium">
            Auto-refresh
          </Label>
          <Switch 
            id="auto-refresh" 
            checked={autoRefresh} 
            onCheckedChange={setAutoRefresh}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
