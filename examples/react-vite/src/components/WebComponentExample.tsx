import { useEffect, useRef, useState } from 'react';
import '@jaaq/jaaq-sdk-js/ui/webcomponents';
import type { JaaqVideoPlayerElement } from '@jaaq/jaaq-sdk-js/ui/webcomponents';

export default function WebComponentExample() {
  const playerRef = useRef<JaaqVideoPlayerElement>(null);
  const [videoId, setVideoId] = useState('');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_JAAQ_API_KEY || '');
  const [clientId, setClientId] = useState(import.meta.env.VITE_JAAQ_CLIENT_ID || '');
  const [showPlayer, setShowPlayer] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleLoaded = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      addLog(`loaded: ${detail.id}`);
    };

    const handlePlay = () => addLog('play');
    const handlePause = () => addLog('pause');
    const handleError = (e: Event) => {
      const error = (e as CustomEvent).detail;
      addLog(`error: ${error.message}`);
    };

    player.addEventListener('jaaq:loaded', handleLoaded);
    player.addEventListener('jaaq:play', handlePlay);
    player.addEventListener('jaaq:pause', handlePause);
    player.addEventListener('jaaq:error', handleError);

    return () => {
      player.removeEventListener('jaaq:loaded', handleLoaded);
      player.removeEventListener('jaaq:play', handlePlay);
      player.removeEventListener('jaaq:pause', handlePause);
      player.removeEventListener('jaaq:error', handleError);
    };
  }, [showPlayer]);

  const handleLoadVideo = () => {
    if (!videoId.trim() || !apiKey || !clientId) {
      alert('Please enter video ID, API key, and client ID');
      return;
    }
    setShowPlayer(true);
  };

  const handlePlay = () => {
    playerRef.current?.play();
  };

  const handlePause = () => {
    playerRef.current?.pause();
  };

  const handleMute = () => {
    playerRef.current?.toggleMute();
  };

  const handleSeek = () => {
    playerRef.current?.seek(10);
  };

  const handleGetState = () => {
    const state = playerRef.current?.getState();
    console.log('Player state:', state);
    addLog(`state: ${JSON.stringify(state, null, 2)}`);
  };

  return (
    <div>
      <div className="card">
        <h2>Web Component in React</h2>
        <p style={{ marginBottom: '16px', color: '#666' }}>This example uses the native &lt;jaaq-video-player&gt; web component in React</p>

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
            <jaaq-video-player ref={playerRef} video-id={videoId} api-key={apiKey} client-id={clientId} autoplay="false" width="100%" />
          </div>

          <div className="card">
            <h3>Programmatic Controls</h3>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button onClick={handlePlay}>Play</button>
              <button onClick={handlePause}>Pause</button>
              <button onClick={handleMute}>Toggle Mute</button>
              <button onClick={handleSeek}>Seek to 10s</button>
              <button onClick={handleGetState}>Get State</button>
            </div>
          </div>

          <div className="card">
            <h3>Event Logs</h3>
            <div
              style={{
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {logs.length === 0 ? (
                <div style={{ color: '#999' }}>Waiting for events...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} style={{ marginBottom: '4px', color: '#666' }}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
