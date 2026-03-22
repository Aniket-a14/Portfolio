import { NextResponse } from 'next/server';
import { codingProfiles } from '@/app/lib/data';

export async function GET() {
  try {
    const updatedProfiles = await Promise.all(
      codingProfiles.map(async (profile) => {
        if (profile.name.toLowerCase() === 'leetcode') {
          try {
            const lcQuery = `
              query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                  submitStats {
                    acSubmissionNum {
                      difficulty
                      count
                    }
                  }
                }
              }
            `;
            // Extract username from URL "https://leetcode.com/u/Wizard_a14/"
            const urlParts = profile.url.split('/u/');
            const username = urlParts.length > 1 ? urlParts[1].replace(/\/$/, "") : 'Wizard_a14';

            const lcRes = await fetch('https://leetcode.com/graphql', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: lcQuery, variables: { username } }),
              next: { revalidate: 3600 }
            });

            if (lcRes.ok) {
              const data = await lcRes.json();
              if (data?.data?.matchedUser?.submitStats?.acSubmissionNum) {
                const allDiff = data.data.matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === 'All');
                if (allDiff && allDiff.count !== undefined) {
                  return { ...profile, stats: `- ${allDiff.count}+ Problems Solved` };
                }
              }
            }
          } catch (e) {
            console.error("LeetCode fetch error:", e);
          }
        }
        
        // For GeeksforGeeks and HackerRank, return the static ones since APIs are blocked by CSR/Auth without full scraping setup
        return profile;
      })
    );
    return NextResponse.json(updatedProfiles);
  } catch (error) {
    console.error("Error fetching coding profiles data:", error);
    return NextResponse.json(codingProfiles); // fallback to hardcoded
  }
}
