import { JaaqVideoPlayer } from './VideoPlayer';
import type { PlayerConfig } from '@ui/shared/types';

/**
 * Internal registry mapping DOM elements to their player instances
 */
const playerRegistry = new WeakMap<Element, JaaqVideoPlayer>();

/**
 * Internal list of all initialized players for cleanup operations
 */
const playerList: Array<{ element: Element; player: JaaqVideoPlayer }> = [];

/**
 * Parses data attributes from a DOM element to create player configuration
 * @param element - DOM element with data-* attributes
 * @returns Player configuration object or null if required attributes are missing
 */
function parseDataAttributes(element: Element): PlayerConfig | null {
  const apiKey = element.getAttribute('data-api-key');
  const clientId = element.getAttribute('data-client-id');
  const videoId = element.getAttribute('data-video-id');

  if (!apiKey || !clientId || !videoId) {
    console.error('JAAQ Player: Missing required attributes (data-api-key, data-client-id, data-video-id)', element);
    return null;
  }

  const config: PlayerConfig = {
    apiKey,
    clientId,
    videoId,
  };

  const autoplay = element.getAttribute('data-autoplay');
  if (autoplay !== null) {
    config.autoplay = autoplay === 'true';
  }

  const width = element.getAttribute('data-width');
  if (width) {
    config.width = width;
  }

  const height = element.getAttribute('data-height');
  if (height) {
    config.height = height;
  }

  const baseUrl = element.getAttribute('data-base-url');
  if (baseUrl) {
    config.baseUrl = baseUrl;
  }

  const className = element.getAttribute('data-class-name');
  if (className) {
    config.className = className;
  }

  return config;
}

/**
 * Initializes a video player for a given DOM element
 * @param element - DOM element to initialize player for
 * @returns Initialized player instance or null if initialization fails
 */
function initializePlayer(element: Element): JaaqVideoPlayer | null {
  if (playerRegistry.has(element)) {
    return playerRegistry.get(element)!;
  }

  const config = parseDataAttributes(element);
  if (!config) {
    return null;
  }

  try {
    const player = new JaaqVideoPlayer(element as HTMLElement, config);
    playerRegistry.set(element, player);
    playerList.push({ element, player });
    return player;
  } catch (error) {
    console.error('JAAQ Player: Failed to initialize player', error, element);
    return null;
  }
}

/**
 * Initializes all video players with data-jaaq-player attribute
 * @param rootElement - Root element to search for players (defaults to document)
 */
function initializePlayers(rootElement: Document | Element = document): void {
  const elements = rootElement.querySelectorAll('[data-jaaq-player]');
  elements.forEach((element) => {
    initializePlayer(element);
  });
}

/**
 * Retrieves a player instance for a given element or selector
 * @param elementOrSelector - DOM element or CSS selector
 * @returns Player instance or null if not found
 */
function getPlayer(elementOrSelector: Element | string): JaaqVideoPlayer | null {
  let element: Element | null;

  if (typeof elementOrSelector === 'string') {
    element = document.querySelector(elementOrSelector);
    if (!element) {
      console.error('JAAQ Player: Element not found for selector', elementOrSelector);
      return null;
    }
  } else {
    element = elementOrSelector;
  }

  return playerRegistry.get(element) || null;
}

/**
 * Destroys all initialized player instances and cleans up resources
 */
function destroyAll(): void {
  playerList.forEach(({ element, player }) => {
    try {
      player.destroy();
      playerRegistry.delete(element);
    } catch (error) {
      console.error('JAAQ Player: Error destroying player', error);
    }
  });
  playerList.length = 0;
}

/**
 * Auto-initialization API for declarative video player setup
 * Automatically finds and initializes players marked with [data-jaaq-player]
 * @example
 * // Auto-initialization on page load
 * <div data-jaaq-player data-api-key="key" data-client-id="id" data-video-id="video"></div>
 *
 * // Manual initialization
 * JaaqPlayer.init();
 *
 * // Get player instance
 * const player = JaaqPlayer.getPlayer('[data-video-id="video"]');
 * player.on('play', () => console.log('Playing'));
 */
export const JaaqPlayer = {
  /** Initialize all players with [data-jaaq-player] attribute */
  init: initializePlayers,
  /** Get player instance by element or selector */
  getPlayer,
  /** Destroy all initialized players */
  destroyAll,
};

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializePlayers();
    });
  } else {
    initializePlayers();
  }
}
