import 'dotenv/config';

const API = process.env.API_URL || 'http://localhost:4000';

async function run() {
  console.log('Running admin smoke tests against', API);
  try {
    const loginRes = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com', password: 'Password123!' }),
    });
    const body: any = await loginRes.json();
    if (!loginRes.ok) throw body;
    const token: string = body.token;
    console.log('Logged in as admin, token length:', token.length);

    const usersRes = await fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
    const usersBody: any = await usersRes.json();
    if (!usersRes.ok) throw usersBody;
    console.log('Admin users fetched:', (usersBody.users || []).length);

    console.log('Admin smoke tests passed');
  } catch (err: any) {
    console.error('Admin tests failed:', err);
    process.exit(1);
  }
}

run();
