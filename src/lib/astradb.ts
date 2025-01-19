import { DataAPIClient } from "@datastax/astra-db-ts";

if (!process.env.ASTRA_DB_TOKEN || !process.env.ASTRA_DB_ENDPOINT) {
  throw new Error('Please add your Astra DB credentials to .env.local');
}

let client: DataAPIClient | null = null;
let db: any = null;

export async function getDb() {
  if (db) {
    return db;
  }

  try {
    client = new DataAPIClient(process.env.ASTRA_DB_TOKEN as string);
    db = client.db(process.env.ASTRA_DB_ENDPOINT as string);
    
    // Test the connection
    const collections = await db.listCollections();
    console.log('Connected to AstraDB:', collections);

    // Create collections if they don't exist
    if (!collections.find((c: any) => c.name === 'users')) {
      console.log('Creating users collection...');
      await db.createCollection('users');
    }
    
    if (!collections.find((c: any) => c.name === 'horoscope_data')) {
      console.log('Creating horoscope_data collection...');
      await db.createCollection('horoscope_data');
    }
    
    return db;
  } catch (error) {
    console.error('Astra DB connection error:', error);
    throw error;
  }
}

export async function storeHoroscopeData(userId: string, data: any) {
  try {
    const db = await getDb();
    const collection = db.collection('horoscope_data');

    // Store only the key data we need
    const keyData = {
      userId,
      interpretations: data.interpretations,
      recommendations: data.recommendations,
      mangalDosha: data.mangalDosha,
      lastUpdated: new Date()
    };

    await collection.insertOne(keyData);
    console.log('Stored horoscope data for user:', userId);
    return true;
  } catch (error) {
    console.error('Error storing horoscope data:', error);
    throw error;
  }
}

export default getDb; 