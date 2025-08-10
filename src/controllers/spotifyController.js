const spotifyService = require('../services/spotifyService');
const spotifyAuth = require('../utils/spotifyAuth');
const Joi = require('joi');

exports.login = (req, res) => {
  const scopes = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-top-read',
    'user-follow-read'
  ];

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
};

exports.callback = async (req, res, next) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'Missing code' });
  try {
    await spotifyAuth.setTokensFromAuthCode(code);
    res.json({ message: 'Spotify authentication successful. You can now use the /spotify endpoints.' });
  } catch (err) {
    next(err);
  }
};

exports.topTracks = async (req, res, next) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);
    const tracks = await spotifyService.getTopTracks(limit);
    res.json({ limit, items: tracks });
  } catch (err) {
    next(err);
  }
};

exports.nowPlaying = async (req, res, next) => {
  try {
    const now = await spotifyService.getNowPlaying();
    if (!now) return res.json({ message: 'Nothing is playing' });
    res.json(now);
  } catch (err) {
    next(err);
  }
};

exports.followedArtists = async (req, res, next) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const after = req.query.after;
    const data = await spotifyService.getFollowedArtists(limit, after);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.play = async (req, res, next) => {
  const schema = Joi.object({ uri: Joi.string().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  try {
    await spotifyService.play(value.uri);
    res.json({ message: 'Playback started' });
  } catch (err) {
    next(err);
  }
};

exports.pause = async (req, res, next) => {
  try {
    await spotifyService.pause();
    res.json({ message: 'Playback paused' });
  } catch (err) {
    next(err);
  }
};
