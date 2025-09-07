// sih-project/src/Components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import MapComponent from './Map/MapComponent';
import Navbar from './Navbar/Navbar';
import ProblemsComponent from './Problems/ProblemComponent';

const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/complaints`;

const Dashboard = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('DepartmentAdmin');

  // ✅ FIXED: Proper role detection with fresh token
  useEffect(() => {
    const determineUserRole = async () => {
      if (!user) return;

      try {
        // Force refresh to get the latest token with groups
        const { tokens } = await fetchAuthSession({ forceRefresh: true });
        const groups = tokens?.idToken?.payload?.['cognito:groups'] || [];
        
        console.log('=== FRESH TOKEN GROUPS ===', groups);
        
        let newRole = 'DepartmentAdmin'; // Default fallback
        
        if (groups.includes('SuperAdmin')) {
          newRole = 'SuperAdmin';
        } else if (groups.includes('RoadsAdmin')) {
          newRole = 'RoadsAdmin';
        } else if (groups.includes('ElectricityAdmin')) {
          newRole = 'ElectricityAdmin';
        } else if (groups.includes('SanitationAdmin')) {
          newRole = 'SanitationAdmin';
        } else if (groups.includes('WaterAdmin')) {
          newRole = 'WaterAdmin';
        } else if (groups.includes('SafetyAdmin')) {
          newRole = 'SafetyAdmin';
        } else if (groups.includes('ParksAdmin')) {
          newRole = 'ParksAdmin';
        }
        
        console.log('Setting userRole to:', newRole);
        setUserRole(newRole);
      } catch (error) {
        console.error('Error determining user role:', error);
      }
    };

    determineUserRole();
  }, [user]);

  // ✅ Monitor role changes
  useEffect(() => {
    console.log('UserRole updated to:', userRole);
  }, [userRole]);

  const fetchProblems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      if (!idToken) throw new Error("User is not authenticated");

      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${idToken.toString()}` }
      });
      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
      const data = await response.json();
      setProblems(data);
    } catch (e) {
      setError('Failed to fetch data.');
      console.error("Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} signOut={signOut} userRole={userRole} />
      <div className="flex h-[calc(100vh-64px)] p-6 gap-6">
        <div className="w-1/3 min-w-0">
          <MapComponent problems={problems.filter(p => p.latitude && p.longitude)} />
        </div>
        <div className="w-2/3 min-w-0">
          <ProblemsComponent
            problems={problems}
            isLoading={isLoading}
            error={error}
            userRole={userRole}
            onUpdateSuccess={fetchProblems}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
