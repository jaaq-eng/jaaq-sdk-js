# JAAQ SDK Browser Examples

Browser examples demonstrating different integration patterns for the JAAQ video player.

## Examples

### Web Component (Recommended)

**`webcomponent-advanced.html`** - Full-featured web component example with programmatic control, event handling, and state management.

```html
<script src="https://cdn.jaaq.app/jaaq-sdk-js/latest/ui/webcomponents/jaaq-webcomponents-bundled.min.js"></script>

<jaaq-video-player video-id="your-video-id" api-key="your-api-key" client-id="your-client-id" autoplay="false"> </jaaq-video-player>

<script>
  const player = document.querySelector('jaaq-video-player');

  player.addEventListener('jaaq:loaded', (e) => {
    console.log('Video loaded:', e.detail);
  });

  player.addEventListener('jaaq:play', () => console.log('Playing'));
  player.addEventListener('jaaq:pause', () => console.log('Paused'));

  player.play();
  player.pause();
  player.seek(10);
  player.setVolume(0.5);
</script>
```

**Why web components?**

- Framework-agnostic (React, Vue, Angular, vanilla JS)
- Shadow DOM encapsulation (no CSS conflicts)
- Standard W3C API
- Single maintained implementation

### Multiple Players

**`ui-vanilla-multiple.html`** - Demonstrates multiple vanilla UI players on the same page with both declarative and manual initialization patterns.

Useful for:

- Video galleries or playlists
- Comparing multiple videos
- Testing player isolation

### Iframe Embedding

**`embed-demo.html`** - Comprehensive iframe embedding demo with postMessage communication for events and commands.

```html
<iframe
  src="https://cdn.jaaq.app/jaaq-sdk-js/latest/embed/embed.html?apiKey=YOUR_API_KEY&clientId=YOUR_CLIENT_ID&videoId=YOUR_VIDEO_ID"
  width="800"
  height="450"
  frameborder="0"
  allowfullscreen
></iframe>

<script>
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'jaaq-player-event') {
      console.log(event.data.event, event.data.data);
    }
  });

  const iframe = document.querySelector('iframe');
  iframe.contentWindow.postMessage(
    {
      type: 'jaaq-player-command',
      command: 'play',
    },
    '*',
  );
</script>
```

**Available commands:** `play`, `pause`, `toggleMute`, `setVolume`, `seek`, `getState`

**Available events:** `ready`, `loaded`, `play`, `pause`, `timeupdate`, `volumechange`, `ended`, `error`, `fullscreenchange`

## CDN Usage

All examples can be run without building the SDK by using our CDN. This is perfect for quick prototyping or when you don't want to use npm.

**CDN Base URL:** `https://cdn.jaaq.app/jaaq-sdk-js/latest/`

### Web Component from CDN

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jaaq.app/jaaq-sdk-js/latest/ui/webcomponents/jaaq-webcomponents-bundled.min.js"></script>
  </head>
  <body>
    <jaaq-video-player video-id="your-video-id" api-key="your-api-key" client-id="your-client-id"> </jaaq-video-player>
  </body>
</html>
```

### Vanilla UI from CDN

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jaaq.app/jaaq-sdk-js/latest/ui/jaaq-ui-bundled.min.js"></script>
  </head>
  <body>
    <div id="player"></div>
    <script>
      const player = new JaaqUI.JaaqVideoPlayer(document.getElementById('player'), {
        apiKey: 'your-api-key',
        clientId: 'your-client-id',
        videoId: 'your-video-id',
      });
    </script>
  </body>
</html>
```

### Core SDK from CDN

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jaaq.app/jaaq-sdk-js/latest/jaaq-sdk.min.js"></script>
  </head>
  <body>
    <script>
      const client = JaaqSDK.createJaaqClient({
        apiKey: 'your-api-key',
        clientId: 'your-client-id',
      });

      client.videos.getById('video-id').then((response) => console.log(response.video));
    </script>
  </body>
</html>
```

### Embed Iframe from CDN

```html
<iframe
  src="https://cdn.jaaq.app/jaaq-sdk-js/latest/embed/embed.html?apiKey=YOUR_API_KEY&clientId=YOUR_CLIENT_ID&videoId=YOUR_VIDEO_ID&autoplay=false"
  width="800"
  height="450"
  frameborder="0"
  allowfullscreen
>
</iframe>
```

**Control the iframe player:**

```javascript
const iframe = document.querySelector('iframe');

iframe.contentWindow.postMessage(
  {
    type: 'jaaq-player-command',
    command: 'play',
  },
  '*',
);

window.addEventListener('message', (event) => {
  if (event.data?.type === 'jaaq-player-event') {
    console.log(event.data.event, event.data.data);
  }
});
```

### Collection Carousel Embed from CDN

```html
<iframe
  src="https://cdn.jaaq.app/jaaq-sdk-js/latest/embed/embed-collection.html?apiKey=YOUR_API_KEY&clientId=YOUR_CLIENT_ID&collectionId=YOUR_COLLECTION_ID&autoplay=false"
  width="100%"
  height="600"
  frameborder="0"
  allow="autoplay"
>
</iframe>
```

**Control the carousel:**

```javascript
const iframe = document.querySelector('iframe');

iframe.contentWindow.postMessage(
  {
    type: 'jaaq-collection-command',
    command: 'next',
  },
  '*',
);

window.addEventListener('message', (event) => {
  if (event.data?.type === 'jaaq-collection-event') {
    console.log(event.data.event, event.data.data);
  }
});
```

## UI Architecture

The JAAQ SDK has a layered UI architecture:

1. **Vanilla Player** (`JaaqVideoPlayer`) - Core implementation with HLS support, controls, and events
2. **Web Component** (`<jaaq-video-player>`) - Wraps vanilla player with Shadow DOM
3. **React Component** - Thin wrapper around web component for React-friendly API

**Recommended approach:** Use web components for all new integrations.

## React Integration

The React component wraps the web component:

```jsx
import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';

function App() {
  return (
    <VideoPlayer
      videoId="video-id"
      apiKey="your-api-key"
      clientId="your-client-id"
      autoplay={false}
      onPlay={() => console.log('Playing')}
      onError={(err) => console.error(err)}
    />
  );
}
```

Or use the web component directly:

```jsx
import '@jaaq/jaaq-sdk-js/ui/webcomponents';

function App() {
  const playerRef = useRef(null);

  return <jaaq-video-player ref={playerRef} video-id="video-id" api-key="your-api-key" client-id="your-client-id" autoplay="false" />;
}
```

## Running Examples

1. Build the SDK:

```bash
pnpm build
```

2. Serve the examples:

```bash
cd examples/browser
npx serve
```

3. Open the examples in your browser

## Features

All players include:

- Custom video controls (play/pause, progress bar, volume, fullscreen)
- HLS streaming support (adaptive bitrate with hls.js)
- MP4 playback support
- Modern, responsive design
- Loading states and error handling
- Event system for tracking player state
- Mobile-friendly touch controls

Web components additionally provide:

- Shadow DOM encapsulation (no CSS conflicts)
- Framework-agnostic usage
- Declarative HTML API
- Standards-based W3C Custom Elements API
