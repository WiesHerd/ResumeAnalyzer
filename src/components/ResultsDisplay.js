import React from 'react';

function ResultsDisplay({ results }) {
  return (
    <div>
      <h2>Analysis Results</h2>
      <p>{results}</p>
    </div>
  );
}

export default ResultsDisplay;