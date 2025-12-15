import type * as React from 'react';
import type { JaaqVideoPlayerElement } from '@ui/webcomponents/VideoPlayer';
import type { JaaqCollectionPlayerElement } from '@ui/webcomponents/CollectionPlayer';

type JaaqVideoPlayerAttributes = Partial<JaaqVideoPlayerElement> & {
  ref?: React.Ref<JaaqVideoPlayerElement>;
  'video-id'?: string;
  'api-key'?: string;
  'client-id'?: string;
  'base-url'?: string;
  autoplay?: boolean | string;
  controls?: boolean | string;
  width?: string;
  height?: string;
  'show-logo'?: boolean | string;
  'show-title'?: boolean | string;
  'show-author'?: boolean | string;
  'show-description'?: boolean | string;
  'show-captions'?: boolean | string;
};

type JaaqCollectionPlayerAttributes = Partial<JaaqCollectionPlayerElement> & {
  ref?: React.Ref<JaaqCollectionPlayerElement>;
  'collection-id'?: string;
  'api-key'?: string;
  'client-id'?: string;
  'subscription-id'?: string;
  'base-url'?: string;
  autoplay?: boolean | string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'jaaq-video-player': JaaqVideoPlayerAttributes;
      'jaaq-collection-player': JaaqCollectionPlayerAttributes;
    }
  }
}
