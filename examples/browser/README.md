# Browser Examples

Vanilla JavaScript examples demonstrating JAAQ SDK in the browser using CDN or local bundles.

## Examples

### Basic Examples

- **cdn-basic.html** - Simple API calls with results displayed on page
- **cdn-video-player.html** - Basic HTML5 video player
- **cdn-hls-player.html** - HLS streaming with hls.js library
- **local-bundle.html** - Init method testing (createJaaqClient vs JaaqClient.init)

### Advanced Examples

- **advanced/collections-gallery.html** - Interactive gallery displaying all collections
- **advanced/video-playlist.html** - Full-featured video playlist with playback controls

## Setup

All examples use the local SDK bundle via a symlink to the repository's `dist` folder:

```html
<script src="./dist/jaaq-sdk.min.js"></script>
```

The `dist` directory is a symlink pointing to `../../dist`, making the built SDK accessible to the examples.

The SDK is available as `JaaqSDK` global object:

```javascript
const { createJaaqClient } = JaaqSDK;
```

This approach is useful for:

- Testing local changes
- Development without network access
- No external dependencies

## Configuration

All browser examples load credentials from `config.json`:

1. Copy `config.example.json` to `config.json`:

```bash
cp config.example.json config.json
```

2. Update `config.json` with your credentials:

```json
{
  "apiKey": "your_api_key_here",
  "clientId": "your_client_id_here",
  "baseUrl": "https://api.jaaq.com"
}
```

⚠️ **Security Note**: `config.json` is gitignored. Never commit your actual API keys to version control.

## Running the Examples

1. Update the API credentials in each HTML file
2. Open the HTML file directly in your browser, or
3. Serve via a local server:

```bash
# Using npm (recommended)
npm install
npm start
# Opens http://localhost:3000

# Or using Python
python3 -m http.server 8000

# Or using Node.js (http-server)
npx http-server

# Or using PHP
php -S localhost:8000
```

Then navigate to the appropriate localhost URL and select an example.

## Build Requirements

Make sure to build the SDK before running the examples:

```bash
cd ../..
npm run build
```

This generates `dist/jaaq-sdk.min.js` which is accessible via the `dist` symlink in this directory.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ support required
- For older browsers, use transpiled versions
