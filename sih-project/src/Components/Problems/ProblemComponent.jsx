// src/components/Problems/ProblemsComponent.jsx
import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import ProblemList from './ProblemList';
import ProblemModal from './ProblemModal';

// This component now receives its data from the Dashboard
const ProblemsComponent = ({ problems, isLoading, error }) => {
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    status: 'All Status',
  });

  // This effect now runs when the main 'problems' prop changes
  useEffect(() => {
    let result = problems;

    if (filters.search) {
      result = result.filter(p =>
        (p.description && p.description.toLowerCase().includes(filters.search.toLowerCase())) ||
        (p.manualLocation && p.manualLocation.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }
    if (filters.category !== 'All Categories') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.status !== 'All Status') {
      result = result.filter(p => p.status === filters.status);
    }

    setFilteredProblems(result);
  }, [filters, problems]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  const handleViewDetails = (problem) => {
    setSelectedProblem(problem);
  };

  const handleCloseModal = () => {
    setSelectedProblem(null);
  };

  return (
    <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      
      {isLoading && <div className="p-4 text-center">Loading issues...</div>}
      {error && <div className="p-4 text-center text-red-500">{error}</div>}
      {!isLoading && !error && (
        <ProblemList problems={filteredProblems} onViewDetails={handleViewDetails} />
      )}
      
      {selectedProblem && (
        <ProblemModal problem={selectedProblem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProblemsComponent;