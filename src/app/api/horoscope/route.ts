import { NextResponse } from 'next/server';
import getDb from '@/lib/astradb';
import { getBirthChart, getPlanetPositions, getMangalDosha, getChartSVG } from '@/lib/prokerala';
import {
  interpretCareer,
  interpretRelationships,
  interpretPersonality,
  getGemstoneRecommendations,
  getMantraRecommendations,
} from '@/lib/astrology/interpretations';
import { storeHoroscopeData } from '@/lib/astradb';

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const users = db.collection('users');
    const body = await req.json();
    const { datetime, latitude, longitude, userId } = body;

    // Validate required parameters
    if (!datetime || !latitude || !longitude || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Fetch all required astrological data in parallel
    const [birthChartData, planetPositionsData, mangalDoshaData, chartSVG] = await Promise.all([
      getBirthChart(datetime, latitude, longitude),
      getPlanetPositions(datetime, latitude, longitude),
      getMangalDosha(datetime, latitude, longitude),
      getChartSVG(datetime, latitude, longitude),
    ]);

    // Generate interpretations
    const interpretations = {
      career: interpretCareer(birthChartData, planetPositionsData),
      relationships: interpretRelationships(birthChartData, planetPositionsData),
      personality: interpretPersonality(birthChartData, planetPositionsData),
    };

    // Generate recommendations
    const recommendations = {
      gemstones: getGemstoneRecommendations(birthChartData, planetPositionsData),
      mantras: getMantraRecommendations(birthChartData),
      remedies: mangalDoshaData.remedies || [],
    };

    // Combine all data
    const horoscopeData = {
      birthChart: birthChartData,
      chartSVG,
      planetPositions: planetPositionsData,
      mangalDosha: mangalDoshaData,
      interpretations,
      recommendations,
      lastUpdated: new Date().toISOString(),
    };

    // Store key data in AstraDB
    await storeHoroscopeData(userId, {
      interpretations,
      recommendations,
      mangalDosha: mangalDoshaData
    });

    // Update user's horoscope data in database
    await users.updateOne(
      { _id: userId },
      { 
        $set: {
          horoscope: horoscopeData,
          coordinates: { latitude, longitude },
        }
      }
    );

    return NextResponse.json(horoscopeData);
  } catch (error: any) {
    console.error('Error generating horoscope:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate horoscope' },
      { status: 500 }
    );
  }
}