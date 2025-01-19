let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await fetch(process.env.PROKERALA_TOKEN_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.PROKERALA_CLIENT_ID!,
        client_secret: process.env.PROKERALA_CLIENT_SECRET!,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

async function fetchProkeralaAPI(endpoint: string, params: Record<string, string>) {
  const token = await getAccessToken();
  const url = new URL(`${process.env.PROKERALA_API_URL}/${endpoint}`);
  
  // Format coordinates as required by API
  if (params.latitude && params.longitude) {
    params.coordinates = `${params.latitude},${params.longitude}`;
    delete params.latitude;
    delete params.longitude;
  }
  
  // Format datetime to ISO 8601 format with timezone offset
  if (params.datetime) {
    const date = new Date(params.datetime);
    // Add 5 hours and 30 minutes to adjust for IST
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    // Format as YYYY-MM-DDTHH:mm:ss+05:30
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    params.datetime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
  }

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  console.log('Calling Prokerala API:', url.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': params.format === 'svg' ? 'image/svg+xml' : 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    console.error('Prokerala API error response:', errorData);
    throw new Error(`Prokerala API error: ${errorData.errors?.[0]?.detail || response.statusText}`);
  }

  // Return SVG as text for chart endpoint with SVG format
  if (params.format === 'svg') {
    return response.text();
  }

  // Parse JSON for other endpoints
  return response.json();
}

export async function getBirthChart(datetime: string, latitude: number, longitude: number): Promise<any> {
  try {
    const params = {
      datetime,
      coordinates: `${latitude},${longitude}`,
      ayanamsa: '1',
      chart_type: 'rasi',
      chart_style: 'north-indian',
      format: 'svg',
      la: 'en'
    };

    console.log('Fetching chart with params:', params);
    const response = await fetchProkeralaAPI('chart', params);
    console.log('Raw SVG data:', response); // Debug log
    
    // Create a structured birth chart data
    const houses: Record<number, { sign: string; planets: string[] }> = {};
    
    // Initialize all houses with empty planet arrays
    for (let i = 1; i <= 12; i++) {
      houses[i] = {
        sign: getSignForHouse(i),
        planets: []
      };
    }

    // Extract planet positions from the SVG data
    const svgText = response as string;
    
    return {
      ascendant: findAscendant(svgText),
      houses,
      chartSVG: svgText
    };
  } catch (error) {
    console.error('Error fetching birth chart:', error);
    throw error;
  }
}

function findHouseFromCoordinates(x: number, y: number): number {
  // Calculate house number based on x,y coordinates
  // This is a simplified version - you may need to adjust based on your SVG layout
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  const normalizedAngle = (angle + 360) % 360;
  return Math.floor(normalizedAngle / 30) + 1;
}

function findAscendant(svgText: string): string {
  // Extract ascendant sign from SVG
  // Look for text element with "Asc" or specific position
  const ascMatch = svgText.match(/Asc[^<]+/) || ['Aries']; // Default to Aries if not found
  return ascMatch[0].replace('Asc', '').trim();
}

function getSignForHouse(houseNumber: number): string {
  // Map house numbers to zodiac signs based on the ascendant
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return signs[(houseNumber - 1) % 12];
}

export async function getPlanetPositions(datetime: string, latitude: number, longitude: number) {
  try {
    const params = {
      datetime,
      coordinates: `${latitude},${longitude}`,
      ayanamsa: '1',
      chart_type: 'rasi',
      chart_style: 'north-indian',
      format: 'svg',
      la: 'en'
    };

    const svgContent = await fetchProkeralaAPI('chart', params) as string;
    
    // Extract planet positions from SVG
    const planetPositions: Record<string, { sign: string; degree: number; lordship?: string }> = {};
    const planetMap = {
      'Su': 'Sun',
      'Mo': 'Moon',
      'Ma': 'Mars',
      'Me': 'Mercury',
      'Ju': 'Jupiter',
      'Ve': 'Venus',
      'Sa': 'Saturn',
      'Ra': 'Rahu',
      'Ke': 'Ketu'
    };

    // Parse SVG text elements
    const textMatches = svgContent.match(/<text[^>]*>([^<]+)<\/text>/g) || [];
    textMatches.forEach(textElement => {
      const content = textElement.match(/>([^<]+)</)?.[1] || '';
      if (content in planetMap) {
        const x = parseFloat(textElement.match(/x="([^"]+)"/)?.[1] || '0');
        const y = parseFloat(textElement.match(/y="([^"]+)"/)?.[1] || '0');
        const house = findNearestHouse(x, y, textMatches);
        
        planetPositions[planetMap[content as keyof typeof planetMap]] = {
          sign: getSignForHouse(house || 1),
          degree: 0 // Exact degrees not available in SVG
        };
      }
    });

    return planetPositions;
  } catch (error) {
    console.error('Error getting planet positions:', error);
    throw error;
  }
}

function findNearestHouse(x: number, y: number, textElements: string[]): number | null {
  let nearestHouse = null;
  let minDistance = Infinity;

  textElements.forEach(element => {
    const content = element.match(/>([^<]+)</)?.[1] || '';
    const houseNum = parseInt(content);
    if (houseNum >= 1 && houseNum <= 12) {
      const houseX = parseFloat(element.match(/x="([^"]+)"/)?.[1] || '0');
      const houseY = parseFloat(element.match(/y="([^"]+)"/)?.[1] || '0');
      
      const distance = Math.sqrt(
        Math.pow(x - houseX, 2) + Math.pow(y - houseY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestHouse = houseNum;
      }
    }
  });

  return nearestHouse;
}

export async function getMangalDosha(datetime: string, latitude: number, longitude: number) {
  try {
    const params = {
      datetime,
      coordinates: `${latitude},${longitude}`,
      ayanamsa: '1',
    };

    const data = await fetchProkeralaAPI('panchang/advanced', params);
    
    // Analyze panchang data for Mangal Dosha
    const mangalDosha = {
      hasDosha: false,
      intensity: "None",
      remedies: [] as string[],
      auspiciousPeriods: [] as string[],
      inauspiciousPeriods: [] as string[]
    };

    // Check for inauspicious periods
    if (data.data.inauspicious_period && data.data.inauspicious_period.length > 0) {
      mangalDosha.hasDosha = true;
      mangalDosha.intensity = "Moderate";
      
      // Add all auspicious periods
      data.data.auspicious_period.forEach(period => {
        mangalDosha.auspiciousPeriods.push(
          `${period.name}: ${period.period[0].start} to ${period.period[0].end}`
        );
      });

      // Add all inauspicious periods
      data.data.inauspicious_period.forEach(period => {
        mangalDosha.inauspiciousPeriods.push(
          `${period.name}: ${period.period[0].start} to ${period.period[0].end}`
        );
      });

      // Add specific timing-based remedies
      mangalDosha.remedies = [
        `Perform meditation during Brahma Muhurat (${data.data.auspicious_period.find(p => p.name === 'Brahma Muhurat')?.period[0].start})`,
        `Conduct spiritual practices during Abhijit Muhurat (${data.data.auspicious_period.find(p => p.name === 'Abhijit Muhurat')?.period[0].start})`,
        `Avoid important activities during Rahu Kaal (${data.data.inauspicious_period.find(p => p.name === 'Rahu')?.period[0].start})`,
        `Plan activities during Amrit Kaal (${data.data.auspicious_period.find(p => p.name === 'Amrit Kaal')?.period[0].start})`
      ];
    }

    return mangalDosha;
  } catch (error) {
    console.error('Error checking Mangal Dosha:', error);
    throw error;
  }
}

export async function getChartSVG(datetime: string, latitude: number, longitude: number) {
  try {
    const params = {
      datetime,
      coordinates: `${latitude},${longitude}`,
      ayanamsa: '1',
      chart_type: 'rasi',
      chart_style: 'north-indian',
      format: 'svg',
      la: 'en'
    };

    const svgContent = await fetchProkeralaAPI('chart', params);
    return svgContent;
  } catch (error) {
    console.error('Error getting chart SVG:', error);
    throw error;
  }
}