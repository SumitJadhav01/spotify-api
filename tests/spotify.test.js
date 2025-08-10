const request = require('supertest');
const app = require('../src/app');
const spotifyAuth = require('../src/utils/spotifyAuth');
const spotifyService = require('../src/services/spotifyService');

jest.mock('../src/utils/spotifyAuth');
jest.mock('../src/services/spotifyService');

beforeAll(() => {
  spotifyAuth.getAccessToken.mockReturnValue('fake-token');
  spotifyAuth.ensureValidAccessToken.mockResolvedValue();
});

describe('Spotify routes', () => {
  test('GET /spotify/top-tracks returns 200 and items', async () => {
    spotifyService.getTopTracks.mockResolvedValue([{ name: 'Track 1', artists: ['Artist'], uri: 'spotify:track:1' }]);
    const res = await request(app).get('/spotify/top-tracks');
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeDefined();
  });

  test('PUT /spotify/play validates body', async () => {
    const res = await request(app).put('/spotify/play').send({});
    expect(res.statusCode).toBe(400);
  });
});
