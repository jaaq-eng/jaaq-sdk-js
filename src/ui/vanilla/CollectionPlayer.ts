import Splide from '@splidejs/splide';
import { JaaqClient, BASE_URL, createJaaqClient } from '@src/index';
import type { CollectionDTO, VideoDTO } from '@src/types';
import type { VideoSettings } from '@ui/shared/types';
import '@ui/shared/styles.css';
import './styles.css';
import '@splidejs/splide/css';

type CollectionPlayerConfig = {
  collectionId: string;
  client?: JaaqClient;
  apiKey?: string;
  clientId?: string;
  baseUrl?: string;
  autoplay?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  videoSettings?: VideoSettings;
};

type CollectionPlayerEventMap = {
  loaded: CollectionDTO;
  slidechange: { index: number; video: VideoDTO };
  error: Error;
};

type CollectionPlayerEventCallback<T> = (_data: T) => void;

export class JaaqCollectionPlayer {
  private container: HTMLElement;
  private config: CollectionPlayerConfig;
  private client: JaaqClient | null = null;
  private splide: Splide | null = null;
  private playerElement: HTMLDivElement | null = null;
  private carouselElement: HTMLDivElement | null = null;
  private collectionData: CollectionDTO | null = null;
  private autoplayTimeoutId: number | null = null;
  private listeners: Map<keyof CollectionPlayerEventMap, Set<CollectionPlayerEventCallback<unknown>>> = new Map();

  constructor(container: HTMLElement | string, config: CollectionPlayerConfig) {
    this.container = typeof container === 'string' ? document.querySelector(container)! : container;

    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.config = { autoplay: false, showArrows: true, showDots: true, ...config };

    if (config.client) {
      this.client = config.client;
    } else if (config.apiKey && config.clientId) {
      this.client = createJaaqClient({
        apiKey: config.apiKey,
        clientId: config.clientId,
        baseUrl: config.baseUrl || BASE_URL,
      });
    } else {
      throw new Error('Either client property or apiKey and clientId are required');
    }

    this.init();
  }

  private async init(): Promise<void> {
    this.render();
    await this.initCarousel();
  }

  private render(): void {
    this.container.innerHTML = '';

    this.playerElement = document.createElement('div');
    this.playerElement.className = `jaaq-collection-player ${this.config.className || ''}`;

    this.container.appendChild(this.playerElement);
  }

  private async initCarousel(): Promise<void> {
    if (!this.playerElement) return;

    const collectionId = this.config.collectionId;
    if (!collectionId) {
      this.emitError(new Error('collectionId is required'));
      return;
    }

    this.showLoading();

    try {
      if (!this.client) {
        throw new Error('Client is not initialized');
      }

      this.collectionData = await this.client.collections.getById(collectionId);

      if (!this.collectionData.videos || this.collectionData.videos.length === 0) {
        this.emitError(new Error('No videos found in collection'));
        return;
      }

      this.renderCarousel();
      this.initSplide();

      this.emit('loaded', this.collectionData);
    } catch (error) {
      this.emitError(error instanceof Error ? error : new Error('Failed to load collection'));
    }
  }

  private showLoading(): void {
    if (!this.playerElement) return;
    this.playerElement.innerHTML = `
      <div class="jaaq-collection-loading">
        <div class="jaaq-collection-spinner"></div>
      </div>
    `;
  }

  private renderCarousel(): void {
    if (!this.playerElement || !this.collectionData) return;

    this.playerElement.innerHTML = '';

    this.carouselElement = document.createElement('div');
    this.carouselElement.className = 'splide jaaq-collection-carousel';

    const track = document.createElement('div');
    track.className = 'splide__track';

    const list = document.createElement('ul');
    list.className = 'splide__list';

    this.collectionData.videos.forEach((video) => {
      const slide = document.createElement('li');
      slide.className = 'splide__slide';

      const player = document.createElement('jaaq-video-player') as HTMLElement;
      player.setAttribute('video-id', video.videoId);
      if (this.config.apiKey) player.setAttribute('api-key', this.config.apiKey);
      if (this.config.clientId) player.setAttribute('client-id', this.config.clientId);
      if (this.config.baseUrl) player.setAttribute('base-url', this.config.baseUrl);
      player.setAttribute('autoplay', 'false');
      player.setAttribute('width', '100%');

      if (this.config.videoSettings) {
        const settings = this.config.videoSettings;
        if (settings.controls !== undefined) {
          player.setAttribute('controls', String(settings.controls));
        }
        if (settings.showLogo !== undefined) {
          player.setAttribute('show-logo', String(settings.showLogo));
        }
        if (settings.showTitle !== undefined) {
          player.setAttribute('show-title', String(settings.showTitle));
        }
        if (settings.showAuthor !== undefined) {
          player.setAttribute('show-author', String(settings.showAuthor));
        }
        if (settings.showDescription !== undefined) {
          player.setAttribute('show-description', String(settings.showDescription));
        }
        if (settings.showCaptions !== undefined) {
          player.setAttribute('show-captions', String(settings.showCaptions));
        }
        if (settings.width !== undefined) {
          player.setAttribute('width', String(settings.width));
        }
        if (settings.height !== undefined) {
          player.setAttribute('height', String(settings.height));
        }
      }

      if (this.client && (player as any).client !== undefined) {
        (player as any).client = this.client;
      }

      slide.appendChild(player);
      list.appendChild(slide);
    });

    track.appendChild(list);
    this.carouselElement.appendChild(track);
    this.playerElement.appendChild(this.carouselElement);
  }

  private initSplide(): void {
    if (!this.carouselElement) return;

    this.splide = new Splide(this.carouselElement, {
      type: 'loop',
      perPage: 3,
      focus: 'center',
      gap: '0.5rem',
      perMove: 1,
      autoHeight: true,
      updateOnMove: true,
      padding: '5rem',
      breakpoints: {
        768: {
          perPage: 1,
        },
        1024: {
          perPage: 2,
        },
      },
      arrows: this.config.showArrows !== false,
      pagination: this.config.showDots !== false,
      autoplay: false,
    });

    this.splide.on('moved', (newIndex: number) => {
      this.handleSlideChange(newIndex);

      if (this.collectionData) {
        this.emit('slidechange', { index: newIndex, video: this.collectionData.videos[newIndex] });
      }
    });

    this.splide.mount();

    setTimeout(() => {
      if (this.splide) {
        this.handleSlideChange(this.splide.index);
      }
    }, 100);
  }

  private handleSlideChange(_activeIndex: number): void {
    if (!this.carouselElement) return;

    const isAutoplayEnabled = this.config.autoplay;

    if (this.autoplayTimeoutId !== null) {
      clearTimeout(this.autoplayTimeoutId);
      this.autoplayTimeoutId = null;
    }

    const originalSlides = this.carouselElement.querySelectorAll('.splide__slide:not(.splide__slide--clone)');

    originalSlides.forEach((slide) => {
      const player = slide.querySelector('jaaq-video-player') as any;
      if (!player) return;

      const isActive = slide.classList.contains('is-active');

      if (isActive) {
        if (isAutoplayEnabled) {
          this.autoplayTimeoutId = window.setTimeout(() => {
            player.play?.();
          }, 1000);
        }
      } else {
        player.pause?.();
      }
    });
  }

  private destroyCarousel(): void {
    if (this.autoplayTimeoutId !== null) {
      clearTimeout(this.autoplayTimeoutId);
      this.autoplayTimeoutId = null;
    }
    if (this.splide) {
      this.splide.destroy();
      this.splide = null;
    }
    if (this.playerElement) {
      this.playerElement.innerHTML = '';
    }
    this.collectionData = null;
  }

  private emitError(error: Error): void {
    if (this.playerElement) {
      this.playerElement.innerHTML = `
        <div class="jaaq-collection-error">
          ${error.message}
        </div>
      `;
    }

    this.emit('error', error);
  }

  on<K extends keyof CollectionPlayerEventMap>(event: K, callback: CollectionPlayerEventCallback<CollectionPlayerEventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as CollectionPlayerEventCallback<unknown>);
  }

  off<K extends keyof CollectionPlayerEventMap>(event: K, callback: CollectionPlayerEventCallback<CollectionPlayerEventMap[K]>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback as CollectionPlayerEventCallback<unknown>);
    }
  }

  private emit<K extends keyof CollectionPlayerEventMap>(event: K, data: CollectionPlayerEventMap[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(data);
      });
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
    this.listeners.clear();
    this.container.innerHTML = '';
  }

  getCollection(): CollectionDTO | null {
    return this.collectionData;
  }
}
