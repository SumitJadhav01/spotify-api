const spotifyAuth = require('../utils/spotifyAuth');

// Ensures that server has a valid access token in memory (or refreshes it)
module.exports = async function ensureAuth(req, res, next) {
  try {
    if (!spotifyAuth.getAccessToken()) {
      return res.status(401).json({ error: 'Not authenticated with Spotify. Please visit /spotify/login' });
    }

    // Optionally refresh if near expiry
    await spotifyAuth.ensureValidAccessToken();
    next();
  } catch (err) {
    next(err);
  }
};
