import { useState, useRef } from 'react';
import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';
import type { VideoDTO } from '@jaaq/jaaq-sdk-js';

type VideoPlayerHandle = {
  play: () => void;
  pause: () => void;
  setVolume: (_volume: number) => void;
  toggleMute: () => void;
  seek: (_time: number) => void;
  getState: () => any;
  destroy: () => void;
};

export default function UIPlayerFeatureToggles() {
  const [videoId, setVideoId] = useState('');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_JAAQ_API_KEY || '');
  const [clientId, setClientId] = useState(import.meta.env.VITE_JAAQ_CLIENT_ID || '');
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoData, setVideoData] = useState<VideoDTO | null>(null);

  const [controls, setControls] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [startMuted, setStartMuted] = useState(false);

  const playerRef = useRef<VideoPlayerHandle>(null);

  const handleLoadVideo = () => {
    if (!videoId.trim() || !apiKey || !clientId) {
      alert('Please enter video ID, API key, and client ID');
      return;
    }
    setShowPlayer(true);
  };

  const handleLoaded = (video: VideoDTO) => {
    console.log('Video loaded:', video);
    setVideoData(video);
  };

  const handleGetState = () => {
    const state = playerRef.current?.getState();
    console.log('Current player state:', state);
    alert('Check console for player state');
  };

  return (
    <div>
      <div className="card">
        <h2>Video Player Feature Toggles</h2>
        <p style={{ marginBottom: '16px', color: '#666' }}>
          Toggle player features on the fly without reloading. The player updates instantly when you change any toggle.
        </p>

        <details style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '500', color: '#333' }}>About this demo</summary>
          <div style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
            <p style={{ marginBottom: '8px' }}>
              This example demonstrates real-time feature toggling without recreating the player. When you toggle any feature, the player
              updates its display immediately while continuing playback.
            </p>
            <p>Features you can toggle: logo, title, author (if available), description, and captions button visibility.</p>
          </div>
        </details>

        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ marginBottom: '12px' }}
        />

        <input
          type="text"
          placeholder="Enter Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          style={{ marginBottom: '12px' }}
        />

        <input
          type="text"
          placeholder="Enter video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoadVideo()}
        />

        <button className="primary" onClick={handleLoadVideo}>
          Load Video
        </button>

        {showPlayer && (
          <button className="primary" onClick={() => setShowPlayer(false)} style={{ marginTop: '12px', background: '#6c757d' }}>
            Reset
          </button>
        )}
      </div>

      {showPlayer && (
        <>
          <div className="card">
            <h3>Feature Toggles</h3>
            <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
              Toggle these features while the video is playing to see instant updates:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <button
                onClick={() => setControls(!controls)}
                style={{
                  padding: '10px 20px',
                  background: controls ? '#007bff' : '#e9ecef',
                  color: controls ? 'white' : '#495057',
                  border: controls ? '2px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {controls ? '✓' : '○'} Controls
              </button>

              <button
                onClick={() => setShowLogo(!showLogo)}
                style={{
                  padding: '10px 20px',
                  background: showLogo ? '#007bff' : '#e9ecef',
                  color: showLogo ? 'white' : '#495057',
                  border: showLogo ? '2px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {showLogo ? '✓' : '○'} Logo
              </button>

              <button
                onClick={() => setShowTitle(!showTitle)}
                style={{
                  padding: '10px 20px',
                  background: showTitle ? '#007bff' : '#e9ecef',
                  color: showTitle ? 'white' : '#495057',
                  border: showTitle ? '2px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {showTitle ? '✓' : '○'} Title
              </button>

              <button
                onClick={() => setShowAuthor(!showAuthor)}
                style={{
                  padding: '10px 20px',
                  background: showAuthor ? '#007bff' : '#e9ecef',
                  color: showAuthor ? 'white' : '#495057',
                  border: showAuthor ? '2px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {showAuthor ? '✓' : '○'} Author
              </button>

              <button
                onClick={() => setShowDescription(!showDescription)}
                style={{
                  padding: '10px 20px',
                  background: showDescription ? '#007bff' : '#e9ecef',
                  color: showDescription ? 'white' : '#495057',
                  border: showDescription ? '2px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {showDescription ? '✓' : '○'} Description
              </button>

              <button
                onClick={() => setShowCaptions(!showCaptions)}
                style={{
                  padding: '10px 20px',
                  background: showCaptions ? '#007bff' : '#e9ecef',
                  color: showCaptions ? 'white' : '#495057',
                  border: showCaptions ? '2px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {showCaptions ? '✓' : '○'} Captions
              </button>

              <button
                onClick={() => setStartMuted(!startMuted)}
                style={{
                  padding: '10px 20px',
                  background: startMuted ? '#007bff' : '#e9ecef',
                  color: startMuted ? 'white' : '#495057',
                  border: startMuted ? '2px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {startMuted ? '✓' : '○'} Start Muted
              </button>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid #dee2e6' }}>
              <button onClick={handleGetState} style={{ fontSize: '14px', background: '#6c757d' }}>
                Log Player State to Console
              </button>
            </div>
          </div>

          <div className="card">
            <VideoPlayer
              ref={playerRef}
              videoId={videoId}
              apiKey={apiKey}
              clientId={clientId}
              autoplay={false}
              controls={controls}
              showLogo={showLogo}
              showTitle={showTitle}
              showAuthor={showAuthor}
              showDescription={showDescription}
              showCaptions={showCaptions}
              startMuted={startMuted}
              onLoaded={handleLoaded}
              onPlay={() => console.log('Video started playing')}
              onPause={() => console.log('Video paused')}
              onError={(error) => console.error('Video error:', error)}
            />
          </div>

          {videoData && (
            <div className="card">
              <h3>Video Info</h3>
              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                <p style={{ marginBottom: '8px', color: '#333' }}>
                  <strong>Video ID:</strong> {videoData.id}
                </p>
                <p style={{ marginBottom: '8px', color: '#333' }}>
                  <strong>Question/Title:</strong> {videoData.question || 'N/A'}
                </p>
                <p style={{ marginBottom: '8px', color: '#333' }}>
                  <strong>Description:</strong> {videoData.description || 'N/A'}
                </p>
                <p style={{ marginBottom: '8px', color: '#333' }}>
                  <strong>Duration:</strong> {videoData.duration} seconds
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
