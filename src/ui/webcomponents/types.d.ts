import type { JaaqVideoPlayerElement } from './VideoPlayer';
import type { JaaqCollectionPlayerElement } from './CollectionPlayer';

declare global {
  interface HTMLElementTagNameMap {
    'jaaq-video-player': JaaqVideoPlayerElement;
    'jaaq-collection-player': JaaqCollectionPlayerElement;
  }

  namespace JSX {
    interface IntrinsicElements {
      'jaaq-video-player': Partial<JaaqVideoPlayerElement> & {
        'video-id'?: string;
        'api-key'?: string;
        'client-id'?: string;
        'base-url'?: string;
        autoplay?: boolean | string;
        width?: string;
        height?: string;
        ref?: ((_instance: JaaqVideoPlayerElement | null) => void) | { current: JaaqVideoPlayerElement | null } | null;
        'onjaaq:loaded'?: (_event: CustomEvent) => void;
        'onjaaq:play'?: (_event: CustomEvent) => void;
        'onjaaq:pause'?: (_event: CustomEvent) => void;
        'onjaaq:timeupdate'?: (_event: CustomEvent) => void;
        'onjaaq:volumechange'?: (_event: CustomEvent) => void;
        'onjaaq:ended'?: (_event: CustomEvent) => void;
        'onjaaq:error'?: (_event: CustomEvent) => void;
        'onjaaq:fullscreenchange'?: (_event: CustomEvent) => void;
      };
      'jaaq-collection-player': Partial<JaaqCollectionPlayerElement> & {
        'collection-id'?: string;
        'api-key'?: string;
        'client-id'?: string;
        'subscription-id'?: string;
        'base-url'?: string;
        autoplay?: boolean | string;
        ref?: ((_instance: JaaqCollectionPlayerElement | null) => void) | { current: JaaqCollectionPlayerElement | null } | null;
        'onjaaq:collection:loaded'?: (_event: CustomEvent) => void;
        'onjaaq:collection:error'?: (_event: CustomEvent) => void;
        'onjaaq:collection:slidechange'?: (_event: CustomEvent) => void;
      };
    }
  }
}

export {};
