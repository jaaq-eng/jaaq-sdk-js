import 'dotenv/config';
import { createJaaqClient, JaaqClient } from '@jaaq/jaaq-sdk-js';

const API_KEY = process.env.JAAQ_API_KEY;
const CLIENT_ID = process.env.JAAQ_CLIENT_ID;
const API_URL = process.env.JAAQ_API_URL;

async function main() {
  console.log('=== JAAQ SDK - ESM Example ===\n');

  console.log('Example 1: Using createJaaqClient (functional approach)');
  const client1 = createJaaqClient({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    ...(API_URL && { baseUrl: API_URL }),
  });

  try {
    console.log('\nFetching collections...');
    const response = await client1.collections.list();
    const collections = response?.collections || [];
    console.log(`Found ${collections.length} collections`);
    collections.forEach((col, i) => {
      console.log(`  ${i + 1}. ${col.name} (ID: ${col.id})`);
    });

    if (collections.length > 0) {
      const firstCollection = collections[0];
      console.log(`\nFetching details for collection: ${firstCollection.name}`);
      const collectionDetails = await client1.collections.getById(firstCollection.id);
      console.log(`Collection has ${collectionDetails.videos?.length || 0} videos`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n\nExample 2: Using JaaqClient.init (class-based approach)');
  const client2 = JaaqClient.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    ...(API_URL && { baseUrl: API_URL }),
  });

  try {
    const response = await client2.collections.list();
    const collections = response?.collections || [];
    if (collections.length > 0 && collections[0].videos?.length > 0) {
      const videoId = collections[0].videos[0].id;
      console.log(`\nFetching video with ID: ${videoId}`);
      const response = await client2.videos.getById(videoId);
      const video = response?.video || null;
      console.log(`Video question: ${video?.question}`);
      console.log(`Video URL: ${video?.videoUrl}`);
      console.log(`Duration: ${video?.duration}s`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n=== Example Complete ===');
}

main();
