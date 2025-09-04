// src/Components/Dashboard.jsx
import MapComponent from './Map/MapComponent';
import Navbar from './Navbar/Navbar';
import ProblemsComponent from './Problems/ProblemComponent';

// Accept signOut and user as props
const Dashboard = ({ signOut, user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pass the props down to the Navbar */}
      <Navbar user={user} signOut={signOut} />
      
      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)] p-6 gap-6">
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