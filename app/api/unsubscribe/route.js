import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      return NextResponse.json({ error: 'Audience ID not configured' }, { status: 500 });
    }

    // Mark as unsubscribed in Resend
    // Note: We update the contact rather than deleting to keep a record of the preference
    const { error } = await resend.contacts.update({
      email: email,
      audienceId: audienceId,
      unsubscribed: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return a simple HTML page confirming the unsubscription
    return new Response(
      `
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body { 
              background: #000; 
              color: #fff; 
              font-family: 'Helvetica Neue', sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              text-align: center;
            }
            h1 { font-weight: 300; letter-spacing: 0.1em; color: #fff; }
            p { color: #666; font-size: 14px; margin-top: 20px; }
            a { color: #fff; text-decoration: none; border-bottom: 1px solid #333; padding-bottom: 2px; font-size: 12px; margin-top: 40px; text-transform: uppercase; letter-spacing: 0.1em; }
          </style>
        </head>
        <body>
          <h1>Transmission Ended.</h1>
          <p>You have been successfully removed from the inner circle.</p>
          <a href="https://aniketdesign.in">Return to Portfolio</a>
        </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
