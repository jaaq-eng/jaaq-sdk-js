import { useState } from 'react';
import CollectionsList from './components/CollectionsList';
import VideoPlayer from './components/VideoPlayer';
import HLSPlayer from './components/HLSPlayer';
import VideoGallery from './components/VideoGallery';
import './App.css';

type DemoType = 'collections' | 'video' | 'hls' | 'gallery';

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
      </nav>

      <main className="main">
        {activeDemo === 'collections' && <CollectionsList />}
        {activeDemo === 'video' && <VideoPlayer />}
        {activeDemo === 'hls' && <HLSPlayer />}
        {activeDemo === 'gallery' && <VideoGallery />}
      </main>
    </div>
  );
}

export default App;
