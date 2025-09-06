// src/components/Problems/ProblemsComponent.jsx
import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import ProblemList from './ProblemList';
import ProblemModal from './ProblemModal';

const ProblemsComponent = ({ problems, isLoading, error, userRole, onUpdateSuccess }) => {
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: 'All Categories', status: 'All Status' });

  useEffect(() => {
    let result = problems || [];
    if (filters.search) {
      result = result.filter(p => (p.description?.toLowerCase().includes(filters.search.toLowerCase())) || (p.manualLocation?.toLowerCase().includes(filters.search.toLowerCase())));
    }
    if (filters.category !== 'All Categories') result = result.filter(p => p.category === filters.category);
    if (filters.status !== 'All Status') result = result.filter(p => p.status === filters.status);
    setFilteredProblems(result);
  }, [filters, problems]);
  
  const handleFilterChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));
  const handleViewDetails = (problem) => setSelectedProblem(problem);
  const handleCloseModal = () => setSelectedProblem(null);

  return (
    <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      {isLoading && <div className="p-4 text-center">Loading issues...</div>}
      {error && <div className="p-4 text-center text-red-500">{error}</div>}
      {!isLoading && !error && (
        <ProblemList 
          problems={filteredProblems} 
          onViewDetails={handleViewDetails}
          userRole={userRole}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {selectedProblem && (
        <ProblemModal 
          problem={selectedProblem} 
          onClose={handleCloseModal} 
          userRole={userRole} 
          onUpdateSuccess={onUpdateSuccess} 
        />
      )}
    </div>
  );
};

export default ProblemsComponent;
