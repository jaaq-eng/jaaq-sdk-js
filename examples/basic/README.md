# Basic Node.js Examples

Simple Node.js examples demonstrating core JAAQ SDK functionality.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Edit `.env` and add your JAAQ credentials:

```
JAAQ_API_KEY=your_actual_api_key
JAAQ_CLIENT_ID=your_actual_client_id
JAAQ_API_URL=https://api.jaaq.app/v1
```

Note: `JAAQ_API_URL` is optional. If not set, the SDK uses the default production URL.

## Examples

### ESM (ES Modules)

Run the ESM example:

```bash
npm run esm
```

Features:

- Modern `import` syntax
- `createJaaqClient` functional approach
- `JaaqClient.init` class-based approach
- Async/await patterns

### CJS (CommonJS)

Run the CommonJS example:

```bash
npm run cjs
```

Features:

- Traditional `require` syntax
- Compatible with older Node.js environments
- Same functionality as ESM version

## What These Examples Demonstrate

1. **Client Initialization**: Two ways to create a client instance
2. **Video Operations**: Fetch a video by ID
3. **Collection Operations**: List all collections and get by ID
4. **Error Handling**: Proper async error handling patterns

## Next Steps

- Explore [Browser Examples](../browser/) for frontend integration
- Check out [React + Vite Example](../react-vite/) for modern React apps
