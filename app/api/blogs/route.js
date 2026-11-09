import { NextResponse } from 'next/server';
import { profileData } from '@/lib/data';

export const dynamic = 'force-dynamic';

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** Trims to the last full sentence within `max` characters (or the last word, with an ellipsis). */
function cutAtSentence(text, max) {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const end = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '));
  return end > max * 0.5 ? head.slice(0, end + 1) : head.replace(/\s+\S*$/, '') + '…';
}

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
      
      const plain = decodeEntities(
        contentEncoded
          .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      );

      // Short snippet (cards on the home page) and a longer opening for the articles page.
      const snippet = plain.substring(0, 120) + '...';
      const excerpt = cutAtSentence(plain, 720);
      const minutes = Math.max(1, Math.round(plain.split(/\s+/).filter(Boolean).length / 220));
      const tags = [...itemContent.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)]
        .map((m) => m[1])
        .slice(0, 3);

      items.push({
        title: decodeEntities(title),
        link,
        pubDate,
        thumbnail,
        snippet,
        excerpt,
        minutes,
        tags
      });
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
