import { useState } from 'react';
import CollectionsList from './components/CollectionsList';
import VideoPlayer from './components/VideoPlayer';
import HLSPlayer from './components/HLSPlayer';
import VideoGallery from './components/VideoGallery';
import UIPlayerExample from './components/UIPlayerExample';
import WebComponentExample from './components/WebComponentExample';
import CollectionCarousel from './components/CollectionCarousel';
import UIPlayerFeatureToggles from './components/UIPlayerFeatureToggles';
import './App.css';

type DemoType = 'collections' | 'video' | 'hls' | 'gallery' | 'ui-player' | 'web-component' | 'collection-carousel' | 'feature-toggles';

function App() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('collections');

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 JAAQ SDK - React Example</h1>
        <p>Demonstrating SDK integration with React + Vite + TypeScript</p>
      </header>

      <nav className="nav">
        <button className={activeDemo === 'collections' ? 'active' : ''} onClick={() => setActiveDemo('collections')}>
          Collections List
        </button>

        <button className={activeDemo === 'gallery' ? 'active' : ''} onClick={() => setActiveDemo('gallery')}>
          Video Gallery
        </button>

        <button className={activeDemo === 'collection-carousel' ? 'active' : ''} onClick={() => setActiveDemo('collection-carousel')}>
          Collection Carousel
        </button>

        <button className={activeDemo === 'ui-player' ? 'active' : ''} onClick={() => setActiveDemo('ui-player')}>
          UI Player
        </button>

        <button className={activeDemo === 'feature-toggles' ? 'active' : ''} onClick={() => setActiveDemo('feature-toggles')}>
          Feature Toggles
        </button>

        <button className={activeDemo === 'web-component' ? 'active' : ''} onClick={() => setActiveDemo('web-component')}>
          Web Component
        </button>
      </nav>

      <main className="main">
        {activeDemo === 'collections' && <CollectionsList />}
        {activeDemo === 'video' && <VideoPlayer />}
        {activeDemo === 'hls' && <HLSPlayer />}
        {activeDemo === 'gallery' && <VideoGallery />}
        {activeDemo === 'collection-carousel' && <CollectionCarousel />}
        {activeDemo === 'ui-player' && <UIPlayerExample />}
        {activeDemo === 'feature-toggles' && <UIPlayerFeatureToggles />}
        {activeDemo === 'web-component' && <WebComponentExample />}
      </main>
    </div>
  );
}

export default App;
