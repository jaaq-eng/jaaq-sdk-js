import { useRef, useState } from 'react';
import { jaaqClient } from '../lib/jaaq';
import type { Video } from '@jaaq/jaaq-sdk-js';

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoId, setVideoId] = useState('');
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoadVideo() {
    if (!videoId.trim()) {
      setError('Please enter a video ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const video = await jaaqClient.videos.getById(videoId.trim());
      setVideoData(video);

      if (videoRef.current) {
        videoRef.current.src = video.videoUrl;
        videoRef.current.load();
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
        <h2>Video Player</h2>
        <p style={{ marginBottom: '16px', color: '#666' }}>Enter a video ID to load and play the video</p>

        <input
          type="text"
          placeholder="Enter video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoadVideo()}
        />

        <button className="primary" onClick={handleLoadVideo} disabled={loading}>
          {loading ? 'Loading...' : 'Load Video'}
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
              <strong>Format:</strong> {videoData.videoUrl.endsWith('.m3u8') ? 'HLS' : 'MP4'}
            </p>
            <p>
              <strong>URL:</strong> {videoData.videoUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
