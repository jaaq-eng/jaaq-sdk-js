# JAAQ TypeScript SDK (`jaaq-sdk-ts`)

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

## Usage:

```bash
import { createJaaqClient } from 'jaaq-sdk-ts';

const client = createJaaqClient({
  apiKey: '<YOUR_API_KEY>',
  clientId: '<YOUR_CLIENT_ID>',
});

// Fetch videos
const videos = await client.videos.getVideos();
console.log(videos);

```

## Configuration options:

- apiKey (required) – Provided by backend.
- clientId (required) – Provided by consuming company.
- baseUrl (optional) – Defaults to https://api.jaaq.app/v1.
- fetch (optional) – Custom fetch implementation (for Node < 18).
- timeoutMs (optional) – Request timeout in ms.
- headers (optional) – Extra headers for all requests.
- apiKeyHeaderName (optional) – Defaults to x-api-key.
