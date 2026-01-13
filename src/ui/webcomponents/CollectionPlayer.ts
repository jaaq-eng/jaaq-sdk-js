import Splide from '@splidejs/splide';
import { JaaqClient, BASE_URL } from '@src/index';
import type { CollectionDTO } from '@src/types';
import sharedStyles from '@ui/shared/styles.css';
import collectionStyles from './CollectionPlayer.css';
import splideStyles from '@splidejs/splide/css';

const COMPONENT_STYLES = `
:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
}
`;

export class JaaqCollectionPlayerElement extends HTMLElement {
  private splide: Splide | null = null;
  private container: HTMLDivElement | null = null;
  private carouselElement: HTMLDivElement | null = null;
  private clientInstance: JaaqClient | null = null;
  private connected = false;
  private collectionData: CollectionDTO | null = null;
  private autoplayTimeoutId: number | null = null;

  static get observedAttributes() {
    return [
      'collection-id',
      'api-key',
      'client-id',
      'subscription-id',
      'base-url',
      'autoplay',
      'show-arrows',
      'show-dots',
      'video-settings',
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.connected = true;
    this.render();
    this.initCarousel();
  }

  disconnectedCallback() {
    this.connected = false;
    this.destroyCarousel();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (!this.connected || oldValue === newValue) return;

    if (name === 'collection-id' || name === 'video-settings') {
      this.destroyCarousel();
      this.initCarousel();
    }

    if (name === 'show-arrows' || name === 'show-dots') {
      this.destroyCarousel();
      this.initCarousel();
    }
  }

  private getBooleanAttr(name: string, defaultValue: boolean): boolean {
    const v = this.getAttribute(name);
    if (v === null) return defaultValue;
    return v !== 'false';
  }

  private render() {
    if (!this.shadowRoot) return;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      ${sharedStyles}
      ${collectionStyles}
      ${splideStyles}
      ${COMPONENT_STYLES}
    `;

    this.container = document.createElement('div');
    this.container.className = 'jaaq-collection-player';

    this.shadowRoot.appendChild(styleSheet);
    this.shadowRoot.appendChild(this.container);
  }

  private async initCarousel() {
    if (!this.container) return;

    const collectionId = this.getAttribute('collection-id');
    if (!collectionId) {
      this.emitError(new Error('collection-id attribute is required'));
      return;
    }

    const apiKey = this.getAttribute('api-key');
    const clientId = this.getAttribute('client-id');
    const baseUrl = this.getAttribute('base-url') || undefined;

    if (!this.clientInstance && !apiKey && !clientId) {
      this.emitError(new Error('Either client property or api-key and client-id attributes are required'));
      return;
    }

    this.showLoading();

    try {
      const client =
        this.clientInstance ||
        JaaqClient.init({
          apiKey: apiKey!,
          clientId: clientId!,
          baseUrl: baseUrl || BASE_URL,
        });

      this.collectionData = await client.collections.getById(collectionId);

      if (!this.collectionData.videos || this.collectionData.videos.length === 0) {
        this.emitError(new Error('No videos found in collection'));
        return;
      }

      this.renderCarousel();
      this.initSplide();

      this.dispatchEvent(
        new CustomEvent('jaaq:collection:loaded', {
          detail: this.collectionData,
          bubbles: true,
          composed: true,
        }),
      );
    } catch (error) {
      this.emitError(error instanceof Error ? error : new Error('Failed to load collection'));
    }
  }

  private showLoading() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="jaaq-collection-loading">
        <div class="jaaq-collection-spinner"></div>
      </div>
    `;
  }

  private renderCarousel() {
    if (!this.container || !this.collectionData) return;

    this.container.innerHTML = '';

    this.carouselElement = document.createElement('div');
    this.carouselElement.className = 'splide jaaq-collection-carousel';

    const track = document.createElement('div');
    track.className = 'splide__track';

    const list = document.createElement('ul');
    list.className = 'splide__list';

    const apiKey = this.getAttribute('api-key');
    const clientId = this.getAttribute('client-id');
    const baseUrl = this.getAttribute('base-url');
    const videoSettingsAttr = this.getAttribute('video-settings');
    let videoSettings: Record<string, unknown> | null = null;
    if (videoSettingsAttr) {
      try {
        videoSettings = JSON.parse(videoSettingsAttr);
      } catch (e) {
        console.warn('[CollectionPlayer] Failed to parse video-settings attribute', e);
      }
    }

    this.collectionData.videos.forEach((video) => {
      const slide = document.createElement('li');
      slide.className = 'splide__slide';

      const player = document.createElement('jaaq-video-player');
      player.setAttribute('video-id', video.videoId);
      if (apiKey) player.setAttribute('api-key', apiKey);
      if (clientId) player.setAttribute('client-id', clientId);
      if (baseUrl) player.setAttribute('base-url', baseUrl);
      player.setAttribute('autoplay', 'false');
      player.setAttribute('width', '100%');

      if (videoSettings) {
        if (videoSettings.controls !== undefined) {
          player.setAttribute('controls', String(videoSettings.controls));
        }
        if (videoSettings.showLogo !== undefined) {
          player.setAttribute('show-logo', String(videoSettings.showLogo));
        }
        if (videoSettings.showTitle !== undefined) {
          player.setAttribute('show-title', String(videoSettings.showTitle));
        }
        if (videoSettings.showAuthor !== undefined) {
          player.setAttribute('show-author', String(videoSettings.showAuthor));
        }
        if (videoSettings.showDescription !== undefined) {
          player.setAttribute('show-description', String(videoSettings.showDescription));
        }
        if (videoSettings.showCaptions !== undefined) {
          player.setAttribute('show-captions', String(videoSettings.showCaptions));
        }
        if (videoSettings.startMuted !== undefined) {
          player.setAttribute('start-muted', String(videoSettings.startMuted));
        }
        if (videoSettings.width !== undefined) {
          player.setAttribute('width', String(videoSettings.width));
        }
        if (videoSettings.height !== undefined) {
          player.setAttribute('height', String(videoSettings.height));
        }
      }

      slide.appendChild(player);
      list.appendChild(slide);
    });

    track.appendChild(list);
    this.carouselElement.appendChild(track);
    this.container.appendChild(this.carouselElement);
  }

  private initSplide() {
    if (!this.carouselElement) return;

    const showArrows = this.getBooleanAttr('show-arrows', true);
    const showDots = this.getBooleanAttr('show-dots', true);

    this.splide = new Splide(this.carouselElement, {
      type: 'loop',
      perPage: 3,
      focus: 'center',
      gap: '0.5rem',
      perMove: 1,
      autoHeight: true,
      updateOnMove: true,
      padding: '5 rem',
      breakpoints: {
        768: {
          perPage: 1,
        },
        1024: {
          perPage: 2,
        },
      },
      arrows: showArrows,
      pagination: showDots,
      autoplay: false,
    });

    this.splide.on('moved', (newIndex: number) => {
      console.log('[CollectionPlayer] Splide moved event', {
        newIndex,
        splideIndex: this.splide?.index,
        Components: this.splide?.Components,
      });
      this.handleSlideChange(newIndex);

      this.dispatchEvent(
        new CustomEvent('jaaq:collection:slidechange', {
          detail: { index: newIndex, video: this.collectionData?.videos[newIndex] },
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.splide.mount();

    console.log('[CollectionPlayer] After mount', {
      splideIndex: this.splide.index,
      length: this.splide.length,
    });

    setTimeout(() => {
      if (this.splide) {
        console.log('[CollectionPlayer] Initial handleSlideChange after DOM update');
        this.handleSlideChange(this.splide.index);
      }
    }, 100);
  }

  private handleSlideChange(activeIndex: number) {
    if (!this.carouselElement) return;

    const isAutoplayEnabled = this.hasAttribute('autoplay') && this.getAttribute('autoplay') !== 'false';
    console.log('[CollectionPlayer] handleSlideChange called', { activeIndex, isAutoplayEnabled });

    if (this.autoplayTimeoutId !== null) {
      console.log('[CollectionPlayer] Clearing existing autoplay timeout', { timeoutId: this.autoplayTimeoutId });
      clearTimeout(this.autoplayTimeoutId);
      this.autoplayTimeoutId = null;
    }

    const activeSlide = this.carouselElement.querySelector('.splide__slide.is-active:not(.splide__slide--clone)');
    const activePlayer = activeSlide?.querySelector('jaaq-video-player') as any;
    const activeVideoId = activePlayer?.getAttribute('video-id');

    console.log('[CollectionPlayer] Active slide from DOM:', {
      activeIndex,
      activeVideoId,
      foundActiveSlide: !!activeSlide,
    });

    const originalSlides = this.carouselElement.querySelectorAll('.splide__slide:not(.splide__slide--clone)');

    Array.from(originalSlides).map((slide, idx) => {
      const player = slide.querySelector('jaaq-video-player') as any;
      const videoId = player?.getAttribute('video-id') || 'unknown';
      const isActive = slide.classList.contains('is-active');
      return {
        index: idx,
        videoId,
        isActive,
      };
    });

    originalSlides.forEach((slide, index) => {
      const player = slide.querySelector('jaaq-video-player') as any;
      if (!player) return;

      const videoId = player.getAttribute('video-id');
      const isActive = slide.classList.contains('is-active');

      if (isActive) {
        if (isAutoplayEnabled) {
          this.autoplayTimeoutId = window.setTimeout(() => {
            console.log('[CollectionPlayer] 1s delay complete, playing video', {
              index,
              videoId,
            });
            player.play?.();
          }, 1000);
        }
      } else {
        player.pause?.();
      }
    });
  }

  private destroyCarousel() {
    if (this.autoplayTimeoutId !== null) {
      clearTimeout(this.autoplayTimeoutId);
      this.autoplayTimeoutId = null;
    }
    if (this.splide) {
      this.splide.destroy();
      this.splide = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.collectionData = null;
  }

  private emitError(error: Error) {
    if (this.container) {
      this.container.innerHTML = `
        <div class="jaaq-collection-error">
          ${error.message}
        </div>
      `;
    }

    this.dispatchEvent(
      new CustomEvent('jaaq:collection:error', {
        detail: error,
        bubbles: true,
        composed: true,
      }),
    );
  }

  get client(): JaaqClient | null {
    return this.clientInstance;
  }

  set client(value: JaaqClient | null) {
    this.clientInstance = value;
    if (this.connected) {
      this.destroyCarousel();
      this.initCarousel();
    }
  }

  get collectionId(): string | null {
    return this.getAttribute('collection-id');
  }

  set collectionId(value: string | null) {
    if (value) {
      this.setAttribute('collection-id', value);
    } else {
      this.removeAttribute('collection-id');
    }
  }

  refresh(): void {
    this.destroyCarousel();
    this.initCarousel();
  }

  next(): void {
    this.splide?.go('+1');
  }

  prev(): void {
    this.splide?.go('-1');
  }

  go(index: number): void {
    this.splide?.go(index);
  }

  destroy(): void {
    this.destroyCarousel();
  }

  getCollection(): CollectionDTO | null {
    return this.collectionData;
  }
}
