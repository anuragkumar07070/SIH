// src/components/Problems/ProblemsComponent.jsx
import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import ProblemList from './ProblemList';
import ProblemModal from './ProblemModal';

// Mock data using your exact complaint structure
const allProblems = [
  {
    complaintId: 'CMPT001',
    category: 'Roads & Transportation',
    subCategory: 'Potholes',
    description: 'Large pothole causing traffic slowdowns near Albert Ekka Chowk.',
    district: 'Ranchi',
    status: 'Assigned',
    priority: 'High',
    manualLocation: 'Near Albert Ekka Chowk, Main Road',
    imageUrl: 'https://images.unsplash.com/photo-1594165568939-50c383a4a065?q=80&w=800',
    latitude: '23.372',
    longitude: '85.324',
  },
  {
    complaintId: 'CMPT002',
    category: 'Streetlights & Electricity',
    subCategory: 'Non-working Streetlights',
    description: 'Streetlight not working for 3 days on Sakchi, Road No. 2.',
    district: 'Jamshedpur',
    status: 'Submitted',
    priority: 'Medium',
    manualLocation: 'Sakchi, Road No. 2',
    imageUrl: 'https://images.unsplash.com/photo-1620392364724-4b95f4e6a62a?q=80&w=800',
    latitude: '22.804',
    longitude: '86.202',
  },
  {
    complaintId: 'CMPT003',
    category: 'Sanitation & Waste',
    subCategory: 'Overflowing Bins',
    description: 'Garbage bin overflowing onto the street opposite City Centre Mall.',
    district: 'Dhanbad',
    status: 'Resolved',
    priority: 'Low',
    manualLocation: 'Opposite City Centre Mall',
    imageUrl: 'https://images.unsplash.com/photo-1605615349635-d72b2c4a9a44?q=80&w=800',
    latitude: '23.795',
    longitude: '86.430',
  },
   {
    complaintId: 'CMPT004',
    category: 'Water & Drainage',
    subCategory: 'Sewer Blockage',
    description: 'Main sewer line is blocked, causing overflow in the colony.',
    district: 'Ranchi',
    status: 'Acknowledged',
    priority: 'High',
    manualLocation: 'Harmu Housing Colony, Block C',
    imageUrl: 'https://images.unsplash.com/photo-1582736342622-969c12812264?q=80&w=800',
    latitude: '23.355',
    longitude: '85.309',
  },
];

const ProblemsComponent = () => {
  // State for the list of problems that are currently displayed
  const [filteredProblems, setFilteredProblems] = useState(allProblems);

  // State for managing the modal
  const [selectedProblem, setSelectedProblem] = useState(null);

  // State for all filter inputs
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    status: 'All Status',
  });

  // This effect runs whenever the 'filters' state changes
  useEffect(() => {
    let result = allProblems;

    // 1. Filter by search term (checks description and location)
    if (filters.search) {
      result = result.filter(p =>
        p.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.manualLocation.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // 2. Filter by category
    if (filters.category !== 'All Categories') {
      result = result.filter(p => p.category === filters.category);
    }

    // 3. Filter by status
    if (filters.status !== 'All Status') {
      result = result.filter(p => p.status === filters.status);
    }

    setFilteredProblems(result);
  }, [filters]);

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
      <ProblemList problems={filteredProblems} onViewDetails={handleViewDetails} />
      {selectedProblem && (
        <ProblemModal problem={selectedProblem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProblemsComponent;