# JAAQ JavaScript/TypeScript SDK

Official JavaScript SDK for the JAAQ API.

It includes:

- Core API client (`createJaaqClient`, `JaaqClient`) for Videos + Collections
- UI players (vanilla JS classes, web components, React wrappers)
- A CDN-hosted iframe embed player (`embed.html`) with `postMessage` control

## Installation

```bash
pnpm add @jaaq/jaaq-sdk-js
```

```bash
npm install @jaaq/jaaq-sdk-js
```

```bash
yarn add @jaaq/jaaq-sdk-js
```

## Exports

- Core SDK: `@jaaq/jaaq-sdk-js`
- UI (vanilla + helpers): `@jaaq/jaaq-sdk-js/ui`
- React wrappers: `@jaaq/jaaq-sdk-js/ui/react`
- Web components: `@jaaq/jaaq-sdk-js/ui/webcomponents`

## Core SDK

### Create a client

```typescript
import { createJaaqClient } from '@jaaq/jaaq-sdk-js';

const client = createJaaqClient({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',
});
```

Class-based init:

```typescript
import { JaaqClient } from '@jaaq/jaaq-sdk-js';

const client = JaaqClient.init({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',
});
```

### Use resources

```typescript
const video = await client.videos.getById('video-id');
const collections = await client.collections.list();
const collection = await client.collections.getById('collection-id');
```

### Client config

| Option      | Type           | Required | Default                | Notes                                |
| ----------- | -------------- | -------- | ---------------------- | ------------------------------------ |
| `apiKey`    | `string`       | Yes      | -                      | Required for authentication          |
| `clientId`  | `string`       | Yes      | -                      | Used as subscription identifier      |
| `baseUrl`   | `string`       | No       | `https://api.jaaq.app` | API base URL                         |
| `fetch`     | `typeof fetch` | No       | `globalThis.fetch`     | Provide for Node/custom runtimes     |
| `timeoutMs` | `number`       | No       | -                      | Passed through to HTTP client config |

## UI Overview

There are 3 ways to use the player UI:

- Web components (recommended): `<jaaq-video-player>`, `<jaaq-collection-player>`
- React wrappers: `VideoPlayer`, `CollectionPlayer`
- Vanilla JS classes: `JaaqVideoPlayer`, `JaaqCollectionPlayer`

All implementations expose the same core capabilities:

- Custom controls + HLS playback
- Events for player state
- Imperative methods (`play`, `pause`, `seek`, `setVolume`, `getState`, `destroy`)

## Web Components

### Install

```bash
pnpm add @jaaq/jaaq-sdk-js
```

### Register

Auto-register (recommended):

```javascript
import '@jaaq/jaaq-sdk-js/ui/webcomponents';
```

Manual registration:

```javascript
import { registerJaaqComponents } from '@jaaq/jaaq-sdk-js/ui/webcomponents';

registerJaaqComponents();
```

### `<jaaq-video-player>`

Declarative usage:

```html
<jaaq-video-player
  video-id="your-video-id"
  api-key="your-api-key"
  client-id="your-client-id"
  autoplay="false"
  width="100%"
></jaaq-video-player>
```

Programmatic usage:

```javascript
import '@jaaq/jaaq-sdk-js/ui/webcomponents';

const player = document.createElement('jaaq-video-player');
player.setAttribute('video-id', 'your-video-id');
player.setAttribute('api-key', 'your-api-key');
player.setAttribute('client-id', 'your-client-id');

player.addEventListener('jaaq:loaded', (e) => {
  console.log(e.detail);
});

document.body.appendChild(player);
```

#### Attributes

| Attribute          | Type      | Required    | Default                | Notes                               |
| ------------------ | --------- | ----------- | ---------------------- | ----------------------------------- |
| `video-id`         | `string`  | Yes         | -                      | Video ID                            |
| `api-key`          | `string`  | Conditional | -                      | Required if you don’t set `.client` |
| `client-id`        | `string`  | Conditional | -                      | Required if you don’t set `.client` |
| `base-url`         | `string`  | No          | `https://api.jaaq.app` | API base URL                        |
| `autoplay`         | `boolean` | No          | `false`                | Any value except `"false"` enables  |
| `width`            | `string`  | No          | `100%`                 | Container width                     |
| `height`           | `string`  | No          | `auto`                 | Container height                    |
| `controls`         | `boolean` | No          | `true`                 | Any value except `"false"` enables  |
| `show-logo`        | `boolean` | No          | `true`                 | Any value except `"false"` enables  |
| `show-title`       | `boolean` | No          | `true`                 | Any value except `"false"` enables  |
| `show-author`      | `boolean` | No          | `true`                 | Any value except `"false"` enables  |
| `show-description` | `boolean` | No          | `true`                 | Any value except `"false"` enables  |
| `show-captions`    | `boolean` | No          | `true`                 | Any value except `"false"` enables  |

#### Properties / methods

| Member              | Type                        |
| ------------------- | --------------------------- |
| `client`            | `JaaqClient`                |
| `play()`            | `() => void`                |
| `pause()`           | `() => void`                |
| `seek(time)`        | `(time: number) => void`    |
| `setVolume(volume)` | `(volume: number) => void`  |
| `toggleMute()`      | `() => void`                |
| `getState()`        | `() => PlayerState \| null` |
| `destroy()`         | `() => void`                |

#### Events

| Event                   | Payload (`event.detail`) |
| ----------------------- | ------------------------ |
| `jaaq:loaded`           | `VideoDTO`               |
| `jaaq:play`             | -                        |
| `jaaq:pause`            | -                        |
| `jaaq:timeupdate`       | `number`                 |
| `jaaq:volumechange`     | `number`                 |
| `jaaq:ended`            | -                        |
| `jaaq:error`            | `Error`                  |
| `jaaq:fullscreenchange` | `boolean`                |

### `<jaaq-collection-player>`

This renders a carousel of videos in a collection.

Declarative usage:

```html
<jaaq-collection-player
  collection-id="your-collection-id"
  api-key="your-api-key"
  client-id="your-client-id"
  autoplay="false"
  show-arrows="true"
  show-dots="true"
  video-settings='{"controls":true,"showLogo":false,"showTitle":true,"showAuthor":true,"showDescription":false,"showCaptions":true}'
></jaaq-collection-player>
```

Programmatic usage:

```javascript
import '@jaaq/jaaq-sdk-js/ui/webcomponents';

const player = document.createElement('jaaq-collection-player');
player.setAttribute('collection-id', 'your-collection-id');
player.setAttribute('api-key', 'your-api-key');
player.setAttribute('client-id', 'your-client-id');
player.setAttribute(
  'video-settings',
  JSON.stringify({
    controls: true,
    showLogo: false,
    showTitle: true,
    showAuthor: true,
    showDescription: false,
    showCaptions: true,
  }),
);

player.addEventListener('jaaq:collection:loaded', (e) => {
  console.log(e.detail);
});

document.body.appendChild(player);
```

#### Attributes

| Attribute         | Type      | Required    | Default                | Notes                                         |
| ----------------- | --------- | ----------- | ---------------------- | --------------------------------------------- |
| `collection-id`   | `string`  | Yes         | -                      | Collection ID                                 |
| `api-key`         | `string`  | Conditional | -                      | Required if you don’t set `.client`           |
| `client-id`       | `string`  | Conditional | -                      | Required if you don’t set `.client`           |
| `subscription-id` | `string`  | No          | -                      | Accepted attribute                            |
| `base-url`        | `string`  | No          | `https://api.jaaq.app` | API base URL                                  |
| `autoplay`        | `boolean` | No          | `false`                | Any value except `"false"` enables            |
| `show-arrows`     | `boolean` | No          | `true`                 | Any value except `"false"` enables            |
| `show-dots`       | `boolean` | No          | `true`                 | Any value except `"false"` enables            |
| `video-settings`  | `string`  | No          | -                      | JSON stringified video player settings object |

#### Properties / methods

| Member            | Type                          |
| ----------------- | ----------------------------- |
| `client`          | `JaaqClient`                  |
| `refresh()`       | `() => void`                  |
| `next()`          | `() => void`                  |
| `prev()`          | `() => void`                  |
| `go(index)`       | `(index: number) => void`     |
| `destroy()`       | `() => void`                  |
| `getCollection()` | `() => CollectionDTO \| null` |

#### Events

| Event                         | Payload (`event.detail`)                               |
| ----------------------------- | ------------------------------------------------------ |
| `jaaq:collection:loaded`      | `CollectionDTO`                                        |
| `jaaq:collection:slidechange` | `{ index: number; video: CollectionDTO['videos'][0] }` |
| `jaaq:collection:error`       | `Error`                                                |

## React

Install:

```bash
pnpm add @jaaq/jaaq-sdk-js
```

### `<VideoPlayer />`

```tsx
import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';

export function App() {
  return (
    <VideoPlayer
      videoId="your-video-id"
      apiKey="your-api-key"
      clientId="your-client-id"
      autoplay={false}
      controls={true}
      showLogo={true}
      showTitle={true}
      showAuthor={true}
      showDescription={true}
      showCaptions={true}
      onLoaded={(video) => console.log(video)}
      onError={(err) => console.error(err)}
    />
  );
}
```

#### Props

`VideoPlayer` props are `PlayerConfig` plus callbacks.

| Prop                 | Type                              | Required    | Default |
| -------------------- | --------------------------------- | ----------- | ------- |
| `videoId`            | `string`                          | Yes         | -       |
| `apiKey`             | `string`                          | Conditional | -       |
| `clientId`           | `string`                          | Conditional | -       |
| `client`             | `JaaqClient`                      | Conditional | -       |
| `baseUrl`            | `string`                          | No          | -       |
| `autoplay`           | `boolean`                         | No          | `false` |
| `controls`           | `boolean`                         | No          | `true`  |
| `width`              | `string`                          | No          | `100%`  |
| `height`             | `string`                          | No          | `auto`  |
| `className`          | `string`                          | No          | `''`    |
| `showLogo`           | `boolean`                         | No          | `true`  |
| `showTitle`          | `boolean`                         | No          | `true`  |
| `showAuthor`         | `boolean`                         | No          | `true`  |
| `showDescription`    | `boolean`                         | No          | `true`  |
| `showCaptions`       | `boolean`                         | No          | `true`  |
| `onPlay`             | `() => void`                      | No          | -       |
| `onPause`            | `() => void`                      | No          | -       |
| `onEnded`            | `() => void`                      | No          | -       |
| `onTimeUpdate`       | `(time: number) => void`          | No          | -       |
| `onVolumeChange`     | `(volume: number) => void`        | No          | -       |
| `onFullscreenChange` | `(isFullscreen: boolean) => void` | No          | -       |
| `onLoaded`           | `(video: VideoDTO) => void`       | No          | -       |
| `onError`            | `(error: Error) => void`          | No          | -       |
| `showInfo`           | `boolean`                         | No          | `false` |

#### Ref handle

| Method              | Type                        |
| ------------------- | --------------------------- |
| `play()`            | `() => void`                |
| `pause()`           | `() => void`                |
| `seek(time)`        | `(time: number) => void`    |
| `setVolume(volume)` | `(volume: number) => void`  |
| `toggleMute()`      | `() => void`                |
| `getState()`        | `() => PlayerState \| null` |
| `destroy()`         | `() => void`                |

### `<CollectionPlayer />`

```tsx
import { CollectionPlayer } from '@jaaq/jaaq-sdk-js/ui/react';

export function App() {
  return (
    <CollectionPlayer
      collectionId="your-collection-id"
      apiKey="your-api-key"
      clientId="your-client-id"
      autoplay={false}
      showArrows={true}
      showDots={true}
      videoSettings={{
        controls: true,
        showLogo: false,
        showTitle: true,
        showAuthor: true,
        showDescription: false,
        showCaptions: true,
      }}
      onLoaded={(collection) => console.log(collection)}
      onSlideChange={(data) => console.log(data)}
      onError={(err) => console.error(err)}
    />
  );
}
```

#### Props

| Prop             | Type                                                                   | Required    | Default |
| ---------------- | ---------------------------------------------------------------------- | ----------- | ------- |
| `collectionId`   | `string`                                                               | Yes         | -       |
| `apiKey`         | `string`                                                               | Conditional | -       |
| `clientId`       | `string`                                                               | Conditional | -       |
| `subscriptionId` | `string`                                                               | No          | -       |
| `client`         | `JaaqClient`                                                           | Conditional | -       |
| `baseUrl`        | `string`                                                               | No          | -       |
| `autoplay`       | `boolean`                                                              | No          | `false` |
| `showArrows`     | `boolean`                                                              | No          | `true`  |
| `showDots`       | `boolean`                                                              | No          | `true`  |
| `className`      | `string`                                                               | No          | `''`    |
| `videoSettings`  | `VideoSettings`                                                        | No          | -       |
| `onLoaded`       | `(collection: CollectionDTO) => void`                                  | No          | -       |
| `onSlideChange`  | `(data: { index: number; video: CollectionDTO['videos'][0] }) => void` | No          | -       |
| `onError`        | `(error: Error) => void`                                               | No          | -       |

#### Ref handle

| Method            | Type                          |
| ----------------- | ----------------------------- |
| `refresh()`       | `() => void`                  |
| `next()`          | `() => void`                  |
| `prev()`          | `() => void`                  |
| `go(index)`       | `(index: number) => void`     |
| `destroy()`       | `() => void`                  |
| `getCollection()` | `() => CollectionDTO \| null` |

## Vanilla UI

### `JaaqVideoPlayer`

```javascript
import { JaaqVideoPlayer } from '@jaaq/jaaq-sdk-js/ui';

const player = new JaaqVideoPlayer('#container', {
  videoId: 'your-video-id',
  apiKey: 'your-api-key',
  clientId: 'your-client-id',
  autoplay: false,
  controls: true,
  showLogo: true,
  showTitle: true,
  showAuthor: true,
  showDescription: true,
  showCaptions: true,
});

player.on('loaded', (video) => console.log(video));
player.on('error', (err) => console.error(err));
```

#### Config (`PlayerConfig`)

| Option            | Type         | Required    | Default |
| ----------------- | ------------ | ----------- | ------- |
| `videoId`         | `string`     | Yes         | -       |
| `apiKey`          | `string`     | Conditional | -       |
| `clientId`        | `string`     | Conditional | -       |
| `client`          | `JaaqClient` | Conditional | -       |
| `baseUrl`         | `string`     | No          | -       |
| `autoplay`        | `boolean`    | No          | `false` |
| `controls`        | `boolean`    | No          | `true`  |
| `width`           | `string`     | No          | `100%`  |
| `height`          | `string`     | No          | `auto`  |
| `className`       | `string`     | No          | `''`    |
| `showLogo`        | `boolean`    | No          | `true`  |
| `showTitle`       | `boolean`    | No          | `true`  |
| `showAuthor`      | `boolean`    | No          | `true`  |
| `showDescription` | `boolean`    | No          | `true`  |
| `showCaptions`    | `boolean`    | No          | `true`  |

#### Events

| Event              | Payload    |
| ------------------ | ---------- |
| `loaded`           | `VideoDTO` |
| `play`             | -          |
| `pause`            | -          |
| `timeupdate`       | `number`   |
| `volumechange`     | `number`   |
| `ended`            | -          |
| `error`            | `Error`    |
| `fullscreenchange` | `boolean`  |

#### Methods

| Method              | Type                       |
| ------------------- | -------------------------- |
| `play()`            | `() => void`               |
| `pause()`           | `() => void`               |
| `seek(time)`        | `(time: number) => void`   |
| `setVolume(volume)` | `(volume: number) => void` |
| `toggleMute()`      | `() => void`               |
| `getState()`        | `() => PlayerState`        |
| `destroy()`         | `() => void`               |

### `JaaqCollectionPlayer`

```javascript
import { JaaqCollectionPlayer } from '@jaaq/jaaq-sdk-js/ui';

const player = new JaaqCollectionPlayer('#container', {
  collectionId: 'your-collection-id',
  apiKey: 'your-api-key',
  clientId: 'your-client-id',
  autoplay: false,
  showArrows: true,
  showDots: true,
  videoSettings: {
    controls: true,
    showLogo: false,
    showTitle: true,
    showAuthor: true,
    showDescription: false,
    showCaptions: true,
  },
});

player.on('loaded', (collection) => console.log(collection));
player.on('slidechange', (data) => console.log(data));
player.on('error', (err) => console.error(err));
```

#### Config

| Option          | Type            | Required    | Default |
| --------------- | --------------- | ----------- | ------- |
| `collectionId`  | `string`        | Yes         | -       |
| `apiKey`        | `string`        | Conditional | -       |
| `clientId`      | `string`        | Conditional | -       |
| `client`        | `JaaqClient`    | Conditional | -       |
| `baseUrl`       | `string`        | No          | -       |
| `autoplay`      | `boolean`       | No          | `false` |
| `showArrows`    | `boolean`       | No          | `true`  |
| `showDots`      | `boolean`       | No          | `true`  |
| `className`     | `string`        | No          | `''`    |
| `videoSettings` | `VideoSettings` | No          | -       |

#### Events

| Event         | Payload                              |
| ------------- | ------------------------------------ |
| `loaded`      | `CollectionDTO`                      |
| `slidechange` | `{ index: number; video: VideoDTO }` |
| `error`       | `Error`                              |

#### Methods

| Method            | Type                          |
| ----------------- | ----------------------------- |
| `refresh()`       | `() => void`                  |
| `next()`          | `() => void`                  |
| `prev()`          | `() => void`                  |
| `go(index)`       | `(index: number) => void`     |
| `destroy()`       | `() => void`                  |
| `getCollection()` | `() => CollectionDTO \| null` |

## Auto-init (data attributes)

This is a declarative auto-init API for the vanilla player.

### HTML

```html
<div
  data-jaaq-player
  data-api-key="your-api-key"
  data-client-id="your-client-id"
  data-video-id="your-video-id"
  data-autoplay="false"
  data-width="100%"
  data-height="auto"
></div>
```

### JS API

```javascript
import { JaaqPlayer } from '@jaaq/jaaq-sdk-js/ui';

JaaqPlayer.init();

const player = JaaqPlayer.getPlayer('[data-video-id="your-video-id"]');
player?.play();
```

### Data attributes

Required:

- `data-api-key`
- `data-client-id`
- `data-video-id`

Optional:

- `data-autoplay` (`true` or `false`)
- `data-width`
- `data-height`
- `data-base-url`
- `data-class-name`

## CDN Usage

CI publishes files under the `latest/` prefix. Embed HTML files are available under `latest/embed/`.

Base URL:

- `https://cdn.jaaq.app/latest/`

### Available files (published by CI)

| File                                | Description                                         | Global              |
| ----------------------------------- | --------------------------------------------------- | ------------------- |
| `jaaq-sdk.min.js`                   | Core SDK (UMD)                                      | `JaaqSDK`           |
| `jaaq-ui.min.js`                    | UI (UMD, requires `Hls` global for HLS)             | `JaaqUI`            |
| `jaaq-ui-bundled.min.js`            | UI (UMD, bundled incl. hls.js)                      | `JaaqUI`            |
| `jaaq-webcomponents.min.js`         | Web components (UMD, requires `Hls` global for HLS) | `JaaqWebComponents` |
| `jaaq-webcomponents-bundled.min.js` | Web components (UMD, bundled incl. hls.js)          | `JaaqWebComponents` |
| `embed.html`                        | Iframe embed player (single video)                  | -                   |
| `embed-collection.html`             | Iframe embed carousel player (collection)           | -                   |

### Core SDK (UMD)

```html
<script src="https://cdn.jaaq.app/latest/jaaq-sdk.min.js"></script>
<script>
  const client = JaaqSDK.createJaaqClient({
    apiKey: 'YOUR_API_KEY',
    clientId: 'YOUR_CLIENT_ID',
  });

  client.videos.getById('video-id').then((video) => console.log(video));
</script>
```

### UI (UMD)

Bundled (no external HLS dependency):

```html
<script src="https://cdn.jaaq.app/latest/jaaq-ui-bundled.min.js"></script>
<script>
  const player = new JaaqUI.JaaqVideoPlayer(document.getElementById('player'), {
    apiKey: 'YOUR_API_KEY',
    clientId: 'YOUR_CLIENT_ID',
    videoId: 'YOUR_VIDEO_ID',
  });
</script>
```

Non-bundled (load hls.js separately):

```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script src="https://cdn.jaaq.app/latest/jaaq-ui.min.js"></script>
```

### Web components (UMD)

Bundled (no external HLS dependency):

```html
<script src="https://cdn.jaaq.app/latest/jaaq-webcomponents-bundled.min.js"></script>
<jaaq-video-player video-id="YOUR_VIDEO_ID" api-key="YOUR_API_KEY" client-id="YOUR_CLIENT_ID"></jaaq-video-player>
```

Non-bundled (load hls.js separately):

```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script src="https://cdn.jaaq.app/latest/jaaq-webcomponents.min.js"></script>
```

### React from CDN

The CI pipeline does not publish the React UMD bundle to `https://cdn.jaaq.app/latest/`.

Use npm:

```bash
pnpm add @jaaq/jaaq-sdk-js
```

```tsx
import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';
```

## Embed via Iframe

### URL

```html
<iframe
  src="https://cdn.jaaq.app/latest/embed/embed.html?apiKey=YOUR_API_KEY&clientId=YOUR_CLIENT_ID&videoId=YOUR_VIDEO_ID&autoplay=false"
  width="800"
  height="450"
  frameborder="0"
  allowfullscreen
></iframe>
```

### URL parameters

| Parameter  | Required | Notes                     |
| ---------- | -------- | ------------------------- |
| `apiKey`   | Yes      | API key                   |
| `clientId` | Yes      | Client ID                 |
| `videoId`  | Yes      | Video ID                  |
| `autoplay` | No       | `true`, `false`, `1`, `0` |
| `width`    | No       | CSS width                 |
| `height`   | No       | CSS height                |
| `baseUrl`  | No       | API base URL              |

### postMessage protocol

Send commands:

```javascript
const iframe = document.querySelector('iframe');

iframe.contentWindow.postMessage(
  {
    type: 'jaaq-player-command',
    command: 'play',
  },
  '*',
);
```

Commands:

| Command      | args                 |
| ------------ | -------------------- |
| `play`       | -                    |
| `pause`      | -                    |
| `toggleMute` | -                    |
| `setVolume`  | `{ volume: number }` |
| `seek`       | `{ time: number }`   |
| `getState`   | -                    |

Listen for events:

```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type !== 'jaaq-player-event') return;
  console.log(event.data.event, event.data.data);
});
```

Events:

| Event              | data                                                |
| ------------------ | --------------------------------------------------- |
| `ready`            | `null`                                              |
| `loaded`           | `{ id: string; title?: string; question?: string }` |
| `play`             | `null`                                              |
| `pause`            | `null`                                              |
| `timeupdate`       | `{ currentTime: number }`                           |
| `volumechange`     | `{ volume: number }`                                |
| `ended`            | `null`                                              |
| `fullscreenchange` | `{ isFullscreen: boolean }`                         |
| `error`            | `{ message: string }`                               |
| `state`            | `PlayerState`                                       |

## Collection Carousel Embed

Embed a collection of videos in a carousel format:

```html
<iframe
  src="https://cdn.jaaq.app/latest/embed/embed-collection.html?apiKey=YOUR_API_KEY&clientId=YOUR_CLIENT_ID&collectionId=YOUR_COLLECTION_ID&autoplay=false&controls=true&showLogo=false&showTitle=true&showAuthor=true&showDescription=false&showCaptions=true"
  width="100%"
  height="600"
  frameborder="0"
  allow="autoplay"
></iframe>
```

### URL parameters

| Parameter         | Required | Notes                     |
| ----------------- | -------- | ------------------------- |
| `apiKey`          | Yes      | API key                   |
| `clientId`        | Yes      | Client ID                 |
| `collectionId`    | Yes      | Collection ID             |
| `autoplay`        | No       | `true`, `false`, `1`, `0` |
| `baseUrl`         | No       | API base URL              |
| `controls`        | No       | `true`, `false`, `1`, `0` |
| `showLogo`        | No       | `true`, `false`, `1`, `0` |
| `showTitle`       | No       | `true`, `false`, `1`, `0` |
| `showAuthor`      | No       | `true`, `false`, `1`, `0` |
| `showDescription` | No       | `true`, `false`, `1`, `0` |
| `showCaptions`    | No       | `true`, `false`, `1`, `0` |
| `width`           | No       | CSS width string          |
| `height`          | No       | CSS height string         |

### postMessage protocol

Send commands:

```javascript
const iframe = document.querySelector('iframe');

iframe.contentWindow.postMessage(
  {
    type: 'jaaq-collection-command',
    command: 'next',
  },
  '*',
);
```

Commands:

| Command         | args                |
| --------------- | ------------------- |
| `next`          | -                   |
| `prev`          | -                   |
| `goToSlide`     | `{ index: number }` |
| `refresh`       | -                   |
| `getCollection` | -                   |

Listen for events:

```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type !== 'jaaq-collection-event') return;
  console.log(event.data.event, event.data.data);
});
```

Events:

| Event         | data                                                            |
| ------------- | --------------------------------------------------------------- |
| `ready`       | `null`                                                          |
| `loaded`      | `{ collection: { id, name, description }, videoCount: number }` |
| `slidechange` | `{ index: number, video: { id, title, question } }`             |
| `error`       | `{ message: string }`                                           |

## Examples

- [examples/README.md](./examples/README.md)
- [examples/browser/README.md](./examples/browser/README.md)
- [examples/react-vite/README.md](./examples/react-vite/README.md)

## Development

- [DEVELOPMENT.md](./DEVELOPMENT.md)
- [RELEASE.md](./RELEASE.md)

## License

ISC
