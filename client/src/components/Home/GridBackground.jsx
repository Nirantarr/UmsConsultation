import React from 'react';

const GridBackground = ({ gridSize = 10, className = '', panelClassName = '' }) => {
  return (
    <div className={`absolute inset-0 z-0 grid ${className}`} style={{
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    }}>
      {Array.from({ length: gridSize * gridSize }).map((_, i) => (
        <div key={i} className={`grid-panel ${panelClassName}`} />
      ))}
    </div>
  );
};

export default GridBackground;
