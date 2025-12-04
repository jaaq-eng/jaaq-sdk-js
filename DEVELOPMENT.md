# JAAQ TypeScript SDK (`jaaq-sdk-js`)

A lightweight, type-safe SDK for interacting with the **JAAQ API (v1)**.  
It provides a simple client with typed resources generated from the backend OpenAPI specification.

---

## Project Structure

- src/
  - core/ # HTTP client
  - types/ # Type definitions
  - resources/ # API resources (e.g., videos)
  - index.ts
- tests/
  - handlers/
  - mocks/
  - setup.ts

## Relative paths:

```bash
"@src/*": ["src/*"],
"@core/*": ["src/core/*"],
"@resources/*": ["src/resources/*"],
"@tests/*": ["tests/*"]
```

Types are imported from `@src/types/*` (e.g., `import type { VideoDTO } from '@src/types/videos'`).

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

To generate types from OpenAPI specification:

1. Obtain the `openapi.json` file from the backend
2. Place it in the repository root directory
3. Run the generation command:

```bash
pnpm openapi:gen
```

This will generate types to `src/gen/openapi.ts`. You can then import and use them:

```typescript
import type { paths, components } from '@gen/openapi';

type GetVideosResponse = components['schemas']['GetVideosResponse'];
type GetVideosParams = paths['/videos']['get']['parameters']['query'];
```

Note: Currently, types are manually maintained in `src/types/`. The OpenAPI generation is available for future use when the backend provides the specification file.

## Configuration options:

- apiKey (required) – Provided by backend.
- clientId (required) – Provided by consuming company.
- baseUrl (optional) – Defaults to https://api.jaaq.app.
- fetch (optional) – Custom fetch implementation (for Node < 18).
- timeoutMs (optional) – Request timeout in ms.

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

```typescript
import { JaaqClient } from '@jaaq/jaaq-sdk-js';

const client = JaaqClient.init({
  apiKey: '<YOUR_API_KEY>',
  clientId: '<YOUR_CLIENT_ID>',
});
```

#### JS mode:

```typescript
import { createJaaqClient } from '@jaaq/jaaq-sdk-js';

const client = createJaaqClient({
  apiKey: '<YOUR_API_KEY>',
  clientId: '<YOUR_CLIENT_ID>',
});
```

#### Access to the different resources:

```typescript
client.videos.getById('xxxxxx');
```

or

```typescript
client.collections.list();
```

#### Ex: Getting and displaying a video

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

#### If extension is .m3u8

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
