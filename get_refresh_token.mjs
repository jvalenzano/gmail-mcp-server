import http from 'http';
import { URL } from 'url';
import open from 'open';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:4100/code';
const PORT = parseInt(process.env.PORT || '4100', 10);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

console.log('Opening browser for authorization...');
console.log('Auth URL:', authUrl.toString());
open(authUrl.toString());

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/code') {
    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('No authorization code received');
      return;
    }

    // Exchange code for tokens using fetch
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const tokens = await tokenRes.json();

    if (tokens.refresh_token) {
      console.log('\n=== SUCCESS ===');
      console.log('Refresh token:', tokens.refresh_token);
      console.log('\nUpdate your .env file with this refresh token.');
    } else {
      console.error('No refresh token in response:', tokens);
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><body><h1>Authentication successful!</h1><p>You can close this window. Check your terminal for the refresh token.</p></body></html>');
    server.close();
    process.exit(0);
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} for authorization callback...`);
});
