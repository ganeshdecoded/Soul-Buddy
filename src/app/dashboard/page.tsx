'use client';

import { useEffect, useState } from 'react';
import BirthChart from '@/components/BirthChart';

interface HoroscopeData {
  birthChart: {
    ascendant: string;
    houses: Record<number, {
      sign: string;
      planets: string[];
    }>;
  };
  planetPositions: Record<string, {
    sign: string;
    degree: number;
  }>;
  mangalDosha: {
    hasDosha: boolean;
    intensity: string;
    remedies: string[];
  };
  interpretations: {
    career: string;
    relationships: string;
    personality: string;
  };
  recommendations: {
    gemstones: string[];
    mantras: string[];
    remedies: string[];
  };
  chartSVG: string;
}

const mantras = [
  {
    sanskrit: "ॐ नमः शिवाय",
    transliteration: "Om Namah Shivaya",
    meaning: "I bow to Shiva (the consciousness of the universe)",
  },
  {
    sanskrit: "ॐ गं गणपतये नमः",
    transliteration: "Om Gam Ganapataye Namaha",
    meaning: "Salutations to Lord Ganesha",
  },
  {
    sanskrit: "ॐ वक्रतुण्ड महाकाय",
    transliteration: "Om Vakratunda Mahakaya",
    meaning: "Om, salutations to the one with the curved trunk and a mighty body",
  }
];

export default function Dashboard() {
  const [currentMantra, setCurrentMantra] = useState(mantras[0]);
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');

    const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % mantras.length;
    setCurrentMantra(mantras[dayIndex]);

    fetchHoroscope();
  }, []);

  const fetchHoroscope = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`/api/users/${userId}/horoscope`);
      if (!response.ok) {
        throw new Error('Failed to fetch horoscope data');
      }

      const data = await response.json();
      setHoroscopeData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg">
          <div className="animate-spin w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full"></div>
          <p className="mt-4 text-white/80">Loading your celestial insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchHoroscope}
            className="bg-gradient-to-r from-accent-gold to-accent-purple px-6 py-2 rounded-lg text-white hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!horoscopeData) return null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="premium-text text-4xl md:text-5xl mb-4">Good {timeOfDay}</h1>
        <p className="text-xl text-gray-300">Welcome to your spiritual journey</p>
        <div className="w-24 h-1 bg-gradient-to-r from-accent-gold to-accent-purple mx-auto rounded-full mt-4"></div>
      </div>

      {/* Mantra Card */}
      <div className="glass-card p-8 mb-8 text-center max-w-2xl mx-auto">
        <h2 className="premium-text text-2xl mb-6">Today's Mantra</h2>
        <div className="space-y-4">
          <p className="text-3xl mb-2">{currentMantra.sanskrit}</p>
          <p className="text-xl text-accent-gold">{currentMantra.transliteration}</p>
          <p className="text-sm text-white/80">{currentMantra.meaning}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Birth Chart Section */}
        <div className="glass-card p-6 rounded-lg">
          <h2 className="premium-text text-2xl mb-6">Birth Chart</h2>
          <BirthChart
            chartSVG={horoscopeData.chartSVG}
            ascendant={horoscopeData.birthChart.ascendant}
            houses={horoscopeData.birthChart.houses}
          />
        </div>

        {/* Interpretations Section */}
        <div className="glass-card p-6 rounded-lg">
          <h2 className="premium-text text-2xl mb-6">Personal Insights</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-accent-gold text-lg mb-2">Personality</h3>
              <p className="text-white/80">{horoscopeData.interpretations.personality}</p>
            </div>
            <div>
              <h3 className="text-accent-gold text-lg mb-2">Career</h3>
              <p className="text-white/80">{horoscopeData.interpretations.career}</p>
            </div>
            <div>
              <h3 className="text-accent-gold text-lg mb-2">Relationships</h3>
              <p className="text-white/80">{horoscopeData.interpretations.relationships}</p>
            </div>
          </div>
        </div>

        {/* Mangal Dosha Section */}
        {horoscopeData.mangalDosha.hasDosha && (
          <div className="glass-card p-6 rounded-lg">
            <h2 className="premium-text text-2xl mb-6">Mangal Dosha Analysis</h2>
            <div className="space-y-4">
              <p className="text-white/80">
                <span className="text-accent-gold">Intensity:</span> {horoscopeData.mangalDosha.intensity}
              </p>
              <div>
                <h3 className="text-accent-gold text-lg mb-2">Recommended Remedies</h3>
                <ul className="list-disc list-inside text-white/80">
                  {horoscopeData.mangalDosha.remedies.map((remedy, index) => (
                    <li key={index}>{remedy}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        <div className="glass-card p-6 rounded-lg">
          <h2 className="premium-text text-2xl mb-6">Sacred Recommendations</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-accent-gold text-lg mb-2">Gemstones</h3>
              <ul className="list-disc list-inside text-white/80">
                {horoscopeData.recommendations.gemstones.map((gemstone, index) => (
                  <li key={index}>{gemstone}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-accent-gold text-lg mb-2">Mantras</h3>
              <div className="space-y-4">
                {horoscopeData.recommendations.mantras.map((mantra, index) => (
                  <li key={index} className="text-white/80">{mantra}</li>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-accent-gold text-lg mb-2">Remedies</h3>
              <ul className="list-disc list-inside text-white/80">
                {horoscopeData.recommendations.remedies.map((remedy, index) => (
                  <li key={index}>{remedy}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}