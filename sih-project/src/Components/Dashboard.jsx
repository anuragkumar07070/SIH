// src/Components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from './Map/MapComponent';
import Navbar from './Navbar/Navbar';
import ProblemsComponent from './Problems/ProblemComponent';

const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/complaints`;

const Dashboard = ({ signOut, user }) => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Use useCallback to prevent this function from being recreated on every render
  const fetchProblems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const problemsWithLocation = data.filter(p => p.latitude && p.longitude);
      setProblems(problemsWithLocation);
      setLastUpdated(new Date()); // Set update time on successful fetch
    } catch (e) {
      setError('Failed to fetch data. Please try again later.');
      console.error("Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created only once

  // Fetch data on initial component mount
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} signOut={signOut} />
      
      <div className="flex h-[calc(100vh-64px)] p-6 gap-6">
        <div className="w-1/3 min-w-0">
          {/* Pass problems and the refresh handler to the MapComponent */}
          <MapComponent 
            problems={problems} 
            isLoading={isLoading} 
            onRefresh={fetchProblems} 
            lastUpdated={lastUpdated} 
          />
        </div>
        
        <div className="w-2/3 min-w-0">
          <ProblemsComponent problems={problems} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;