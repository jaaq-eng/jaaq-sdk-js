import { useState, useRef } from 'react';
import { CollectionPlayer } from '@jaaq/jaaq-sdk-js/ui/react';
import type { CollectionDTO } from '@jaaq/jaaq-sdk-js';

type CollectionPlayerHandle = {
  refresh: () => void;
  next: () => void;
  prev: () => void;
  go: (_index: number) => void;
  destroy: () => void;
  getCollection: () => CollectionDTO | null;
};

export default function CollectionCarouselToggles() {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_JAAQ_API_KEY || '');
  const [clientId, setClientId] = useState(import.meta.env.VITE_JAAQ_CLIENT_ID || '');
  const [collectionId, setCollectionId] = useState('');
  const [showCarousel, setShowCarousel] = useState(false);
  const [collection, setCollection] = useState<CollectionDTO | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number | null>(null);
  const [showArrows, setShowArrows] = useState(true);
  const [showDots, setShowDots] = useState(true);

  const carouselRef = useRef<CollectionPlayerHandle>(null);

  const handleLoad = () => {
    if (!apiKey || !clientId || !collectionId) {
      alert('Please fill in API Key, Client ID, and Collection ID');
      return;
    }
    setShowCarousel(true);
  };

  const handleLoaded = (loadedCollection: CollectionDTO) => {
    console.log('Collection loaded:', loadedCollection);
    setCollection(loadedCollection);
  };

  const handleError = (error: Error) => {
    console.error('Collection error:', error);
    alert('Error: ' + error.message);
  };

  const handleSlideChange = (data: { index: number; video: CollectionDTO['videos'][0] }) => {
    console.log('Slide changed:', data);
    setCurrentSlide(data.index);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '8px', color: '#333' }}>Collection Carousel - UI Controls Toggle</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Dynamically toggle arrows and pagination dots</p>
      </div>

      <div
        style={{
          background: '#e7f3ff',
          padding: '16px',
          borderRadius: '8px',
          borderLeft: '4px solid #007bff',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#004085',
        }}
      >
        <strong>Toggle Demo:</strong> Use the checkboxes below to show/hide carousel navigation controls (arrows and dots). Changes are
        applied in real-time.
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ marginBottom: '16px', color: '#333' }}>Configuration</h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>Client ID</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter your client ID"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>Collection ID</label>
          <input
            type="text"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            placeholder="Enter collection ID"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        <button
          onClick={handleLoad}
          style={{
            padding: '12px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Load Collection Carousel
        </button>
      </div>

      {showCarousel && (
        <>
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ marginBottom: '16px', color: '#333' }}>UI Controls</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#333',
                }}
              >
                <input
                  type="checkbox"
                  checked={showArrows}
                  onChange={(e) => setShowArrows(e.target.checked)}
                  style={{
                    marginRight: '8px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
                Show Arrows
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#333',
                }}
              >
                <input
                  type="checkbox"
                  checked={showDots}
                  onChange={(e) => setShowDots(e.target.checked)}
                  style={{
                    marginRight: '8px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
                Show Dots (Pagination)
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <CollectionPlayer
              ref={carouselRef}
              collectionId={collectionId}
              apiKey={apiKey}
              clientId={clientId}
              autoplay={false}
              showArrows={showArrows}
              showDots={showDots}
              onLoaded={handleLoaded}
              onError={handleError}
              onSlideChange={handleSlideChange}
            />
          </div>
        </>
      )}

      {collection && (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ marginBottom: '16px', color: '#333' }}>Carousel Info</h2>

          <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '18px', fontWeight: 600 }}>
              {collection.name || 'Untitled Collection'}
            </h3>
            <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>{collection.description || 'No description'}</p>
            <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
              <strong style={{ color: '#333' }}>Videos:</strong> {collection.videos.length}
            </p>
            {currentSlide !== null && (
              <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                <strong style={{ color: '#333' }}>Current Slide:</strong> {currentSlide}
              </p>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ marginBottom: '16px', color: '#333' }}>Usage Example</h2>
        <pre
          style={{
            background: '#f8f9fa',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '13px',
            border: '1px solid #dee2e6',
          }}
        >
          {`import { CollectionPlayer } from '@jaaq/jaaq-sdk-js/ui/react';

function MyComponent() {
  const [showArrows, setShowArrows] = useState(true);
  const [showDots, setShowDots] = useState(true);

  return (
    <CollectionPlayer
      collectionId="your-collection-id"
      apiKey="your-api-key"
      clientId="your-client-id"
      showArrows={showArrows}
      showDots={showDots}
      onLoaded={(collection) => console.log(collection)}
    />
  );
}`}
        </pre>
      </div>
    </div>
  );
}
