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

### React Video Player

```bash
npm install @jaaq/jaaq-sdk-js hls.js react react-dom
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

#### React Player Props

| Prop        | Type                        | Required    | Default     | Description                       |
| ----------- | --------------------------- | ----------- | ----------- | --------------------------------- |
| `videoId`   | `string`                    | Yes         | -           | Video ID to load                  |
| `apiKey`    | `string`                    | Conditional | -           | API key (required if no client)   |
| `clientId`  | `string`                    | Conditional | -           | Client ID (required if no client) |
| `client`    | `JaaqClient`                | Conditional | -           | Existing SDK client instance      |
| `baseUrl`   | `string`                    | No          | API default | Custom API base URL               |
| `autoplay`  | `boolean`                   | No          | `false`     | Auto-play video on load           |
| `width`     | `string`                    | No          | `'100%'`    | Player width                      |
| `height`    | `string`                    | No          | `'auto'`    | Player height                     |
| `className` | `string`                    | No          | `''`        | Additional CSS class              |
| `showInfo`  | `boolean`                   | No          | `false`     | Show video metadata below player  |
| `onPlay`    | `() => void`                | No          | -           | Called when video starts playing  |
| `onPause`   | `() => void`                | No          | -           | Called when video pauses          |
| `onError`   | `(error: Error) => void`    | No          | -           | Called on error                   |
| `onLoaded`  | `(video: VideoDTO) => void` | No          | -           | Called when video loads           |

### Vanilla JS Video Player

```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script src="node_modules/@jaaq/jaaq-sdk-js/dist/ui/jaaq-ui.min.js"></script>

<div id="player-container"></div>

<script>
  const player = new JaaqUI.JaaqVideoPlayer('#player-container', {
    apiKey: 'your-api-key',
    clientId: 'your-client-id',
    videoId: 'video-id',
    autoplay: false,
  });

  player.on('play', () => console.log('Playing'));
  player.on('pause', () => console.log('Paused'));
  player.on('timeupdate', (time) => console.log('Time:', time));
  player.on('error', (error) => console.error('Error:', error));
</script>
```

#### Vanilla Player Configuration

| Option      | Type         | Required    | Default     | Description                       |
| ----------- | ------------ | ----------- | ----------- | --------------------------------- |
| `videoId`   | `string`     | Yes         | -           | Video ID to load                  |
| `apiKey`    | `string`     | Conditional | -           | API key (required if no client)   |
| `clientId`  | `string`     | Conditional | -           | Client ID (required if no client) |
| `client`    | `JaaqClient` | Conditional | -           | Existing SDK client instance      |
| `baseUrl`   | `string`     | No          | API default | Custom API base URL               |
| `autoplay`  | `boolean`    | No          | `false`     | Auto-play video on load           |
| `width`     | `string`     | No          | `'100%'`    | Player width                      |
| `height`    | `string`     | No          | `'auto'`    | Player height                     |
| `className` | `string`     | No          | `''`        | Additional CSS class              |

#### Vanilla Player Methods

```typescript
player.play(); // Start playback
player.pause(); // Pause playback
player.setVolume(0.5); // Set volume (0-1)
player.toggleMute(); // Toggle mute
player.seek(30); // Seek to time in seconds
player.getState(); // Get current player state
player.destroy(); // Cleanup and remove player
```

#### Vanilla Player Events

```typescript
player.on('play', () => {});
player.on('pause', () => {});
player.on('timeupdate', (time: number) => {});
player.on('volumechange', (volume: number) => {});
player.on('ended', () => {});
player.on('error', (error: Error) => {});
player.on('loaded', (video: VideoDTO) => {});
player.on('fullscreenchange', (isFullscreen: boolean) => {});
```

### Web Components (Native Custom Elements)

The SDK provides a native web component `<jaaq-video-player>` with Shadow DOM encapsulation. Perfect for framework-agnostic applications or when you need style isolation.

#### Installation & Registration

```bash
npm install @jaaq/jaaq-sdk-js hls.js
```

**Auto-registration (default)** - Components register automatically when imported:

```javascript
import '@jaaq/jaaq-sdk-js/ui/webcomponents';
```

Or use the bundled version (includes hls.js, auto-registers):

```html
<script src="node_modules/@jaaq/jaaq-sdk-js/dist/ui/webcomponents/jaaq-webcomponents-bundled.min.js"></script>
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
    <script src="https://cdn.jsdelivr.net/npm/@jaaq/jaaq-sdk-js/dist/ui/webcomponents/jaaq-webcomponents-bundled.min.js"></script>
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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'jaaq-video-player': Partial<JaaqVideoPlayerElement> & {
        'video-id'?: string;
        'api-key'?: string;
        'client-id'?: string;
        autoplay?: string;
        width?: string;
        height?: string;
        ref?: ((_instance: JaaqVideoPlayerElement | null) => void) | { current: JaaqVideoPlayerElement | null } | null;
      };
    }
  }
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
- 🌐 **Framework-agnostic** - Works with any framework or vanilla JS
- 📦 **Standards-based** - Native browser API, no framework overhead
- ♿ **Declarative** - Use as simple HTML elements
- 🎯 **Clean API** - Attributes for configuration, properties for objects

### UI Features

All players (React, Vanilla JS, and Web Components) include:

- ▶️ Custom video controls (play/pause, progress bar, volume, fullscreen)
- 🎬 HLS streaming support (adaptive bitrate with hls.js)
- 📹 MP4 playback support
- 🎨 Modern, responsive design
- ⚡ Loading states and error handling
- 📊 Event system for tracking player state
- 📱 Mobile-friendly touch controls

### React Example: Basic Video

```typescript
import { useEffect, useRef } from "react";
import { createJaaqClient } from "@jaaq/jaaq-sdk-js";

const API_KEY = import.meta.env.VITE_JAAQ_API_KEY;
const CLIENT_ID = import.meta.env.VITE_JAAQ_CLIENT_ID;

export default function VideoExample({ id }: { id: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    (async () => {
      const client = createJaaqClient({
        apiKey: API_KEY,
        clientId: CLIENT_ID
      });
      const resp = await client.videos.getById(id);
      const url = resp.video.videoUrl;
      videoRef.current.src = url;
    })();
  }, [id]);

  return (
    <video
      ref={videoRef}
      autoPlay
      controls
    />
  );
}
```

### React Example: HLS Streaming (.m3u8)

```typescript
import { useEffect, useRef } from "react";
import { createJaaqClient } from "@jaaq/jaaq-sdk-js";
import Hls from "hls.js";

const API_KEY = import.meta.env.VITE_JAAQ_API_KEY!;
const CLIENT_ID = import.meta.env.VITE_JAAQ_CLIENT_ID!;

export default function VideoExample({ id }: { id: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let hls: Hls | undefined;

    (async () => {
      const client = createJaaqClient({ apiKey: API_KEY, clientId: CLIENT_ID });
      const resp = await client.videos.getById(id);
      const url = resp.video.videoUrl;
      const video = videoRef.current;
      if (!video || !url) return;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
      }
    })();

    return () => hls?.destroy();
  }, [id]);

  return (
    <video
      ref={videoRef}
      autoPlay
      controls
    />
  );
}
```

## Configuration

| Option      | Type       | Required | Default                | Description                     |
| ----------- | ---------- | -------- | ---------------------- | ------------------------------- |
| `apiKey`    | `string`   | Yes      | -                      | Your JAAQ API key               |
| `clientId`  | `string`   | Yes      | -                      | Your client identifier          |
| `baseUrl`   | `string`   | No       | `https://api.jaaq.app` | API base URL                    |
| `fetch`     | `Function` | No       | `globalThis.fetch`     | Custom fetch implementation     |
| `timeoutMs` | `number`   | No       | -                      | Request timeout in milliseconds |

## Resources

- [Development Guide](./DEVELOPMENT.md) - For SDK contributors and developers
- [Release Notes](./RELEASE.md) - Version history and changelog

## TypeScript Support

This SDK is written in TypeScript and includes complete type definitions. Types are automatically generated from the JAAQ OpenAPI specification.

## License

MIT
