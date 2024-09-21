'use client'

import { useState } from 'react'
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowLeftRight, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion, AnimatePresence } from 'framer-motion'

interface TrackInfo {
  type: 'isrc' | 'url'
  value: string
  artist: string
  song: string
  coverUrl: string
  tempo: number
  timeSignature: number
  mode: number
  key: number
  audioFeatures: {
    acousticness: number
    danceability: number
    energy: number
    instrumentalness: number
    liveness: number
    speechiness: number
    valence: number
  }
  artistId: string
}

interface ArtistInfo {
  name: string
  genres: string[]
  followers: number
  popularity: number
  imageUrl: string
}

const keyNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B']

const audioFeatureDescriptions = {
  acousticness: "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
  danceability: "Describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
  energy: "Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale.",
  instrumentalness: "Predicts whether a track contains no vocals. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content.",
  liveness: "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.",
  speechiness: "Detects the presence of spoken words in a track. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 may contain both music and speech. Values below 0.33 most likely represent music and other non-speech-like tracks.",
  valence: "Describes the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
}

export function SpotifyIsrcConverter() {
  const [mode, setMode] = useState<'url' | 'isrc'>('url')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<TrackInfo | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null)

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'url' ? 'isrc' : 'url')
    setInput('')
    setResult(null)
    setError('')
    setArtistInfo(null)
  }

  const convertInput = async () => {
    setResult(null)
    setError('')
    setLoading(true)
    setArtistInfo(null)

    try {
      const response = await fetch('/api/spotify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, mode })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch track information');
      }

      const data = await response.json();
      setResult({
        type: mode === 'url' ? 'isrc' : 'url',
        value: mode === 'url' ? data.track.external_ids.isrc : data.track.external_urls.spotify,
        artist: data.track.artists[0].name,
        song: data.track.name,
        coverUrl: data.track.album.images[0].url,
        tempo: data.features.tempo,
        timeSignature: data.features.time_signature,
        mode: data.features.mode,
        key: data.features.key,
        audioFeatures: {
          acousticness: data.features.acousticness,
          danceability: data.features.danceability,
          energy: data.features.energy,
          instrumentalness: data.features.instrumentalness,
          liveness: data.features.liveness,
          speechiness: data.features.speechiness,
          valence: data.features.valence
        },
        artistId: data.track.artists[0].id
      });
    } catch (error) {
      setError('Error fetching track information. Please try again.');
    }

    setLoading(false)
  }

  const getArtistInfo = async () => {
    if (!result || !result.artistId) {
      setError('No artist information available');
      return;
    }

    setLoading(true)
    try {
      const response = await fetch('/api/spotify/artist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistId: result.artistId })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch artist information');
      }

      const data = await response.json();
      setArtistInfo({
        name: data.name,
        genres: data.genres,
        followers: data.followers.total,
        popularity: data.popularity,
        imageUrl: data.images[0]?.url || ''
      });
    } catch (error) {
      console.error('Error fetching artist info:', error);
      setError('Error fetching artist information. Please try again.');
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-[600px]">
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label htmlFor="spotify-input">
              {mode === 'url' ? 'Spotify Track URL' : 'ISRC'}
            </Label>
            <div className="flex space-x-2">
              <Input
                id="spotify-input"
                placeholder={mode === 'url' ? "https://open.spotify.com/track/..." : "E.g., BRBMG0300729"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={convertInput} disabled={loading}>
                {loading ? 'Loading...' : 'Get Info'}
              </Button>
              <Button variant="outline" size="icon" onClick={toggleMode}>
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex-grow overflow-hidden relative">
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <Image
                      src={result.coverUrl}
                      alt={`${result.song} cover`}
                      width={64}
                      height={64}
                      className="rounded-sm"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{result.song}</p>
                          <button 
                            className="text-xs text-blue-600 hover:underline"
                            onClick={getArtistInfo}
                          >
                            {result.artist}
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          <p>Tempo: {result.tempo.toFixed(1)} BPM</p>
                          <p>Time Signature: {result.timeSignature}/4</p>
                          <p>Mode: {result.mode === 1 ? 'Major' : 'Minor'}</p>
                          <p>Key: {result.key === -1 ? 'No key detected' : keyNames[result.key]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-sm mb-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {result.type === 'isrc' ? 'ISRC:' : 'Spotify URL:'}
                    </p>
                    <p className="text-sm break-all">
                      {result.value}
                    </p>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="audio-features">
                      <AccordionTrigger className="text-sm font-medium text-gray-600">
                        Audio Features
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-white p-2 rounded-md shadow-sm">
                          {Object.entries(result.audioFeatures).map(([feature, value]) => (
                            <div key={feature} className="mb-2">
                              <div className="flex justify-between text-xs mb-1">
                                <div className="flex items-center">
                                  <span className="mr-1">{feature}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="h-3 w-3" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs text-xs">{audioFeatureDescriptions[feature as keyof typeof audioFeatureDescriptions]}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <span>{value.toFixed(3)}</span>
                              </div>
                              <div className="bg-gray-200 h-2 rounded-full">
                                <div 
                                  className="bg-black h-2 rounded-full" 
                                  style={{width: `${value * 100}%`}}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {artistInfo && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 right-0 z-10"
            >
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{artistInfo.name}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setArtistInfo(null)}>
                      Close
                    </Button>
                  </div>
                  <div className="flex items-start space-x-4">
                    {artistInfo.imageUrl && (
                      <Image
                        src={artistInfo.imageUrl}
                        alt={`${artistInfo.name} image`}
                        width={100}
                        height={100}
                        className="rounded-md"
                      />
                    )}
                    <div className="flex-grow">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Followers</p>
                          <p className="text-sm font-medium">{artistInfo.followers.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Popularity</p>
                          <p className="text-sm font-medium">{artistInfo.popularity}/100</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Genres</p>
                        <div className="flex flex-wrap gap-1">
                          {artistInfo.genres.map((genre, index) => (
                            <span key={index} className="text-xs bg-gray-200 rounded-full px-2 py-1">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}