# JAAQ TypeScript SDK

A lightweight, type-safe SDK for interacting with the JAAQ API. Built with TypeScript and optimized for modern JavaScript frameworks.

## Installation

```bash
npm install @jaaq/jaaq-sdk-js
```

```bash
yarn add @jaaq/jaaq-sdk-js
```

```bash
pnpm add @jaaq/jaaq-sdk-js
```

## Quick Start

### Using JaaqClient (Class-based)

```typescript
import { JaaqClient } from '@jaaq/jaaq-sdk-js';

const client = JaaqClient.init({
  apiKey: '<YOUR_API_KEY>',
  clientId: '<YOUR_CLIENT_ID>',
});
```

### Using createJaaqClient (Functional)

```typescript
import { createJaaqClient } from '@jaaq/jaaq-sdk-js';

const client = createJaaqClient({
  apiKey: '<YOUR_API_KEY>',
  clientId: '<YOUR_CLIENT_ID>',
});
```

## Usage

### Accessing Resources

```typescript
const video = await client.videos.getById('video-id');
const collections = await client.collections.list();
```

## UI Components

The SDK includes ready-to-use embeddable video player components with custom controls, HLS support, and modern design.

**Architecture:** The SDK uses a layered approach:

- **Web Components** (`<jaaq-video-player>`) - Primary, framework-agnostic implementation
- **React Component** - Thin wrapper around web component with React-friendly API
- **Vanilla Player** - Internal implementation used by web components

**Recommended:** Use web components for all new integrations. They work everywhere (React, Vue, Angular, vanilla JS) and provide the best developer experience.

### Web Components (Recommended)

Web components are the primary way to use the video player. They work in any framework or vanilla JavaScript.

See the [Web Components section](#web-components-native-custom-elements) below for installation, usage examples, and full API documentation.

### React Video Player

The React component is a thin wrapper around the web component, providing React-friendly props and callbacks.

```bash
npm install @jaaq/jaaq-sdk-js
```

```typescript
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
}
```

**Or use the web component directly in React:**

```typescript
import '@jaaq/jaaq-sdk-js/ui/webcomponents';
import type { JaaqVideoPlayerElement } from '@jaaq/jaaq-sdk-js/ui/webcomponents';

function App() {
  const playerRef = useRef<JaaqVideoPlayerElement>(null);

  return (
    <jaaq-video-player
      ref={playerRef}
      video-id="your-video-id"
      api-key="your-api-key"
      client-id="your-client-id"
      autoplay="false"
    />
  );
}
```

#### React Player Props

| Prop                 | Type                        | Required    | Default     | Description                                     |
| -------------------- | --------------------------- | ----------- | ----------- | ----------------------------------------------- |
| `videoId`            | `string`                    | Yes         | -           | Video ID to load                                |
| `apiKey`             | `string`                    | Conditional | -           | API key (required if no client)                 |
| `clientId`           | `string`                    | Conditional | -           | Client ID (required if no client)               |
| `client`             | `JaaqClient`                | Conditional | -           | Existing SDK client instance                    |
| `baseUrl`            | `string`                    | No          | API default | Custom API base URL                             |
| `autoplay`           | `boolean`                   | No          | `false`     | Auto-play video on load                         |
| `width`              | `string`                    | No          | `'100%'`    | Player width                                    |
| `height`             | `string`                    | No          | `'auto'`    | Player height                                   |
| `className`          | `string`                    | No          | `''`        | Additional CSS class                            |
| `showInfo`           | `boolean`                   | No          | `false`     | Show video metadata below player                |
| `onPlay`             | `() => void`                | No          | -           | Called when video starts playing                |
| `onPause`            | `() => void`                | No          | -           | Called when video pauses                        |
| `onError`            | `(error: Error) => void`    | No          | -           | Called on error                                 |
| `onLoaded`           | `(video: VideoDTO) => void` | No          | -           | Called when video loads                         |
| `onTimeUpdate`       | `(time: number) => void`    | No          | -           | Called on time update (current time in seconds) |
| `onVolumeChange`     | `(volume: number) => void`  | No          | -           | Called on volume change (0-1)                   |
| `onEnded`            | `() => void`                | No          | -           | Called when video finishes                      |
| `onFullscreenChange` | `(isFull: boolean) => void` | No          | -           | Called on fullscreen state change               |

**Ref Methods:**

```typescript
const playerRef = useRef<VideoPlayerHandle>(null);

playerRef.current?.play();
playerRef.current?.pause();
playerRef.current?.setVolume(0.5);
playerRef.current?.toggleMute();
playerRef.current?.seek(30);
playerRef.current?.getState();
playerRef.current?.destroy();
```

### Web Components (Native Custom Elements)

The SDK provides a native web component `<jaaq-video-player>` with Shadow DOM encapsulation. Perfect for framework-agnostic applications or when you need style isolation.

#### Installation & Registration

**For ES modules (npm/import):**

```bash
npm install @jaaq/jaaq-sdk-js hls.js
```

**Auto-registration (default)** - Components register automatically when imported:

```javascript
import '@jaaq/jaaq-sdk-js/ui/webcomponents';
```

**For browser/CDN (no build step):**

Use the bundled version (includes hls.js, auto-registers):

```html
<script src="https://cdn.jaaq.app/jaaq-sdk-js/latest/ui/webcomponents/jaaq-webcomponents-bundled.min.js"></script>
```

**Manual registration** (for advanced use cases):

```javascript
import { registerJaaqComponents } from '@jaaq/jaaq-sdk-js/ui/webcomponents';

registerJaaqComponents();
```

To disable auto-registration with the bundled script:

```html
<script src="..." data-auto-register="false"></script>
<script>
  JaaqWebComponents.registerJaaqComponents();
</script>
```

#### Declarative Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jaaq.app/jaaq-sdk-js/latest/ui/webcomponents/jaaq-webcomponents-bundled.min.js"></script>
  </head>
  <body>
    <jaaq-video-player video-id="your-video-id" api-key="your-api-key" client-id="your-client-id" autoplay="false" width="100%">
    </jaaq-video-player>
  </body>
</html>
```

#### Programmatic Usage

```html
<script type="module">
  import '@jaaq/jaaq-sdk-js/ui/webcomponents';

  const player = document.createElement('jaaq-video-player');
  player.setAttribute('video-id', 'your-video-id');
  player.setAttribute('api-key', 'your-api-key');
  player.setAttribute('client-id', 'your-client-id');

  player.addEventListener('jaaq:loaded', (e) => {
    console.log('Video loaded:', e.detail);
  });

  player.addEventListener('jaaq:play', () => {
    console.log('Playing');
  });

  player.addEventListener('jaaq:error', (e) => {
    console.error('Error:', e.detail);
  });

  document.body.appendChild(player);
</script>
```

#### Web Component Attributes

| Attribute   | Type      | Required    | Default     | Description                                |
| ----------- | --------- | ----------- | ----------- | ------------------------------------------ |
| `video-id`  | `string`  | Yes         | -           | Video ID to load                           |
| `api-key`   | `string`  | Conditional | -           | API key (required if no client property)   |
| `client-id` | `string`  | Conditional | -           | Client ID (required if no client property) |
| `base-url`  | `string`  | No          | API default | Custom API base URL                        |
| `autoplay`  | `boolean` | No          | `false`     | Auto-play video on load                    |
| `width`     | `string`  | No          | `'100%'`    | Player width                               |
| `height`    | `string`  | No          | `'auto'`    | Player height                              |

#### Web Component Properties & Methods

```javascript
const player = document.querySelector('jaaq-video-player');

player.client = existingJaaqClient;

player.play();
player.pause();
player.setVolume(0.5);
player.toggleMute();
player.seek(30);
const state = player.getState();
player.destroy();
```

#### Web Component Custom Events

All events are prefixed with `jaaq:` and use the standard `CustomEvent` API:

```javascript
player.addEventListener('jaaq:play', () => {});
player.addEventListener('jaaq:pause', () => {});
player.addEventListener('jaaq:timeupdate', (e) => {
  console.log('Current time:', e.detail);
});
player.addEventListener('jaaq:volumechange', (e) => {
  console.log('Volume:', e.detail);
});
player.addEventListener('jaaq:ended', () => {});
player.addEventListener('jaaq:error', (e) => {
  console.error('Error:', e.detail);
});
player.addEventListener('jaaq:loaded', (e) => {
  console.log('Video:', e.detail);
});
player.addEventListener('jaaq:fullscreenchange', (e) => {
  console.log('Fullscreen:', e.detail);
});
```

#### Using Web Components in React

Web components work seamlessly with React. Import the component registration and use it as a JSX element:

```tsx
import { useEffect, useRef } from 'react';
import '@jaaq/jaaq-sdk-js/ui/webcomponents';
import type { JaaqVideoPlayerElement } from '@jaaq/jaaq-sdk-js/ui/webcomponents';

function VideoComponent() {
  const playerRef = useRef<JaaqVideoPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handlePlay = () => console.log('Playing');
    const handleLoaded = (e: Event) => {
      console.log('Loaded:', (e as CustomEvent).detail);
    };

    player.addEventListener('jaaq:play', handlePlay);
    player.addEventListener('jaaq:loaded', handleLoaded);

    return () => {
      player.removeEventListener('jaaq:play', handlePlay);
      player.removeEventListener('jaaq:loaded', handleLoaded);
    };
  }, []);

  return (
    <jaaq-video-player
      ref={playerRef}
      video-id="your-video-id"
      api-key="your-api-key"
      client-id="your-client-id"
      autoplay="false"
      width="100%"
    />
  );
}
```

Programmatic control in React:

```tsx
playerRef.current?.play();
playerRef.current?.pause();
playerRef.current?.setVolume(0.5);
const state = playerRef.current?.getState();
```

#### Why Use Web Components?

- 🔒 **Shadow DOM** - Style encapsulation, no CSS conflicts
- 🌐 **Framework-agnostic** - Works with React, Vue, Angular, vanilla JS, any framework
- 📦 **Standards-based** - W3C Custom Elements API, no framework overhead
- ♿ **Declarative** - Use as simple HTML elements
- 🎯 **Clean API** - Attributes for configuration, properties for objects
- 🔧 **Single implementation** - One codebase maintained in one place
- 🚀 **Future-proof** - Native browser standard, here to stay

### UI Features

All video players include:

- ▶️ Custom video controls (play/pause, progress bar, volume, fullscreen)
- 🎬 HLS streaming support (adaptive bitrate with hls.js)
- 📹 MP4 playback support
- 🎨 Modern, responsive design
- ⚡ Loading states and error handling
- 📊 Event system for tracking player state
- 📱 Mobile-friendly touch controls

## CDN Usage (No Build Step)

Use JAAQ SDK directly in the browser without npm or build tools. All files are available from our CDN:

**Base URL:** `https://cdn.jaaq.app/jaaq-sdk-js/latest/`

### Web Components (Recommended)

The easiest way to embed video players. Bundled version includes hls.js:

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

See [Web Components section](#web-components-native-custom-elements) for full documentation.

### Vanilla UI Player

For programmatic control with the vanilla JavaScript player:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jaaq.app/jaaq-sdk-js/latest/ui/jaaq-ui-bundled.min.js"></script>
  </head>
  <body>
    <div id="player-container"></div>
    <script>
      const container = document.getElementById('player-container');
      const player = new JaaqUI.JaaqVideoPlayer(container, {
        apiKey: 'your-api-key',
        clientId: 'your-client-id',
        videoId: 'your-video-id',
        autoplay: false,
      });

      player.on('loaded', (video) => console.log('Video loaded:', video));
      player.on('play', () => console.log('Playing'));
    </script>
  </body>
</html>
```

See [Vanilla UI Player Configuration](#vanilla-ui-player-configuration) for all options.

### Core SDK

Use the core SDK for API access without UI components:

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

      async function loadVideo() {
        const response = await client.videos.getById('video-id');
        console.log('Video:', response.video);
      }

      loadVideo();
    </script>
  </body>
</html>
```

### React Components (UMD)

Use React components from CDN without npm:

```html
<!DOCTYPE html>
<html>
  <head>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://cdn.jaaq.app/jaaq-sdk-js/latest/ui/react/jaaq-ui-react.min.js"></script>
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
        }),
      );
    </script>
  </body>
</html>
```

See [React Video Player](#react-video-player) for component props and examples.

### Embed via Iframe

The simplest integration - just use an iframe:

```html
<iframe
  src="https://cdn.jaaq.app/jaaq-sdk-js/latest/embed/embed.html?apiKey=YOUR_API_KEY&clientId=YOUR_CLIENT_ID&videoId=YOUR_VIDEO_ID"
  width="800"
  height="450"
  frameborder="0"
  allowfullscreen
>
</iframe>
```

**Control via postMessage:**

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
    console.log('Event:', event.data.event, event.data.data);
  }
});
```

See [Embed iframe URL Parameters](#embed-iframe-url-parameters) for all available options.

### Available CDN Files

| File                                                 | Description                      | Global Variable     |
| ---------------------------------------------------- | -------------------------------- | ------------------- |
| `jaaq-sdk.min.js`                                    | Core SDK                         | `JaaqSDK`           |
| `ui/jaaq-ui-bundled.min.js`                          | Vanilla UI + hls.js              | `JaaqUI`            |
| `ui/jaaq-ui.min.js`                                  | Vanilla UI (requires hls.js)     | `JaaqUI`            |
| `ui/react/jaaq-ui-react.min.js`                      | React components                 | `JaaqUIReact`       |
| `ui/webcomponents/jaaq-webcomponents-bundled.min.js` | Web components + hls.js          | `JaaqWebComponents` |
| `ui/webcomponents/jaaq-webcomponents.min.js`         | Web components (requires hls.js) | `JaaqWebComponents` |
| `embed/embed.html`                                   | Embeddable iframe player         | N/A                 |

**Note:** Bundled versions include hls.js and have no external dependencies. Non-bundled versions require loading hls.js separately.

## API Reference

Complete reference for all SDK components and their configuration options.

### Vanilla UI Player Configuration

The `JaaqVideoPlayer` class accepts these configuration options:

| Option      | Type         | Required    | Default  | Description                                |
| ----------- | ------------ | ----------- | -------- | ------------------------------------------ |
| `videoId`   | `string`     | Yes         | -        | Video ID to load                           |
| `apiKey`    | `string`     | Conditional | -        | API key (required if no client provided)   |
| `clientId`  | `string`     | Conditional | -        | Client ID (required if no client provided) |
| `client`    | `JaaqClient` | Conditional | -        | Existing JaaqClient instance               |
| `baseUrl`   | `string`     | No          | API URL  | Custom API base URL                        |
| `autoplay`  | `boolean`    | No          | `false`  | Auto-play video on load                    |
| `width`     | `string`     | No          | `'100%'` | CSS width of player container              |
| `height`    | `string`     | No          | `'auto'` | CSS height of player container             |
| `className` | `string`     | No          | `''`     | Additional CSS class name(s) for player    |

**Usage:**

```javascript
import { JaaqVideoPlayer } from '@jaaq/jaaq-sdk-js/ui';

const player = new JaaqVideoPlayer('#container', {
  videoId: 'your-video-id',
  apiKey: 'your-api-key',
  clientId: 'your-client-id',
  autoplay: false,
  width: '800px',
  height: '450px',
  className: 'my-custom-player',
});

player.on('loaded', (video) => console.log('Video loaded:', video));
player.on('play', () => console.log('Playing'));
player.play();
```

### Embed iframe URL Parameters

The embeddable iframe player accepts these URL query parameters:

| Parameter  | Type     | Required | Default | Description                         |
| ---------- | -------- | -------- | ------- | ----------------------------------- |
| `apiKey`   | `string` | Yes      | -       | Your JAAQ API key                   |
| `clientId` | `string` | Yes      | -       | Your client identifier              |
| `videoId`  | `string` | Yes      | -       | Video ID to load                    |
| `autoplay` | `string` | No       | `false` | Auto-play video ('true' or 'false') |
| `width`    | `string` | No       | `100%`  | CSS width of player                 |
| `height`   | `string` | No       | `100%`  | CSS height of player                |
| `baseUrl`  | `string` | No       | API URL | Custom API base URL                 |

**Usage:**

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

### Player Methods

All player implementations (Vanilla, Web Component, React) provide these methods:

| Method              | Parameters       | Returns       | Description                                |
| ------------------- | ---------------- | ------------- | ------------------------------------------ |
| `play()`            | -                | `void`        | Start or resume video playback             |
| `pause()`           | -                | `void`        | Pause video playback                       |
| `seek(time)`        | `time: number`   | `void`        | Seek to specific time in seconds           |
| `setVolume(volume)` | `volume: number` | `void`        | Set volume level (0-1)                     |
| `toggleMute()`      | -                | `void`        | Toggle audio mute state                    |
| `getState()`        | -                | `PlayerState` | Get current player state object            |
| `destroy()`         | -                | `void`        | Clean up player and remove event listeners |

**Vanilla Player Example:**

```javascript
player.play();
player.seek(30);
player.setVolume(0.5);
const state = player.getState();
```

**Web Component Example:**

```javascript
const player = document.querySelector('jaaq-video-player');
player.play();
player.seek(30);
player.setVolume(0.5);
const state = player.getState();
```

**React Example:**

```typescript
const playerRef = useRef<VideoPlayerHandle>(null);
playerRef.current?.play();
playerRef.current?.seek(30);
playerRef.current?.setVolume(0.5);
const state = playerRef.current?.getState();
```

### Player Events

All player implementations emit these events:

| Event              | Payload Type | Description                                      |
| ------------------ | ------------ | ------------------------------------------------ |
| `play`             | `void`       | Fired when video playback starts                 |
| `pause`            | `void`       | Fired when video playback pauses                 |
| `timeupdate`       | `number`     | Fired during playback, provides current time (s) |
| `volumechange`     | `number`     | Fired when volume changes, provides level (0-1)  |
| `ended`            | `void`       | Fired when video playback completes              |
| `error`            | `Error`      | Fired when an error occurs                       |
| `loaded`           | `VideoDTO`   | Fired when video metadata loads successfully     |
| `fullscreenchange` | `boolean`    | Fired when fullscreen state changes              |

**Vanilla Player Event Handling:**

```javascript
player.on('play', () => console.log('Playing'));
player.on('pause', () => console.log('Paused'));
player.on('timeupdate', (time) => console.log('Current time:', time));
player.on('loaded', (video) => console.log('Video:', video));
player.on('error', (error) => console.error('Error:', error));
```

**Web Component Event Handling:**

```javascript
const player = document.querySelector('jaaq-video-player');
player.addEventListener('jaaq:play', () => console.log('Playing'));
player.addEventListener('jaaq:pause', () => console.log('Paused'));
player.addEventListener('jaaq:timeupdate', (e) => console.log('Time:', e.detail));
player.addEventListener('jaaq:loaded', (e) => console.log('Video:', e.detail));
player.addEventListener('jaaq:error', (e) => console.error('Error:', e.detail));
```

**React Event Handling:**

```typescript
<VideoPlayer
  videoId="video-id"
  apiKey="api-key"
  clientId="client-id"
  onPlay={() => console.log('Playing')}
  onPause={() => console.log('Paused')}
  onTimeUpdate={(time) => console.log('Time:', time)}
  onLoaded={(video) => console.log('Video:', video)}
  onError={(error) => console.error('Error:', error)}
/>
```

**Embed iframe Event Handling (postMessage):**

```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'jaaq-player-event') {
    console.log('Event:', event.data.event, event.data.data);
  }
});
```

### Player State Object

The `getState()` method returns a `PlayerState` object with these properties:

| Property       | Type               | Description                                     |
| -------------- | ------------------ | ----------------------------------------------- |
| `isPlaying`    | `boolean`          | Whether video is currently playing              |
| `currentTime`  | `number`           | Current playback time in seconds                |
| `duration`     | `number`           | Total video duration in seconds                 |
| `volume`       | `number`           | Current volume level (0-1)                      |
| `isMuted`      | `boolean`          | Whether audio is muted                          |
| `isFullscreen` | `boolean`          | Whether player is in fullscreen mode            |
| `isLoading`    | `boolean`          | Whether video is currently loading              |
| `error`        | `string \| null`   | Error message if error occurred, null otherwise |
| `videoData`    | `VideoDTO \| null` | Loaded video metadata, null if not loaded       |

**Example:**

```javascript
const state = player.getState();
console.log('Playing:', state.isPlaying);
console.log('Current time:', state.currentTime);
console.log('Duration:', state.duration);
console.log('Volume:', state.volume);
console.log('Muted:', state.isMuted);
console.log('Fullscreen:', state.isFullscreen);
console.log('Loading:', state.isLoading);
if (state.error) {
  console.error('Error:', state.error);
}
if (state.videoData) {
  console.log('Video ID:', state.videoData.id);
  console.log('Title:', state.videoData.question || state.videoData.description);
}
```

### React Example: Using VideoPlayer Component

The recommended approach is to use the `VideoPlayer` component, which handles all video playback, HLS streaming, and provides custom controls:

```typescript
import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';

const API_KEY = import.meta.env.VITE_JAAQ_API_KEY;
const CLIENT_ID = import.meta.env.VITE_JAAQ_CLIENT_ID;

export default function VideoExample({ videoId }: { videoId: string }) {
  return (
    <VideoPlayer
      videoId={videoId}
      apiKey={API_KEY}
      clientId={CLIENT_ID}
      autoplay={false}
      showInfo={true}
      onPlay={() => console.log('Playing')}
      onPause={() => console.log('Paused')}
      onError={(error) => console.error('Error:', error)}
      onLoaded={(video) => console.log('Loaded:', video)}
    />
  );
}
```

### React Example: Using Web Component

You can also use the native web component directly in React:

```typescript
import { useRef, useEffect } from 'react';
import '@jaaq/jaaq-sdk-js/ui/webcomponents';
import type { JaaqVideoPlayerElement } from '@jaaq/jaaq-sdk-js/ui/webcomponents';

const API_KEY = import.meta.env.VITE_JAAQ_API_KEY;
const CLIENT_ID = import.meta.env.VITE_JAAQ_CLIENT_ID;

export default function VideoExample({ videoId }: { videoId: string }) {
  const playerRef = useRef<JaaqVideoPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handlePlay = () => console.log('Playing');
    const handleLoaded = (e: Event) => {
      console.log('Loaded:', (e as CustomEvent).detail);
    };

    player.addEventListener('jaaq:play', handlePlay);
    player.addEventListener('jaaq:loaded', handleLoaded);

    return () => {
      player.removeEventListener('jaaq:play', handlePlay);
      player.removeEventListener('jaaq:loaded', handleLoaded);
    };
  }, []);

  return (
    <jaaq-video-player
      ref={playerRef}
      video-id={videoId}
      api-key={API_KEY}
      client-id={CLIENT_ID}
      autoplay="false"
    />
  );
}
```

**For more examples**, see the [React examples directory](./examples/react-vite/) which includes working implementations with Vite.

## Configuration

| Option      | Type       | Required | Default                | Description                     |
| ----------- | ---------- | -------- | ---------------------- | ------------------------------- |
| `apiKey`    | `string`   | Yes      | -                      | Your JAAQ API key               |
| `clientId`  | `string`   | Yes      | -                      | Your client identifier          |
| `baseUrl`   | `string`   | No       | `https://api.jaaq.app` | API base URL                    |
| `fetch`     | `Function` | No       | `globalThis.fetch`     | Custom fetch implementation     |
| `timeoutMs` | `number`   | No       | -                      | Request timeout in milliseconds |

## Architecture

The SDK has a layered UI architecture:

1. **Vanilla Player** (Internal) - Core implementation with HLS support, controls, events
2. **Web Components** - Wraps vanilla player with Shadow DOM, primary public API
3. **React Component** - Thin wrapper around web component for React-friendly API

This architecture ensures:

- Single source of truth for player logic
- Framework-agnostic distribution via web components
- Consistent behavior across all integrations
- Easy maintenance and updates

## Resources

- [Browser Examples](./examples/browser/README.md) - HTML examples for web components and vanilla JS
- [React Examples](./examples/react-vite/README.md) - React + Vite integration examples
- [Development Guide](./DEVELOPMENT.md) - For SDK contributors and developers
- [Release Notes](./RELEASE.md) - Version history and changelog

## TypeScript Support

This SDK is written in TypeScript and includes complete type definitions. Types are automatically generated from the JAAQ OpenAPI specification.

## License

MIT
