# JAAQ SDK - React + Vite Example

Modern React application demonstrating JAAQ SDK integration with TypeScript and Vite.

## Features

- 🎬 **Collections List** - Browse and view all collections
- 📹 **Video Player** - Basic video playback
- 🎥 **HLS Player** - Streaming with hls.js
- 🖼️ **Video Gallery** - Browse all videos across collections
- 🎨 **UI Player** - Pre-built React video player component
- 🌐 **Web Component** - Framework-agnostic player using custom elements
- ⚡ **Vite** - Fast development and build
- 🔷 **TypeScript** - Full type safety
- ⚛️ **React 18** - Latest React features

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Edit `.env` and add your JAAQ credentials:

```env
VITE_JAAQ_API_KEY=your_actual_api_key
VITE_JAAQ_CLIENT_ID=your_actual_client_id
VITE_JAAQ_API_URL=https://api.jaaq.app
```

Note: `VITE_JAAQ_API_URL` is optional. If not set, the SDK uses the default production URL.

## Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── CollectionsList.tsx      # Collections browser
│   ├── VideoPlayer.tsx           # Basic video player
│   ├── HLSPlayer.tsx             # HLS streaming player
│   ├── VideoGallery.tsx          # Video gallery view
│   ├── UIPlayerExample.tsx       # React wrapper component example
│   └── WebComponentExample.tsx   # Web component usage in React
├── lib/
│   └── jaaq.ts                  # SDK client instance
├── App.tsx                      # Main app component
├── App.css                      # Global styles
└── main.tsx                     # App entry point
```

## Components

### CollectionsList

Displays all collections and allows viewing collection details including videos.

### VideoPlayer

Basic video player that loads and plays videos by ID.

### HLSPlayer

Advanced player with HLS streaming support using hls.js. Automatically detects HLS format and falls back to native support on Safari.

### VideoGallery

Displays all videos from all collections in a gallery view.

### UIPlayerExample

Demonstrates the React VideoPlayer component from `@jaaq/jaaq-sdk-js/ui/react`. This is a thin wrapper around the web component with React-friendly props and callbacks.

### WebComponentExample

Shows how to use the native `<jaaq-video-player>` web component directly in React. The web component works in any framework or vanilla JS.

## SDK Usage Examples

### Creating the Client

```typescript
import { createJaaqClient } from '@jaaq/jaaq-sdk-js';

const client = createJaaqClient({
  apiKey: import.meta.env.VITE_JAAQ_API_KEY,
  clientId: import.meta.env.VITE_JAAQ_CLIENT_ID,
});
```

### Fetching Collections

```typescript
const collections = await client.collections.list();
const collection = await client.collections.getById(id);
```

### Fetching Videos

```typescript
const video = await client.videos.getById(id);
```

### Using the React Video Player

```typescript
import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';

function MyComponent() {
  return (
    <VideoPlayer
      videoId="your-video-id"
      apiKey={apiKey}
      clientId={clientId}
      autoplay={false}
      showInfo={true}
      onPlay={() => console.log('Playing')}
      onError={(err) => console.error(err)}
    />
  );
}
```

### Using Web Components in React

```typescript
import '@jaaq/jaaq-sdk-js/ui/webcomponents';

function MyComponent() {
  const playerRef = useRef<any>(null);

  return (
    <jaaq-video-player
      ref={playerRef}
      video-id="your-video-id"
      api-key={apiKey}
      client-id={clientId}
      autoplay="false"
    />
  );
}
```

## Using React Components from CDN

For quick prototyping or when you can't use npm, load React components directly from CDN without any build step.

### Complete HTML Example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>JAAQ React Player from CDN</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://cdn.jaaq.app/latest/ui/react/jaaq-ui-react.min.js"></script>
  </head>
  <body>
    <div id="root"></div>

    <script>
      const { VideoPlayer } = JaaqUIReact;
      const root = ReactDOM.createRoot(document.getElementById('root'));

      root.render(
        React.createElement(VideoPlayer, {
          videoId: 'your-video-id',
          apiKey: 'your-api-key',
          clientId: 'your-client-id',
          autoplay: false,
          showInfo: true,
          onPlay: () => console.log('Playing'),
          onPause: () => console.log('Paused'),
          onError: (error) => console.error('Error:', error),
          onLoaded: (video) => console.log('Loaded:', video),
        }),
      );
    </script>
  </body>
</html>
```

### Using JSX with Babel Standalone

For a more React-like experience without build tools:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>JAAQ React Player with JSX</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://cdn.jaaq.app/latest/ui/react/jaaq-ui-react.min.js"></script>
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      const { VideoPlayer } = JaaqUIReact;
      const root = ReactDOM.createRoot(document.getElementById('root'));

      function App() {
        const [videoId, setVideoId] = React.useState('');

        return (
          <div>
            <h1>JAAQ Video Player</h1>
            <input type="text" placeholder="Enter video ID" value={videoId} onChange={(e) => setVideoId(e.target.value)} />

            {videoId && (
              <VideoPlayer
                videoId={videoId}
                apiKey="your-api-key"
                clientId="your-client-id"
                autoplay={false}
                showInfo={true}
                onPlay={() => console.log('Playing')}
                onError={(error) => console.error('Error:', error)}
              />
            )}
          </div>
        );
      }

      root.render(<App />);
    </script>
  </body>
</html>
```

### CDN Dependencies

The React UMD bundle requires these external dependencies:

1. **React** (required):
   - From unpkg: `https://unpkg.com/react@18/umd/react.production.min.js`
   - From jsDelivr: `https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js`

2. **ReactDOM** (required):
   - From unpkg: `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js`
   - From jsDelivr: `https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js`

3. **hls.js** (required for HLS streaming):
   - From jsDelivr: `https://cdn.jsdelivr.net/npm/hls.js@latest`
   - From unpkg: `https://unpkg.com/hls.js@latest`

4. **JAAQ React Components**:
   - `https://cdn.jaaq.app/latest/ui/react/jaaq-ui-react.min.js`

### Global Variables

When loaded via CDN, the library exposes:

- `JaaqUIReact.VideoPlayer` - React video player component
- Access via: `const { VideoPlayer } = JaaqUIReact;`

### Alternative: Use Web Components

For simpler CDN usage without React dependencies, consider using web components instead:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jaaq.app/latest/ui/webcomponents/jaaq-webcomponents-bundled.min.js"></script>
  </head>
  <body>
    <jaaq-video-player video-id="your-video-id" api-key="your-api-key" client-id="your-client-id"> </jaaq-video-player>
  </body>
</html>
```

Web components work in React too and require no external dependencies.

## Type Safety

The SDK provides full TypeScript support. Import types from the SDK:

```typescript
import type { CollectionDTO, VideoDTO } from '@jaaq/jaaq-sdk-js';
```

## Environment Variables

Required environment variables:

- `VITE_JAAQ_API_KEY` - Your JAAQ API key
- `VITE_JAAQ_CLIENT_ID` - Your JAAQ client ID

Optional environment variables:

- `VITE_JAAQ_API_URL` - Custom API URL (defaults to `https://api.jaaq.app`)

⚠️ **Important**: Never commit your `.env` file with actual credentials to version control.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

HLS streaming requires hls.js support or native HLS support (Safari).
