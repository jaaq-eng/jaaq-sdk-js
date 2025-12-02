import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { jaaqClient } from '../lib/jaaq';
import type { Video } from '@jaaq/jaaq-sdk-js';

export default function HLSPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [videoId, setVideoId] = useState('');
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hlsSupported, setHlsSupported] = useState(true);

  useEffect(() => {
    if (!Hls.isSupported() && videoRef.current && !videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      setHlsSupported(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  async function handleLoadVideo() {
    if (!videoId.trim()) {
      setError('Please enter a video ID');
      return;
    }

    if (!hlsSupported) {
      setError('HLS is not supported in your browser');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const response = await jaaqClient.videos.getById(videoId.trim());
      const video = response?.video || null;

      if (!video.videoUrl.includes('.m3u8')) {
        setError('This video is not in HLS format. Please use the basic Video Player instead.');
        setLoading(false);
        return;
      }

      setVideoData(video);

      if (videoRef.current) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });

          hls.loadSource(video.videoUrl);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play();
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setError(`HLS Error: ${data.type} - ${data.details}`);
            }
          });

          hlsRef.current = hls;
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = video.videoUrl;
          videoRef.current.play();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video');
      setVideoData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>HLS Player</h2>
        <p style={{ marginBottom: '16px', color: '#666' }}>Enter a video ID with HLS format (.m3u8) to stream</p>

        {!hlsSupported && (
          <div className="error" style={{ marginBottom: '16px' }}>
            HLS is not supported in your browser
          </div>
        )}

        <input
          type="text"
          placeholder="Enter video ID (HLS format)"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoadVideo()}
          disabled={!hlsSupported}
        />

        <button className="primary" onClick={handleLoadVideo} disabled={loading || !hlsSupported}>
          {loading ? 'Loading...' : 'Load HLS Video'}
        </button>

        {error && (
          <div className="error" style={{ marginTop: '16px' }}>
            {error}
          </div>
        )}
      </div>

      {videoData && (
        <div className="card">
          <div className="video-container">
            <video ref={videoRef} controls />
          </div>

          <div className="video-info">
            <h3>{videoData.title || 'Untitled Video'}</h3>
            <p>
              <strong>Video ID:</strong> {videoData.id}
            </p>
            <p>
              <strong>Duration:</strong> {videoData.duration || 'Unknown'} seconds
            </p>
            <p>
              <strong>Format:</strong> HLS (.m3u8)
            </p>
            <p>
              <strong>HLS.js Version:</strong> {Hls.version}
            </p>
            <p>
              <strong>Using:</strong> {Hls.isSupported() ? 'HLS.js' : 'Native HLS (Safari)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
