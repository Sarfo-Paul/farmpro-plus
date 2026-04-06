import 'dotenv/config';

const API = process.env.API_URL || 'http://localhost:4000';

async function run() {
  console.log('Running smoke tests against', API);
  try {
    const loginRes = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com', password: 'Password123!' }),
    });
    const body: any = await loginRes.json();
    if (!loginRes.ok) throw body;
    console.log('Login OK, token length:', (body?.token || '').length);

    const token: string = body.token;
    const recRes = await fetch(`${API}/api/records?limit=2`, { headers: { Authorization: `Bearer ${token}` } });
    const recBody: any = await recRes.json();
    console.log('Records fetched:', Array.isArray(recBody?.records) ? recBody.records.length : Object.keys(recBody || {}).length);

    const market: any = await (await fetch(`${API}/api/market-prices?limit=2`)).json();
    console.log('Market prices:', (market.prices || market || []).length || 0);

    console.log('Smoke tests passed');
  } catch (err: any) {
    console.error('Smoke tests failed:', err);
    process.exit(1);
  }
}

run();
