'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCoordinates } from '@/lib/geocoding';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    gender: '',
    state: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting form data:', formData);

      // First save user data
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Ensure date is in YYYY-MM-DD format
          dateOfBirth: new Date(formData.dateOfBirth).toISOString().split('T')[0],
          // Ensure time is in HH:mm format
          timeOfBirth: formData.timeOfBirth.split(':').slice(0, 2).join(':')
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('User creation error:', errorData);
        throw new Error(errorData.error || 'Failed to save user data');
      }

      const userData = await userResponse.json();
      console.log('User data saved:', userData);

      // Get coordinates from city and state
      const { latitude, longitude } = await getCoordinates(formData.city, formData.state);
      console.log('Coordinates:', { latitude, longitude });

      // Format datetime string for API (YYYY-MM-DD HH:mm:ss)
      const date = new Date(formData.dateOfBirth);
      const [hours, minutes] = formData.timeOfBirth.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      
      const datetime = date.toISOString().slice(0, 10) + ' ' + 
                      formData.timeOfBirth + ':00';

      console.log('Generating horoscope with datetime:', datetime);

      // Generate horoscope
      const horoscopeResponse = await fetch('/api/horoscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datetime,
          latitude,
          longitude,
          userId: userData._id
        }),
      });

      if (!horoscopeResponse.ok) {
        const errorData = await horoscopeResponse.json();
        console.error('Horoscope generation error:', errorData);
        throw new Error(errorData.error || 'Failed to generate horoscope');
      }

      // Store the user ID in localStorage for the dashboard
      localStorage.setItem('userId', userData._id);

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="premium-text text-4xl md:text-5xl lg:text-6xl mb-4 font-bold">
          SoulBuddy
        </h1>
        <p className="text-xl text-gray-300 mb-2">Your AI-Powered Spiritual Guide</p>
        <div className="w-24 h-1 bg-gradient-to-r from-accent-gold to-accent-purple mx-auto rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md p-8 space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time of Birth</label>
            <input
              type="time"
              name="timeOfBirth"
              required
              value={formData.timeOfBirth}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
              placeholder="Enter your state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
              placeholder="Enter your city"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent-gold to-accent-purple text-white font-bold py-3 px-6 rounded-lg 
                   hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-background"
        >
          {loading ? 'Loading...' : 'Begin Your Journey'}
        </button>
      </form>
    </div>
  );
}
