import { NextResponse } from 'next/server';
import { profileData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const username = profileData.mediumUsername;
    const rssUrl = `https://medium.com/feed/@${username}`;
    
    const response = await fetch(rssUrl, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error('Failed to fetch Medium RSS feed');
    }
    
    const xmlText = await response.text();
    
    // Simple XML parsing using regex for Medium RSS
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];
      
      const title = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || 
                    itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
                    
      const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      
      const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      
      // Extract thumbnail from content:encoded or description
      const contentEncoded = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || 
                             itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || '';
      
      const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = imgMatch ? imgMatch[1] : '';
      
      // Get a short snippet from content, removing all HTML tags and CDATA markers
      const snippet = contentEncoded
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 120) + '...';
        
      items.push({
        title,
        link,
        pubDate,
        thumbnail,
        snippet
      });
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
