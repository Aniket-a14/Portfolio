import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Newsletter service is not configured.' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 1. Add to Resend Audience (Contact List)
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email: email,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    }

    // 2. Send the Welcome Email
    const { data, error } = await resend.emails.send({
      from: "Aniket Saha <newsletter@aniketdesign.in>",
      to: [email],
      subject: "Welcome to the Inner Circle",
      html: `
        <div style="background-color: #000000; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 80px 20px; text-align: center;">
          <div style="max-width: 500px; margin: 0 auto; border: 1px solid #333333; padding: 60px 40px; border-radius: 8px;">
            <div style="margin-bottom: 50px;">
              <span style="font-size: 11px; letter-spacing: 0.5em; color: #666666; text-transform: uppercase; font-weight: bold;">ESTABLISHED 2026</span>
            </div>
            
            <h1 style="font-family: Georgia, serif; font-size: 38px; font-weight: normal; margin-bottom: 28px; color: #ffffff; line-height: 1.2;">
              Welcome to the <br />
              <i style="color: #bbbbbb;">Inner Circle.</i>
            </h1>
            
            <div style="width: 60px; height: 1px; background-color: #ffffff; margin: 0 auto 40px; opacity: 0.2;"></div>
            
            <p style="font-size: 16px; line-height: 1.8; color: #d1d1d1; margin-bottom: 40px; font-weight: 300;">
              You've successfully joined my private list. <br />
              Expect technical deep-dives, design explorations, and early project drops delivered directly to your inbox.
            </p>
            
            <div style="margin-top: 50px; padding-top: 40px; border-top: 1px solid #222222;">
              <p style="font-size: 14px; color: #ffffff; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; font-weight: bold;">Aniket Saha</p>
              <p style="font-size: 11px; color: #555555; letter-spacing: 0.3em; text-transform: uppercase;">ANIKET'S PORTFOLIO</p>
            </div>
          </div>
          
          <div style="margin-top: 50px;">
            <a href="https://aniketdesign.in" style="color: #ffffff; text-decoration: none; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; border-bottom: 1px solid #333333; padding-bottom: 4px;">Visit Portfolio</a>
          </div>
          
          <div style="margin-top: 40px; opacity: 0.3;">
            <a href="https://aniketdesign.in/api/unsubscribe?email=${email}" style="color: #ffffff; text-decoration: none; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;">Unsubscribe</a>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
