import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import { parse } from 'url';
import open from 'open';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Define the same scopes your app uses
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

// Generate and open the authorization URL
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'  // Forces a refresh token to be returned
});

console.log('Authorize this app by visiting this URL:', authorizeUrl);
open(authorizeUrl);

// Create a simple server to receive the auth code
http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  
  if (parsedUrl.pathname === '/code') {
    const code = parsedUrl.query.code;
    console.log('Authorization code:', code);
    
    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('Refresh token:', tokens.refresh_token);
      console.log('Access token:', tokens.access_token);
      console.log('\nUpdate your .env file with this new refresh token');
      
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<html><body><h1>Authentication successful!</h1><p>You can close this window now.</p><p>Check your terminal for the new refresh token.</p></body></html>');
    } catch (error) {
      console.error('Error getting tokens:', error);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('An error occurred during authentication');
    }
    
    process.exit(0);
  }
}).listen(4100, () => {
  console.log('Listening for authorization code on port 4100');
});