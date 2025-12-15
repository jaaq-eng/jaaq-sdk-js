import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as React from 'react';
import { registerJaaqComponents } from '@ui/webcomponents/register';
import { JaaqCollectionPlayerElement } from '@ui/webcomponents/CollectionPlayer';
import type { CollectionDTO } from '@src/types';
import type { JaaqClient } from '@src/index';

if (typeof window !== 'undefined') {
  registerJaaqComponents();
}

type CollectionPlayerProps = {
  collectionId: string;
  apiKey?: string;
  clientId?: string;
  subscriptionId?: string;
  client?: JaaqClient;
  baseUrl?: string;
  autoplay?: boolean;
  className?: string;
  onLoaded?: (_collection: CollectionDTO) => void;
  onError?: (_error: Error) => void;
  onSlideChange?: (_data: { index: number; video: CollectionDTO['videos'][0] }) => void;
};

type CollectionPlayerHandle = {
  refresh: () => void;
  next: () => void;
  prev: () => void;
  go: (_index: number) => void;
  destroy: () => void;
  getCollection: () => CollectionDTO | null;
};

function CollectionPlayerComponent(
  {
    collectionId,
    apiKey,
    clientId,
    subscriptionId,
    client,
    baseUrl,
    autoplay = false,
    className = '',
    onLoaded,
    onError,
    onSlideChange,
  }: CollectionPlayerProps,
  ref: React.ForwardedRef<CollectionPlayerHandle>,
) {
  const playerRef = useRef<JaaqCollectionPlayerElement>(null);

  useImperativeHandle(ref, () => ({
    refresh: () => playerRef.current?.refresh(),
    next: () => playerRef.current?.next(),
    prev: () => playerRef.current?.prev(),
    go: (index: number) => playerRef.current?.go(index),
    destroy: () => playerRef.current?.destroy(),
    getCollection: () => playerRef.current?.getCollection() || null,
  }));

  const handleLoaded = (e: Event) => {
    const collection = (e as CustomEvent).detail;
    onLoaded?.(collection);
  };

  const handleError = (e: Event) => {
    const error = (e as CustomEvent).detail;
    onError?.(error);
  };

  const handleSlideChange = (e: Event) => {
    const data = (e as CustomEvent).detail;
    onSlideChange?.(data);
  };

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (client) {
      player.client = client;
    }

    player.addEventListener('jaaq:collection:loaded', handleLoaded);
    player.addEventListener('jaaq:collection:error', handleError);
    player.addEventListener('jaaq:collection:slidechange', handleSlideChange);

    return () => {
      player.removeEventListener('jaaq:collection:loaded', handleLoaded);
      player.removeEventListener('jaaq:collection:error', handleError);
      player.removeEventListener('jaaq:collection:slidechange', handleSlideChange);
    };
  }, [client, onLoaded, onError, onSlideChange]);

  return (
    <div className={className}>
      <jaaq-collection-player
        ref={playerRef}
        collection-id={collectionId}
        api-key={apiKey}
        client-id={clientId}
        subscription-id={subscriptionId}
        base-url={baseUrl}
        autoplay={autoplay ? 'true' : 'false'}
      />
    </div>
  );
}

CollectionPlayerComponent.displayName = 'CollectionPlayer';

export const CollectionPlayer = forwardRef<CollectionPlayerHandle, CollectionPlayerProps>(CollectionPlayerComponent);
