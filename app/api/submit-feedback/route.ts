import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the Google Apps Script URL from environment variables
    // Try multiple possible sources
    const GOOGLE_SCRIPT_URL = 
      process.env.GOOGLE_SCRIPT_URL || 
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    
    // Debug logging - check all env vars
    console.log('=== Environment Variable Debug ===');
    console.log('GOOGLE_SCRIPT_URL:', GOOGLE_SCRIPT_URL ? 'SET' : 'NOT SET');
    console.log('All env vars starting with GOOGLE:', 
      Object.keys(process.env).filter(key => key.includes('GOOGLE'))
    );
    console.log('URL value:', GOOGLE_SCRIPT_URL || 'undefined');
    console.log('================================');
    
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.trim() === '') {
      console.error('ERROR: GOOGLE_SCRIPT_URL is not set or is empty');
      console.error('Please ensure:');
      console.error('1. .env.local file exists in project root');
      console.error('2. File contains: GOOGLE_SCRIPT_URL=https://script.google.com/...');
      console.error('3. No quotes around the URL');
      console.error('4. Dev server was restarted after creating/updating .env.local');
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Google Script URL not configured. Please check: 1) .env.local file exists in project root, 2) Contains GOOGLE_SCRIPT_URL=your_url, 3) Dev server was restarted.' 
        },
        { status: 500 }
      );
    }

    // Send data to Google Sheets via Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: body.customerName,
        city: body.city,
        contactNumber: body.contactNumber,
        email: body.email,
        feedback: body.feedback,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json(
        { success: true, message: 'Feedback submitted successfully!' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to submit feedback' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while submitting feedback' },
      { status: 500 }
    );
  }
}
