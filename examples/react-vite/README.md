# JAAQ SDK - React + Vite Example

Modern React application demonstrating JAAQ SDK integration with TypeScript and Vite.

## Features

- 🎬 **Collections List** - Browse and view all collections
- 📹 **Video Player** - Basic video playback
- 🎥 **HLS Player** - Streaming with hls.js
- 🖼️ **Video Gallery** - Browse all videos across collections
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
VITE_JAAQ_API_URL=https://api.jaaq.app/v1
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
│   ├── CollectionsList.tsx   # Collections browser
│   ├── VideoPlayer.tsx        # Basic video player
│   ├── HLSPlayer.tsx          # HLS streaming player
│   └── VideoGallery.tsx       # Video gallery view
├── lib/
│   └── jaaq.ts               # SDK client instance
├── App.tsx                   # Main app component
├── App.css                   # Global styles
└── main.tsx                  # App entry point
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

## Type Safety

The SDK provides full TypeScript support. Import types from the SDK:

```typescript
import type { Collection, Video } from '@jaaq/jaaq-sdk-js';
```

## Environment Variables

Required environment variables:

- `VITE_JAAQ_API_KEY` - Your JAAQ API key
- `VITE_JAAQ_CLIENT_ID` - Your JAAQ client ID

Optional environment variables:

- `VITE_JAAQ_API_URL` - Custom API URL (defaults to `https://api.jaaq.app/v1`)

⚠️ **Important**: Never commit your `.env` file with actual credentials to version control.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

HLS streaming requires hls.js support or native HLS support (Safari).
