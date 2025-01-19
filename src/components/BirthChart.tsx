'use client';

import React from 'react';

interface BirthChartProps {
  ascendant: string;
  houses: Record<number, {
    sign: string;
    planets: string[];
  }>;
  chartSVG?: string;
}

export default function BirthChart({ ascendant, houses, chartSVG }: BirthChartProps) {
  if (!chartSVG) return null;

  // Fix SVG attributes for proper display
  const cleanedSVG = chartSVG
    .replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMid meet"')
    .replace(/width="[^"]*"/, 'width="100%"')
    .replace(/height="[^"]*"/, 'height="100%"')
    .replace(/stroke="#000000"/g, 'stroke="white"')
    .replace(/stroke-width="1"/g, 'stroke-width="2"')
    .replace(/font-size="16"/g, 'font-size="18"')
    .replace(/<text/g, '<text fill="white"');

  const openInNewTab = () => {
    const svgBlob = new Blob([cleanedSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-white">Your Birth Chart</h2>
        <button
          onClick={openInNewTab}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-colors"
        >
          Open Chart in New Tab
        </button>
      </div>
      <div 
        className="w-[480px] h-[480px] p-4 rounded-xl"
        style={{
          background: 'linear-gradient(145deg, rgba(88, 28, 135, 0.6), rgba(124, 58, 237, 0.4))'
        }}
      >
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: cleanedSVG }}
        />
      </div>
    </div>
  );
}