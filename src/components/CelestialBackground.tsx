import React from 'react';

const CelestialBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Planets */}
      <div className="celestial-object planet-1"></div>
      <div className="celestial-object planet-2"></div>
      <div className="celestial-object planet-3"></div>
      
      {/* Stars */}
      <div className="stars"></div>
      
      {/* Nebula effect */}
      <div className="nebula"></div>
      
      {/* Shooting stars */}
      <div className="shooting-star"></div>
      <div className="shooting-star delay"></div>
    </div>
  );
};

export default CelestialBackground; 