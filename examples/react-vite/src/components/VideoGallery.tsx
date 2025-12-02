import { useEffect, useState } from 'react';
import { jaaqClient } from '../lib/jaaq';
import type { Video } from '@jaaq/jaaq-sdk-js';

type VideoWithCollection = Video & {
  collectionName: string;
  collectionId: string;
};

export default function VideoGallery() {
  const [videos, setVideos] = useState<VideoWithCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoWithCollection | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      setLoading(true);
      setError(null);

      const response = await jaaqClient.collections.list();
      const collections = response?.collections || [];

      const allVideos: VideoWithCollection[] = [];

      for (const collection of collections) {
        if (collection.videos && collection.videos.length > 0) {
          const videosWithCollection = collection.videos.map((video) => ({
            ...video,
            collectionName: collection.name || 'Untitled Collection',
            collectionId: collection.id,
          }));
          allVideos.push(...videosWithCollection);
        }
      }

      setVideos(allVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }

  async function handleVideoClick(video: VideoWithCollection) {
    try {
      const response = await jaaqClient.videos.getById(video.videoId);
      const fullVideo = response?.video || null;
      setSelectedVideo({
        ...fullVideo,
        collectionName: video.collectionName,
        collectionId: video.collectionId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video details');
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading video gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Video Gallery ({videos.length} videos)</h2>
        {videos.length === 0 ? (
          <p>No videos found in any collection</p>
        ) : (
          <div className="grid">
            {videos.map((video) => (
              <div key={`${video.collectionId}-${video.id}`} className="collection-card" onClick={() => handleVideoClick(video)}>
                <h3>{video.question || 'Untitled Video'}</h3>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>from {video.collectionName}</p>
                <div className="meta">
                  <span>ID: {video.id}</span>
                  {video.duration && <span>{video.duration}s</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedVideo && (
        <div className="card">
          <h2>Video Details</h2>
          {selectedVideo.videoUrl && (
            <div style={{ marginBottom: '20px' }}>
              <video
                key={selectedVideo.videoUrl}
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                style={{ width: '100%', maxWidth: '800px', borderRadius: '8px' }}
              />
            </div>
          )}
          <div className="video-info">
            <h3>{selectedVideo.question || 'Untitled Video'}</h3>
            <p>
              <strong>Video ID:</strong> {selectedVideo.id}
            </p>
            <p>
              <strong>Collection:</strong> {selectedVideo.collectionName} ({selectedVideo.collectionId})
            </p>
            <p>
              <strong>Duration:</strong> {selectedVideo.duration || 'Unknown'} seconds
            </p>
            <p>
              <strong>Format:</strong> {selectedVideo.videoUrl?.includes('.m3u8') ? 'HLS' : 'MP4'}
            </p>
            {selectedVideo.videoUrl && (
              <p>
                <strong>URL:</strong> {selectedVideo.videoUrl}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
