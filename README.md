# JAAQ TypeScript SDK

A lightweight, type-safe SDK for interacting with the JAAQ API. Built with TypeScript and optimized for modern JavaScript frameworks.

## Installation

```bash
npm install jaaq-sdk-js
```

```bash
yarn add jaaq-sdk-js
```

```bash
pnpm add jaaq-sdk-js
```

## Quick Start

### Using JaaqClient (Class-based)

```typescript
import { JaaqClient } from 'jaaq-sdk-js';

const client = JaaqClient.init({
  apiKey: '<YOUR_API_KEY>',
  clientId: '<YOUR_CLIENT_ID>',
});
```

### Using createJaaqClient (Functional)

```typescript
import { createJaaqClient } from 'jaaq-sdk-js';

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

### React Example: Basic Video

```typescript
import { useEffect, useRef } from "react";
import { createJaaqClient } from "jaaq-sdk-js";

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
import { createJaaqClient } from "jaaq-sdk-js";
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

| Option             | Type                     | Required | Default                   | Description                         |
| ------------------ | ------------------------ | -------- | ------------------------- | ----------------------------------- |
| `apiKey`           | `string`                 | Yes      | -                         | Your JAAQ API key                   |
| `clientId`         | `string`                 | Yes      | -                         | Your client identifier              |
| `baseUrl`          | `string`                 | No       | `https://api.jaaq.app/v1` | API base URL                        |
| `fetch`            | `Function`               | No       | `globalThis.fetch`        | Custom fetch implementation         |
| `timeoutMs`        | `number`                 | No       | -                         | Request timeout in milliseconds     |
| `headers`          | `Record<string, string>` | No       | `{}`                      | Additional headers for all requests |
| `apiKeyHeaderName` | `string`                 | No       | `x-api-key`               | Custom header name for API key      |

## Resources

- [Development Guide](./DEVELOPMENT.md) - For SDK contributors and developers
- [Release Notes](./RELEASE.md) - Version history and changelog

## TypeScript Support

This SDK is written in TypeScript and includes complete type definitions. Types are automatically generated from the JAAQ OpenAPI specification.

## License

MIT
