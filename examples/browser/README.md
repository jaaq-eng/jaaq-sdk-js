# JAAQ SDK Browser Examples

This directory contains HTML examples for using the JAAQ SDK in the browser.

## Examples

### Basic Examples

- `cdn-basic.html` - Basic SDK usage with CDN
- `cdn-video-player.html` - Video player example with CDN

### Vanilla JS UI Player Examples

- `ui-vanilla.html` - Manual instantiation with full control
- `ui-vanilla-declarative.html` - Declarative setup with data attributes
- `ui-vanilla-simple-declarative.html` - Minimal declarative example
- `ui-vanilla-multiple.html` - Multiple players on the same page
- `ui-vanilla-embed.html` - Embedded player configuration

### Web Components Examples

- `webcomponent-simple.html` - Simple web component usage
- `webcomponent-declarative.html` - Declarative web component setup
- `webcomponent-advanced.html` - Advanced web component features with event handling

### Demo & Showcase

- `embed-demo.html` - Comprehensive embed demo showcasing all player features

## UI Components

The JAAQ SDK includes pre-built embeddable video players in the `/ui` sub-package:

### Vanilla JS Player

**Approach 1: Declarative (Easiest) - Auto-initialized with data attributes**

```html
<div data-jaaq-player data-api-key="your-api-key" data-client-id="your-client-id" data-video-id="video-id" data-autoplay="false"></div>

<script src="path/to/dist/ui/jaaq-ui-bundled.min.js"></script>

<script>
  const player = JaaqUI.JaaqPlayer.getPlayer('[data-video-id="video-id"]');
  player.on('play', () => console.log('Video playing'));
  player.on('pause', () => console.log('Video paused'));
</script>
```

**Approach 2: Manual Instantiation - Full control**

```html
<script src="path/to/dist/ui/jaaq-ui-bundled.min.js"></script>

<div id="player-container"></div>

<script>
  const player = new JaaqUI.JaaqVideoPlayer('#player-container', {
    apiKey: 'your-api-key',
    clientId: 'your-client-id',
    videoId: 'video-id',
    autoplay: false,
  });

  player.on('play', () => console.log('Video playing'));
  player.on('pause', () => console.log('Video paused'));
</script>
```

**Approach 3: External hls.js - Smaller bundle, load hls.js separately**

```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script src="path/to/dist/ui/jaaq-ui.min.js"></script>

<div id="player-container"></div>

<script>
  const player = new JaaqUI.JaaqVideoPlayer('#player-container', {
    apiKey: 'your-api-key',
    clientId: 'your-client-id',
    videoId: 'video-id',
    autoplay: false,
  });

  player.on('play', () => console.log('Video playing'));
  player.on('pause', () => console.log('Video paused'));
</script>
```

### Web Components (Custom Elements)

**Declarative usage:**

```html
<script src="path/to/dist/ui/webcomponents/jaaq-webcomponents-bundled.min.js"></script>

<jaaq-video-player video-id="your-video-id" api-key="your-api-key" client-id="your-client-id" autoplay="false"> </jaaq-video-player>

<script>
  const player = document.querySelector('jaaq-video-player');
  player.addEventListener('jaaq:play', () => console.log('Playing'));
  player.addEventListener('jaaq:pause', () => console.log('Paused'));
</script>
```

**Programmatic usage:**

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

  document.body.appendChild(player);
</script>
```

### React Player

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script src="path/to/dist/ui/react/jaaq-ui-react.min.js"></script>

<script type="text/babel">
  const { VideoPlayer } = JaaqUIReact;

  function App() {
    return (
      <VideoPlayer
        videoId="video-id"
        apiKey="your-api-key"
        clientId="your-client-id"
        autoplay={false}
        showInfo={true}
        onPlay={() => console.log('Playing')}
        onError={(err) => console.error(err)}
      />
    );
  }

  ReactDOM.render(<App />, document.getElementById('root'));
</script>
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

All players (Vanilla JS, Web Components, and React) include:

- ▶️ Custom video controls (play/pause, progress bar, volume, fullscreen)
- 🎬 HLS streaming support (adaptive bitrate with hls.js)
- 📹 MP4 playback support
- 🎨 Modern, responsive design
- ⚡ Loading states and error handling
- 📊 Event system for tracking player state
- 📱 Mobile-friendly touch controls

Web Components additionally provide:

- 🔒 Shadow DOM encapsulation (no CSS conflicts)
- 🌐 Framework-agnostic usage
- ♿ Declarative HTML API
