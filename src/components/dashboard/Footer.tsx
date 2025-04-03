
import { format } from 'date-fns';

interface FooterProps {
  lastUpdated: Date;
}

const Footer = ({ lastUpdated }: FooterProps) => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 mt-6">
      <div className="container flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <div>Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm:ss')}</div>
        <div className="mt-2 md:mt-0">
          <a href="#" className="text-blue-600 hover:underline">
            Contact support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
