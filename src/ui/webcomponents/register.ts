import { JaaqVideoPlayerElement } from './VideoPlayer';

const COMPONENT_TAG = 'jaaq-video-player';

/**
 * Registers the <jaaq-video-player> custom element
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

  if (!customElements.get(COMPONENT_TAG)) {
    customElements.define(COMPONENT_TAG, JaaqVideoPlayerElement);
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
  return !!customElements.get(COMPONENT_TAG);
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
