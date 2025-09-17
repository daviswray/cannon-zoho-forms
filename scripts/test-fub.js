#!/usr/bin/env node
// Lightweight test script to hit Follow Up Boss /users using env vars.
// Usage: node scripts/test-fub.js
import 'dotenv/config';

const apiKey = process.env.FUB_API_KEY;
const systemName = process.env.FUB_SYSTEM_NAME || '';
const systemKey = process.env.FUB_SYSTEM_KEY || '';

if (!apiKey) {
  console.error('FUB_API_KEY not set. Copy .env.example to .env and add your keys.');
  process.exit(2);
}

const headers = {
  Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
  'X-System': systemName,
  'X-System-Key': systemKey,
  'Content-Type': 'application/json',
};

async function run() {
  try {
    const res = await fetch('https://api.followupboss.com/v1/users', { method: 'GET', headers });
    if (!res.ok) {
      console.error(`FUB request failed: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error('Response body:', text.slice(0, 1000));
      process.exit(3);
    }
    const data = await res.json();
    const users = data.users || [];
    console.log(`Success: found ${users.length} users (showing up to 5):`);
    for (const u of users.slice(0, 5)) {
      console.log(`- ${u.id} ${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`.trim());
    }
  } catch (err) {
    console.error('Request error:', err.message || err);
    process.exit(1);
  }
}

run();
