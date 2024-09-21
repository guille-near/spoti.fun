import { NextApiRequest, NextApiResponse } from 'next';

const getAccessToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
};

const getTrackInfo = async (trackId: string, accessToken: string) => {
  const [trackResponse, featuresResponse] = await Promise.all([
    fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }),
    fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
  ]);

  const trackData = await trackResponse.json();
  const featuresData = await featuresResponse.json();

  return { 
    track: {
      ...trackData,
      artistId: trackData.artists[0].id // Añade el ID del artista aquí
    }, 
    features: featuresData 
  };
};

const getTrackByISRC = async (isrc: string, accessToken: string) => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  const data = await response.json();
  if (data.tracks.items.length === 0) {
    throw new Error('No track found for this ISRC');
  }
  return data.tracks.items[0].id;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { input, mode } = req.body;
      let trackId;

      const accessToken = await getAccessToken();

      if (mode === 'url') {
        trackId = input.split('/').pop()?.split('?')[0];
      } else {
        trackId = await getTrackByISRC(input, accessToken);
      }

      if (!trackId) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      const data = await getTrackInfo(trackId, accessToken);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching track information' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}