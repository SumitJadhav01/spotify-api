const axios = require('axios');
const qs = require('querystring');
const logger = require('../config/logger');

let ACCESS_TOKEN = null;
let REFRESH_TOKEN = null;
let EXPIRES_AT = null; // epoch ms

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

function basicAuthHeader() {
  return 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
}

async function requestToken(body) {
  const res = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(body), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: basicAuthHeader()
    }
  });
  return res.data;
}

module.exports = {
  getAccessToken: () => ACCESS_TOKEN,
  getRefreshToken: () => REFRESH_TOKEN,
  setTokensFromAuthCode: async (code) => {
    const data = await requestToken({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI
    });
    ACCESS_TOKEN = data.access_token;
    REFRESH_TOKEN = data.refresh_token;
    EXPIRES_AT = Date.now() + (data.expires_in - 60) * 1000;
    logger.info('Spotify tokens set');
  },
  refreshAccessToken: async () => {
    if (!REFRESH_TOKEN) throw new Error('No refresh token available');
    const data = await requestToken({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN
    });
    ACCESS_TOKEN = data.access_token;
    EXPIRES_AT = Date.now() + (data.expires_in - 60) * 1000;
    logger.info('Spotify access token refreshed');
  },
  ensureValidAccessToken: async () => {
    if (!ACCESS_TOKEN) throw new Error('Not authenticated');
    if (Date.now() > EXPIRES_AT) {
      await module.exports.refreshAccessToken();
    }
  }
};
