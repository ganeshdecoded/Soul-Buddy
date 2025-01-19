// Predefined coordinates for major Indian cities
const CITY_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
  'Delhi': { latitude: 28.6139, longitude: 77.2090 },
  'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
  'Chennai': { latitude: 13.0827, longitude: 80.2707 },
  'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
  'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
  'Pune': { latitude: 18.5204, longitude: 73.8567 },
  'Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
  'Thane': { latitude: 19.2183, longitude: 72.9781 },
  'Surat': { latitude: 21.1702, longitude: 72.8311 },
  'Maharashtra': { latitude: 19.7515, longitude: 75.7139 }, // State center point
  // Add more cities as needed
};

export async function getCoordinates(city: string, state: string): Promise<{ latitude: number; longitude: number }> {
  // Clean up city and state names
  const cleanCity = city.trim().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  const cleanState = state.trim().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');

  // First try to find city coordinates
  if (CITY_COORDINATES[cleanCity]) {
    console.log(`Using coordinates for city: ${cleanCity}`);
    return CITY_COORDINATES[cleanCity];
  }

  // If city not found, try state coordinates
  if (CITY_COORDINATES[cleanState]) {
    console.log(`City not found, using state coordinates for: ${cleanState}`);
    return CITY_COORDINATES[cleanState];
  }

  // If neither found, use Mumbai as default
  console.log(`Location not found, using Mumbai as default`);
  return CITY_COORDINATES['Mumbai'];
}