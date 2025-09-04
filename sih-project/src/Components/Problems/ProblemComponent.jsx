import React from 'react';
import ProblemCard from './ProblemCard'; // Ensure this path is correct

const mockProblems = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    image: 'https://via.placeholder.com/150',
    priority: 'High',
    status: 'Open',
  },
  {
    id: 2,
    title: 'Broken Streetlight',
    image: 'https://via.placeholder.com/150',
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Overflowing Garbage Bin',
    image: 'https://via.placeholder.com/150',
    priority: 'Low',
    status: 'Resolved',
  },
];

const ProblemsComponent = () => {
  return (
    <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Recent Problems</h2>
          <div className="flex items-center space-x-2">
            {/* Priority Filter */}
            <select
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              aria-label="Filter by Priority"
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            {/* Status Filter */}
            <select
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              aria-label="Filter by Status"
            >
              <option>All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem List */}
      <div className="p-4 space-y-4 overflow-y-auto">
        {mockProblems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  );
};

export default ProblemsComponent;