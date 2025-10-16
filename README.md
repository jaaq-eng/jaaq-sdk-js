# JAAQ TypeScript SDK (`jaaq-sdk-js`)

A lightweight, type-safe SDK for interacting with the **JAAQ API (v1)**.  
It provides a simple client with typed resources generated from the backend OpenAPI specification.

---

## Project Structure

- src/
  - core/ # HTTP client
  - gen/ # Generated OpenAPI types
  - resources/ # API resources (e.g., videos)
  - index.ts
- test/
  - handlers/
  - mocks/
  - setup.ts

## Relative paths:

```bash
"@src/*": ["src/*"],
"@core/*": ["src/core/*"],
"@resources/*": ["src/resources/*"],
"@gen/*": ["src/gen/*"],
"@tests/*": ["tests/*"]
```

## Installation

```bash
pnpm install
```

## Build

```bash
pnpm build
```

## Run tests

```bash
pnpm test
```

or

```bash
pnpm test:watch
```

## Create types

Once we have the last openApi.json file from the Back-end

```bash
pnpm openapi:gen
```

And then:

```bash
import type { paths, components } from '@gen/openapi';

type GetVideosResponse = components['schemas']['GetVideosResponse'];
type GetVideosParams = paths['/videos']['get']['parameters']['query'];

```

## Configuration options:

- apiKey (required) – Provided by backend.
- clientId (required) – Provided by consuming company.
- baseUrl (optional) – Defaults to https://api.jaaq.app/v1.
- fetch (optional) – Custom fetch implementation (for Node < 18).
- timeoutMs (optional) – Request timeout in ms.
- headers (optional) – Extra headers for all requests.
- apiKeyHeaderName (optional) – Defaults to x-api-key.

## Linting

- ESLint (code rules) and Prettier (formatting).
- On save: use the Prettier editor extension (Format on Save).
- Pre-commit: lint-staged runs ESLint --fix on TS/JS and Prettier on staged files.
- Manual:
  - `pnpm lint` / `pnpm lint:fix`
  - `pnpm format` / `pnpm format:check`
- Commit messages: validated by commitlint (Husky commit-msg hook).
- PRs: CI runs `pnpm lint` and `pnpm format:check` on pull_request.

## Usage:

#### install module:

![Install module screenshot](./docs/install-sdk.png)

#### classic mode:

```bash
// Import module
import { JaaqClient } from "jaaq-sdk-js";

const client = JaaqClient.init({
  apiKey: '<YOUR_API_KEY>',
  clientId: '<YOUR_CLIENT_ID>',
});
```

#### JS mode:

```bash
// Import module
import { createJaaqClient } from "jaaq-sdk-js";

const client = createJaaqClient({
  apiKey: '<YOUR_API_KEY>',
  clientId: '<YOUR_CLIENT_ID>',
});
```

#### Access to the different resources:

```bash
client.videos.getById('xxxxxx')
```

or

```bash
client.collections.list()
```

#### Ex: Getting and displaying a video

```bash
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
    />;
  )
}
```

#### If extension is .m3u8

```bash
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
      const url = resp.video.videoUrl; // e.g. https://.../video.m3u8
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
    />;
  )
}
```
