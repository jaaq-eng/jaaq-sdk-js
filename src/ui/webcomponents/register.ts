import { JaaqVideoPlayerElement } from './VideoPlayer';
import { JaaqCollectionPlayerElement } from './CollectionPlayer';

const COMPONENT_TAGS = {
  VIDEO_PLAYER: 'jaaq-video-player',
  COLLECTION_PLAYER: 'jaaq-collection-player',
};

/**
 * Registers JAAQ custom elements (<jaaq-video-player> and <jaaq-collection-player>)
 * Safe to call multiple times - only registers if not already registered
 *
 * @example
 * import { registerJaaqComponents } from '@jaaq/jaaq-sdk-js/ui/webcomponents';
 * registerJaaqComponents();
 */
export function registerJaaqComponents(): void {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') {
    console.warn('Custom Elements API is not available. Web components cannot be registered.');
    return;
  }

  if (!customElements.get(COMPONENT_TAGS.VIDEO_PLAYER)) {
    customElements.define(COMPONENT_TAGS.VIDEO_PLAYER, JaaqVideoPlayerElement);
  }

  if (!customElements.get(COMPONENT_TAGS.COLLECTION_PLAYER)) {
    customElements.define(COMPONENT_TAGS.COLLECTION_PLAYER, JaaqCollectionPlayerElement);
  }
}

/**
 * Checks if the JAAQ web components are already registered
 * @returns True if components are registered, false otherwise
 */
export function isRegistered(): boolean {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') {
    return false;
  }
  return !!customElements.get(COMPONENT_TAGS.VIDEO_PLAYER) && !!customElements.get(COMPONENT_TAGS.COLLECTION_PLAYER);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      registerJaaqComponents();
    });
  } else {
    registerJaaqComponents();
  }
}
