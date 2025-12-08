import { useState } from 'react';
import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';

export default function UIPlayerExample() {
  const [videoId, setVideoId] = useState('');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_JAAQ_API_KEY || '');
  const [clientId, setClientId] = useState(import.meta.env.VITE_JAAQ_CLIENT_ID || '');
  const [showPlayer, setShowPlayer] = useState(false);

  const handleLoadVideo = () => {
    if (!videoId.trim() || !apiKey || !clientId) {
      alert('Please enter video ID, API key, and client ID');
      return;
    }
    setShowPlayer(true);
  };

  return (
    <div>
      <div className="card">
        <h2>UI Package Video Player</h2>
        <p style={{ marginBottom: '16px', color: '#666' }}>This example uses the VideoPlayer component from @jaaq/jaaq-sdk-js/ui/react</p>

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
        <div className="card">
          <VideoPlayer
            videoId={videoId}
            apiKey={apiKey}
            clientId={clientId}
            autoplay={false}
            showInfo={true}
            onPlay={() => console.log('Video started playing')}
            onPause={() => console.log('Video paused')}
            onError={(error) => console.error('Video error:', error)}
            onLoaded={(video) => console.log('Video loaded:', video)}
          />
        </div>
      )}
    </div>
  );
}
