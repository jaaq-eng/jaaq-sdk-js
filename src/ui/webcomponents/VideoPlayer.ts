import { JaaqVideoPlayer } from '@ui/vanilla/VideoPlayer';
import type { JaaqClient } from '@src/index';
import type { PlayerState } from '@ui/shared/types';
import sharedStyles from '@ui/shared/styles.css';
import vanillaStyles from '@ui/vanilla/styles.css';

const COMPONENT_STYLES = `
:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
}
`;

/**
 * Custom web component for JAAQ video player with Shadow DOM encapsulation
 * Provides a framework-agnostic video player with custom controls and HLS support
 *
 * @example
 * // Declarative usage
 * <jaaq-video-player
 *   video-id="video-123"
 *   api-key="key"
 *   client-id="client"
 *   autoplay="false">
 * </jaaq-video-player>
 *
 * @example
 * // Programmatic usage
 * const player = document.createElement('jaaq-video-player');
 * player.setAttribute('video-id', 'video-123');
 * player.addEventListener('jaaq:play', () => console.log('Playing'));
 * document.body.appendChild(player);
 */
export class JaaqVideoPlayerElement extends HTMLElement {
  private player: JaaqVideoPlayer | null = null;
  private container: HTMLDivElement | null = null;
  private clientInstance: JaaqClient | null = null;
  private connected = false;

  static get observedAttributes() {
    return [
      'video-id',
      'api-key',
      'client-id',
      'autoplay',
      'base-url',
      'width',
      'height',
      'controls',
      'show-logo',
      'show-title',
      'show-author',
      'show-description',
      'show-captions',
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.connected = true;
    this.render();
    this.initPlayer();
  }

  disconnectedCallback() {
    this.connected = false;
    this.destroyPlayer();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (!this.connected || oldValue === newValue) return;

    if (name === 'video-id' && this.player) {
      this.destroyPlayer();
      this.initPlayer();
    } else if (name === 'width' || name === 'height') {
      this.updateContainerStyles();
    } else if (
      name === 'controls' ||
      name === 'show-logo' ||
      name === 'show-title' ||
      name === 'show-author' ||
      name === 'show-description' ||
      name === 'show-captions'
    ) {
      if (this.player) {
        const features: any = {};
        if (name === 'controls') {
          features.controls = !this.hasAttribute('controls') || this.getAttribute('controls') !== 'false';
        } else if (name === 'show-logo') {
          features.showLogo = !this.hasAttribute('show-logo') || this.getAttribute('show-logo') !== 'false';
        } else if (name === 'show-title') {
          features.showTitle = !this.hasAttribute('show-title') || this.getAttribute('show-title') !== 'false';
        } else if (name === 'show-author') {
          features.showAuthor = !this.hasAttribute('show-author') || this.getAttribute('show-author') !== 'false';
        } else if (name === 'show-description') {
          features.showDescription = !this.hasAttribute('show-description') || this.getAttribute('show-description') !== 'false';
        } else if (name === 'show-captions') {
          features.showCaptions = !this.hasAttribute('show-captions') || this.getAttribute('show-captions') !== 'false';
        }
        this.player.setFeatures(features);
      }
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      ${sharedStyles}
      ${vanillaStyles}
      ${COMPONENT_STYLES}
    `;

    this.container = document.createElement('div');
    this.container.className = 'jaaq-webcomponent-container';

    this.shadowRoot.appendChild(styleSheet);
    this.shadowRoot.appendChild(this.container);

    this.updateContainerStyles();
  }

  private updateContainerStyles() {
    if (!this.container) return;

    const width = this.getAttribute('width') || '100%';
    const height = this.getAttribute('height') || 'auto';

    this.container.style.width = width;
    this.container.style.height = height;
  }

  private async initPlayer() {
    if (!this.container || this.player) return;

    const videoId = this.getAttribute('video-id');
    if (!videoId) {
      this.emitError(new Error('video-id attribute is required'));
      return;
    }

    const apiKey = this.getAttribute('api-key');
    const clientId = this.getAttribute('client-id');
    const baseUrl = this.getAttribute('base-url') || undefined;
    const autoplay = this.hasAttribute('autoplay') && this.getAttribute('autoplay') !== 'false';
    const controls = !this.hasAttribute('controls') || this.getAttribute('controls') !== 'false';

    const showLogo = !this.hasAttribute('show-logo') || this.getAttribute('show-logo') !== 'false';
    const showTitle = !this.hasAttribute('show-title') || this.getAttribute('show-title') !== 'false';
    const showAuthor = !this.hasAttribute('show-author') || this.getAttribute('show-author') !== 'false';
    const showDescription = !this.hasAttribute('show-description') || this.getAttribute('show-description') !== 'false';
    const showCaptions = !this.hasAttribute('show-captions') || this.getAttribute('show-captions') !== 'false';

    if (!this.clientInstance && !apiKey && !clientId) {
      this.emitError(new Error('Either client property or api-key and client-id attributes are required'));
      return;
    }

    try {
      this.player = new JaaqVideoPlayer(this.container, {
        videoId: videoId ?? undefined,
        apiKey: apiKey ?? undefined,
        clientId: clientId ?? undefined,
        client: this.clientInstance || undefined,
        baseUrl,
        autoplay,
        controls,
        showLogo,
        showTitle,
        showAuthor,
        showDescription,
        showCaptions,
      });

      this.attachPlayerEvents();
    } catch (error) {
      this.emitError(error instanceof Error ? error : new Error('Failed to initialize player'));
    }
  }

  private attachPlayerEvents() {
    if (!this.player) return;

    this.player.on('loaded', (video) => {
      this.dispatchEvent(
        new CustomEvent('jaaq:loaded', {
          detail: video,
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.player.on('play', () => {
      this.dispatchEvent(
        new CustomEvent('jaaq:play', {
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.player.on('pause', () => {
      this.dispatchEvent(
        new CustomEvent('jaaq:pause', {
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.player.on('timeupdate', (time) => {
      this.dispatchEvent(
        new CustomEvent('jaaq:timeupdate', {
          detail: time,
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.player.on('volumechange', (volume) => {
      this.dispatchEvent(
        new CustomEvent('jaaq:volumechange', {
          detail: volume,
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.player.on('ended', () => {
      this.dispatchEvent(
        new CustomEvent('jaaq:ended', {
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.player.on('error', (error) => {
      this.emitError(error);
    });

    this.player.on('fullscreenchange', (isFullscreen) => {
      this.dispatchEvent(
        new CustomEvent('jaaq:fullscreenchange', {
          detail: isFullscreen,
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  private emitError(error: Error) {
    this.dispatchEvent(
      new CustomEvent('jaaq:error', {
        detail: error,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private destroyPlayer() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }

  /**
   * Gets the current JaaqClient instance
   */
  get client(): JaaqClient | null {
    return this.clientInstance;
  }

  /**
   * Sets a JaaqClient instance for the player to use
   * Reinitializes the player if already connected
   */
  set client(value: JaaqClient | null) {
    this.clientInstance = value;
    if (this.connected) {
      this.destroyPlayer();
      this.initPlayer();
    }
  }

  /**
   * Gets the current video ID
   */
  get videoId(): string | null {
    return this.getAttribute('video-id');
  }

  /**
   * Sets the video ID
   * Updates the video-id attribute and triggers player reinitialization
   */
  set videoId(value: string | null) {
    if (value) {
      this.setAttribute('video-id', value);
    } else {
      this.removeAttribute('video-id');
    }
  }

  /**
   * Starts or resumes video playback
   */
  play(): void {
    this.player?.play();
  }

  /**
   * Pauses video playback
   */
  pause(): void {
    this.player?.pause();
  }

  /**
   * Sets the playback volume
   * @param volume - Volume level between 0 (silent) and 1 (maximum)
   */
  setVolume(volume: number): void {
    this.player?.setVolume(volume);
  }

  /**
   * Toggles audio mute state
   */
  toggleMute(): void {
    this.player?.toggleMute();
  }

  /**
   * Seeks to a specific time in the video
   * @param time - Target time in seconds
   */
  seek(time: number): void {
    this.player?.seek(time);
  }

  /**
   * Returns the current player state
   * @returns Current player state object or null if player not initialized
   */
  getState(): PlayerState | null {
    return this.player?.getState() || null;
  }

  /**
   * Destroys the player instance and cleans up resources
   */
  destroy(): void {
    this.destroyPlayer();
  }
}
