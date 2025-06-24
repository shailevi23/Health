import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, message: 'API is working' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      success: true, 
      message: 'Received data successfully',
      receivedData: body 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to parse request body',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 400 });
  }
} 