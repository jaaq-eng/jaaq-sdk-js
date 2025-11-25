import { useEffect, useState } from 'react';
import { jaaqClient } from '../lib/jaaq';
import type { Collection } from '@jaaq/jaaq-sdk-js';

export default function CollectionsList() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    try {
      setLoading(true);
      setError(null);
      const data = await jaaqClient.collections.list();
      console.log('collections', data);
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }

  async function handleCollectionClick(collection: Collection) {
    try {
      const details = await jaaqClient.collections.getById(collection.id);
      setSelectedCollection(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collection details');
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Collections ({collections.length})</h2>
        {collections.length === 0 ? (
          <p>No collections found</p>
        ) : (
          <div className="grid">
            {collections.map((collection) => (
              <div key={collection.id} className="collection-card" onClick={() => handleCollectionClick(collection)}>
                <h3>{collection.name || 'Untitled Collection'}</h3>
                <p>{collection.description || 'No description'}</p>
                <div className="meta">
                  <span>ID: {collection.id}</span>
                  <span>{collection.videos?.length || 0} videos</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCollection && (
        <div className="card">
          <h2>Collection Details: {selectedCollection.name}</h2>
          <p>
            <strong>ID:</strong> {selectedCollection.id}
          </p>
          <p>
            <strong>Description:</strong> {selectedCollection.description || 'N/A'}
          </p>
          <p>
            <strong>Videos:</strong> {selectedCollection.videos?.length || 0}
          </p>

          {selectedCollection.videos && selectedCollection.videos.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Videos in this collection:</h3>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                {selectedCollection.videos.map((video) => (
                  <li key={video.id} style={{ marginBottom: '8px' }}>
                    {video.question || 'Untitled Video'} ({video.videoId})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
