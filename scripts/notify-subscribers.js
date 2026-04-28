import 'dotenv/config';
import { Resend } from 'resend';
import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new Parser();
const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const MEDIUM_USERNAME = 'aniketsahaworkspace';
const RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;

const LATEST_POST_FILE = path.join(__dirname, '../data/latest-post.json');

async function notify() {
  try {
    // 1. Fetch Medium Feed
    const feed = await parser.parseURL(RSS_URL);
    if (!feed.items || feed.items.length === 0) {
      return;
    }

    const latestPost = feed.items[0];
    const latestId = latestPost.guid || latestPost.link;

    // 2. Check against last notified
    let lastNotifiedId = '';
    if (fs.existsSync(LATEST_POST_FILE)) {
      const data = JSON.parse(fs.readFileSync(LATEST_POST_FILE, 'utf8'));
      lastNotifiedId = data.id;
    }

    if (latestId === lastNotifiedId) {
      return;
    }

    console.log('New post detected:', latestPost.title);

    // 3. Fetch Subscribers from Resend
    if (!AUDIENCE_ID) {
      console.error('RESEND_AUDIENCE_ID is not configured.');
      return;
    }

    const { data: contacts, error: contactError } = await resend.contacts.list({
      audienceId: AUDIENCE_ID,
    });

    if (contactError || !contacts || contacts.data.length === 0) {
      return;
    }

    const emails = contacts.data.map(c => c.email);

    // 4. Send Emails individually to provide personal unsub links
    for (const recipientEmail of emails) {
      // Small delay to respect Resend's rate limit (2 requests/sec)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { error } = await resend.emails.send({
        from: "Aniket Saha <newsletter@aniketdesign.in>",
        to: recipientEmail,
        subject: `New Post: ${latestPost.title}`,
        html: `
          <div style="background-color: #000000; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 60px 20px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; border: 1px solid #333333; padding: 40px; border-radius: 4px;">
              <div style="margin-bottom: 30px;">
                <span style="font-size: 10px; letter-spacing: 0.4em; color: #666666; text-transform: uppercase;">New Publication</span>
              </div>
              
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: normal; margin-bottom: 24px; color: #ffffff; line-height: 1.3;">
                ${latestPost.title}
              </h1>
              
              <p style="font-size: 14px; line-height: 1.8; color: #a0a0a0; margin-bottom: 32px; font-weight: 300; text-align: left;">
                I just published a new piece on Medium. It dives into ${latestPost.categories ? latestPost.categories.join(', ') : 'my latest technical explorations'}.
              </p>
              
              <a href="${latestPost.link}" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 12px 30px; text-decoration: none; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: bold; border-radius: 2px; margin-bottom: 40px;">Read Article</a>
              
              <div style="padding-top: 32px; border-top: 1px solid #1a1a1a;">
                <p style="font-size: 10px; color: #404040; letter-spacing: 0.2em; text-transform: uppercase;">ANIKET'S PORTFOLIO</p>
              </div>

              <div style="margin-top: 40px; opacity: 0.3;">
                <a href="https://aniketdesign.in/api/unsubscribe?email=${recipientEmail}" style="color: #ffffff; text-decoration: none; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;">Unsubscribe</a>
              </div>
            </div>
          </div>
        `,
      });
      if (error) {
        console.error(`Error sending email to ${recipientEmail}:`, error);
      }
    }

    // 5. Update state
    fs.writeFileSync(LATEST_POST_FILE, JSON.stringify({ id: latestId, title: latestPost.title }));

  } catch (err) {
  }
}

notify();
