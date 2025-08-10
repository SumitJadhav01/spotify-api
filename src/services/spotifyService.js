const axios = require('axios');
const spotifyAuth = require('../utils/spotifyAuth');

function authHeader() {
  return { Authorization: `Bearer ${spotifyAuth.getAccessToken()}` };
}

module.exports = {
  getTopTracks: async (limit = 10) => {
    const res = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}`, {
      headers: authHeader()
    });
    return res.data.items.map(t => ({ name: t.name, artists: t.artists.map(a => a.name), uri: t.uri }));
  },

  getNowPlaying: async () => {
    const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: authHeader()
    });
    if (!res.data || !res.data.item) return null;
    const d = res.data;
    return { name: d.item.name, artists: d.item.artists.map(a => a.name), is_playing: d.is_playing };
  },

  getFollowedArtists: async (limit = 20, after) => {
    let url = `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`;
    if (after) url += `&after=${after}`;
    const res = await axios.get(url, { headers: authHeader() });
    return {
      artists: res.data.artists.items.map(a => ({ id: a.id, name: a.name })),
      cursors: res.data.artists.cursors
    };
  },

  play: async (uri) => {
    await axios.put('https://api.spotify.com/v1/me/player/play', { uris: [uri] }, { headers: authHeader() });
  },

  pause: async () => {
    await axios.put('https://api.spotify.com/v1/me/player/pause', null, { headers: authHeader() });
  }
};
