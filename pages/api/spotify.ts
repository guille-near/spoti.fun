import { NextApiRequest, NextApiResponse } from 'next';

const getAccessToken = async () => {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify client ID or client secret is missing');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

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
  try {
    const { input, mode } = req.body;

    if (!input || !mode) {
      return res.status(400).json({ message: 'Input and mode are required' });
    }

    const accessToken = await getAccessToken();
    let trackId;

    if (mode === 'url') {
      const urlParts = input.split('/');
      trackId = urlParts[urlParts.length - 1].split('?')[0];
    } else {
      trackId = await getTrackByISRC(input, accessToken);
    }

    const trackInfo = await getTrackInfo(trackId, accessToken);

    res.status(200).json(trackInfo);
  } catch (error) {
    console.error('Error in Spotify API handler:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unexpected error occurred' });
  }
}