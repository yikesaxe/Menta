import React from 'react';

const Stats = ({ category }) => {
  // Mock data
  const details = {
    Reading: {
      days: 12,
      time: '10 hours',
      notes: 'Finished reading "The Great Gatsby".',
      feelings: 'Satisfied'
    },
    Writing: {
      days: 8,
      time: '5 hours',
      notes: 'Completed first draft of novel.',
      feelings: 'Inspired'
    },
    Coding: {
      days: 15,
      time: '20 hours',
      notes: 'Built a new feature for the app.',
      feelings: 'Accomplished'
    },
    Puzzles: {
      days: 5,
      time: '3 hours',
      notes: 'Solved 10 new puzzles.',
      feelings: 'Challenged'
    }
  };

  // Get the details for the selected category
  const currentDetails = details[category] || {
    days: 0,
    time: '0 hours',
    notes: 'No data available',
    feelings: 'N/A'
  };

  return (
    <div className="mt-4 p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-semibold mb-2">{category} Details</h2>
      <p><strong>Days:</strong> {currentDetails.days}</p>
      <p><strong>Time:</strong> {currentDetails.time}</p>
      <p><strong>Notes:</strong> {currentDetails.notes}</p>
      <p><strong>Feelings:</strong> {currentDetails.feelings}</p>
    </div>
  );
};

export default Stats;