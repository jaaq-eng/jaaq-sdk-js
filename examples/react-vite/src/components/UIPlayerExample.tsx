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
        <h2>React Video Player Wrapper</h2>
        <p style={{ marginBottom: '16px', color: '#666' }}>
          This example uses the VideoPlayer component from @jaaq/jaaq-sdk-js/ui/react. The React component is a thin wrapper around the web
          component with React-friendly props and callbacks.
        </p>

        <details style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '500', color: '#333' }}>Usage Example</summary>
          <pre
            style={{
              marginTop: '12px',
              padding: '12px',
              background: '#fff',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '12px',
              border: '1px solid #dee2e6',
            }}
          >
            {`npm install @jaaq/jaaq-sdk-js react react-dom

import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';

function App() {
  return (
    <VideoPlayer
      videoId="your-video-id"
      apiKey="your-api-key"
      clientId="your-client-id"
      autoplay={false}
      showInfo={true}
      onPlay={() => console.log('Playing')}
      onPause={() => console.log('Paused')}
      onError={(error) => console.error(error)}
      onLoaded={(video) => console.log('Loaded:', video)}
    />
  );
}`}
          </pre>
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
