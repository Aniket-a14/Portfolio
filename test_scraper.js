async function testHackerRank() {
  try {
    const res = await fetch('https://www.hackerrank.com/rest/hackers/aniket_saha/profile');
    const data = await res.json();
    console.log('HR Profile:', data.model ? 'Found' : 'Not Found');
  } catch(e) { console.log('HR Profile error:', e.message); }
}

async function testGFGAPIs() {
  const endpoints = [
    'https://practiceapi.geeksforgeeks.org/api/vr/profile/aniketsaha5353/'
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log('GFG API JSON:', text.substring(0, 50));
    } catch(e) { console.log('GFG API error:', e.message); }
  }
}

async function run() {
  await testHackerRank();
  await testGFGAPIs();
}
run();
