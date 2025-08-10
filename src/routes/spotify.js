const express = require('express');
const router = express.Router();
const controller = require('../controllers/spotifyController');
const ensureAuth = require('../middleware/auth');

// Public: start OAuth
router.get('/login', controller.login);
router.get('/callback', controller.callback);

// Protected endpoints
router.get('/top-tracks', ensureAuth, controller.topTracks);
router.get('/now-playing', ensureAuth, controller.nowPlaying);
router.get('/followed-artists', ensureAuth, controller.followedArtists);
router.put('/play', ensureAuth, controller.play);
router.put('/pause', ensureAuth, controller.pause);

module.exports = router;
