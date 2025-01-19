import { NextResponse } from 'next/server';
import getDb from '@/lib/astradb';

export async function POST(req: Request) {
  try {
    console.log('Connecting to Astra DB...');
    const db = await getDb();
    const users = db.collection('users');
    
    // Parse request body
    const body = await req.json();
    console.log('Received user data:', body);

    // Format the date properly
    const formattedBody = {
      ...body,
      dateOfBirth: new Date(body.dateOfBirth).toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await users.find({
      name: body.name,
      timeOfBirth: body.timeOfBirth,
      dateOfBirth: formattedBody.dateOfBirth
    }).toArray();

    if (existingUser.length > 0) {
      console.log('Found existing user:', existingUser[0].name);
      return NextResponse.json(existingUser[0]);
    }

    // Create new user
    console.log('Creating new user with data:', formattedBody);
    const result = await users.insertOne(formattedBody);
    const newUser = { _id: result.insertedId, ...formattedBody };
    console.log('User created successfully:', newUser._id);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Error in user creation:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Something went wrong',
        details: error.stack
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const users = db.collection('users');
    const allUsers = await users.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(allUsers);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}