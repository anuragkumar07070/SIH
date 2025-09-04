import { LogIn } from 'lucide-react';
import MapComponent from './Map/MapComponent';
import Navbar from './Navbar/Navbar';
import ProblemsComponent from './Problems/ProblemComponent';
import SignUpPage from './User/SignUpPage';
import LoginPage from './User/LoginPage';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar/>
      
      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] p-6 gap-6">
        {/* Map Component - 1/3 width */}
        <div className="w-1/3 min-w-0">
          <MapComponent />
        </div>
        
        {/* Problems Component - 2/3 width */}
        <div className="w-2/3 min-w-0">
          <ProblemsComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;