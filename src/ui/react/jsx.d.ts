import type * as React from 'react';
import type { JaaqVideoPlayerElement } from '@ui/webcomponents/VideoPlayer';

type JaaqVideoPlayerAttributes = Partial<JaaqVideoPlayerElement> & {
  ref?: React.Ref<JaaqVideoPlayerElement>;
  'video-id'?: string;
  'api-key'?: string;
  'client-id'?: string;
  'base-url'?: string;
  autoplay?: boolean | string;
  width?: string;
  height?: string;
};

declare module 'react' {
  // eslint-disable-next-line no-unused-vars
  namespace JSX {
    // eslint-disable-next-line no-unused-vars
    interface IntrinsicElements {
      'jaaq-video-player': JaaqVideoPlayerAttributes;
    }
  }
}
