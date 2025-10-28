
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateAudio } from '../services/geminiService';
import { decode, decodeAudioData, getSharedAudioContext } from '../services/audioService';
import Spinner from './Spinner';

interface AudioPlayerProps {
  audioPrompt: string;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- Caching Mechanism ---
// Cache for decoded audio buffers to avoid re-fetching and re-decoding.
const audioCache = new Map<string, AudioBuffer>();
// Cache for pending audio requests to avoid duplicate fetches for the same prompt.
const pendingRequests = new Map<string, Promise<AudioBuffer>>();
// --- End Caching Mechanism ---

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioPrompt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadAudio = async () => {
      if (isCancelled) return;
      setIsLoading(true);
      setError(null);
      
      let buffer = audioCache.get(audioPrompt);

      if (!buffer) {
        let requestPromise = pendingRequests.get(audioPrompt);
        if (!requestPromise) {
          const audioContext = getSharedAudioContext();
          requestPromise = generateAudio(audioPrompt)
            .then(base64Audio => decode(base64Audio))
            .then(decodedBytes => decodeAudioData(decodedBytes, audioContext, 24000, 1))
            .then(buf => {
                audioCache.set(audioPrompt, buf);
                pendingRequests.delete(audioPrompt);
                return buf;
            })
            .catch(err => {
                pendingRequests.delete(audioPrompt);
                throw err;
            });
          pendingRequests.set(audioPrompt, requestPromise);
        }

        try {
            buffer = await requestPromise;
        } catch (err) {
            if (!isCancelled) {
                console.error('Failed to load audio:', err);
                setError('Could not load audio.');
            }
        }
      }
      
      if (buffer && !isCancelled) {
        audioBufferRef.current = buffer;
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    };
    
    loadAudio();
    
    return () => {
        isCancelled = true;
        if (sourceRef.current) {
            sourceRef.current.onended = null;
            sourceRef.current.stop();
            sourceRef.current = null;
        }
    };
  }, [audioPrompt]);

  const togglePlayback = useCallback(() => {
    const audioContext = getSharedAudioContext();
    if (!audioBufferRef.current || !audioContext) return;

    if (isPlaying && sourceRef.current) {
      sourceRef.current.stop();
    } else {
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(console.error);
      }
      const source = audioContext.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContext.destination);
      source.onended = () => {
        setIsPlaying(false);
        if (sourceRef.current === source) {
            sourceRef.current = null;
        }
      };
      source.start();
      sourceRef.current = source;
      setIsPlaying(true);
    }
  }, [isPlaying]);

  if (isLoading) {
    return (
        <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
            <Spinner />
            <span className="text-secondary">Loading audio...</span>
        </div>
    );
  }

  if (error) {
    return <div className="text-danger bg-red-100 p-3 rounded-lg">{error}</div>;
  }

  return (
    <button
      onClick={togglePlayback}
      className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-primary font-semibold py-2 px-4 rounded-lg transition-colors border border-blue-200"
      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
      <span>{isPlaying ? 'Pause' : 'Play Audio'}</span>
    </button>
  );
};

export default AudioPlayer;
