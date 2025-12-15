import { createJaaqClient, type JaaqClient } from '@src/index';
import type { VideoDTO } from '@src/types';
import '@ui/shared/styles.css';
import './styles.css';

type CarouselConfig = {
  collectionId: string;
  client?: JaaqClient;
  apiKey?: string;
  clientId?: string;
  baseUrl?: string;
  autoplay?: boolean;
  maxVisible?: number;
  className?: string;
};

type CarouselState = {
  currentIndex: number;
  videos: VideoDTO[];
  isLoading: boolean;
  error: string | null;
};

type CarouselEventMap = {
  slidechange: { index: number; video: VideoDTO };
  videoplay: { videoId: string };
  error: Error;
};

type CarouselEventCallback<T> = (_data: T) => void;

export class JaaqVideoCarousel {
  private container: HTMLElement;
  private config: CarouselConfig;
  private client: JaaqClient | null = null;
  private state: CarouselState;
  private listeners: Map<keyof CarouselEventMap, Set<CarouselEventCallback<unknown>>> = new Map();
  private elements: {
    carousel?: HTMLDivElement;
    viewport?: HTMLDivElement;
    track?: HTMLDivElement;
    prevBtn?: HTMLButtonElement;
    nextBtn?: HTMLButtonElement;
    dotsContainer?: HTMLDivElement;
    items: HTMLDivElement[];
    players: HTMLElement[];
  } = { items: [], players: [] };
  private resizeObserver?: ResizeObserver;

  constructor(container: HTMLElement | string, config: CarouselConfig) {
    this.container = typeof container === 'string' ? document.querySelector(container)! : container;

    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.config = { maxVisible: 3, autoplay: false, ...config };
    this.state = {
      currentIndex: 0,
      videos: [],
      isLoading: true,
      error: null,
    };

    if (config.client) {
      this.client = config.client;
    } else if (config.apiKey && config.clientId) {
      this.client = createJaaqClient({
        apiKey: config.apiKey,
        clientId: config.clientId,
        baseUrl: config.baseUrl,
      });
    } else {
      throw new Error('Please provide either a client instance or apiKey and clientId');
    }

    this.init();
  }

  private async init(): Promise<void> {
    this.createDOM();
    await this.loadCollection();
    this.attachEventListeners();
    this.setupResizeObserver();
  }

  private getCurrentMaxVisible(): number {
    if (!this.elements.viewport) return this.config.maxVisible || 3;

    const width = this.elements.viewport.offsetWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return this.config.maxVisible || 3;
  }

  private setupResizeObserver(): void {
    if (!this.elements.viewport) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.updateActiveSlide();
    });

    this.resizeObserver.observe(this.elements.viewport);
  }

  private async loadCollection(): Promise<void> {
    if (!this.client || !this.config.collectionId) return;

    try {
      this.state.isLoading = true;
      const collection = await this.client.collections.getById(this.config.collectionId);
      this.state.videos = collection.videos || [];
      this.state.isLoading = false;
      this.createDOM();
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Failed to load collection';
      this.state.isLoading = false;
      this.emit('error', error instanceof Error ? error : new Error('Failed to load collection'));
      this.createDOM();
    }
  }

  private createDOM(): void {
    this.container.innerHTML = '';

    const carousel = document.createElement('div');
    carousel.className = `jaaq-carousel ${this.config.className || ''}`;
    this.elements.carousel = carousel;

    if (this.state.isLoading) {
      carousel.innerHTML = '<div class="jaaq-carousel-loading">Loading videos...</div>';
      this.container.appendChild(carousel);
      return;
    }

    if (this.state.error || this.state.videos.length === 0) {
      carousel.innerHTML = `<div class="jaaq-carousel-error">${this.state.error || 'No videos available'}</div>`;
      this.container.appendChild(carousel);
      return;
    }

    const prevBtn = document.createElement('button');
    prevBtn.className = 'jaaq-carousel-arrow jaaq-carousel-prev';
    prevBtn.innerHTML = '&#8249;';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    this.elements.prevBtn = prevBtn;

    const viewport = document.createElement('div');
    viewport.className = 'jaaq-carousel-viewport';
    this.elements.viewport = viewport;

    const track = document.createElement('div');
    track.className = 'jaaq-carousel-track';
    this.elements.track = track;

    this.state.videos.forEach((video, index) => {
      const item = this.createCarouselItem(video, index);
      this.elements.items.push(item);
      track.appendChild(item);
    });

    viewport.appendChild(track);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'jaaq-carousel-arrow jaaq-carousel-next';
    nextBtn.innerHTML = '&#8250;';
    nextBtn.setAttribute('aria-label', 'Next slide');
    this.elements.nextBtn = nextBtn;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'jaaq-carousel-dots';
    this.elements.dotsContainer = dotsContainer;

    this.state.videos.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `jaaq-carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.dataset.index = index.toString();
      dotsContainer.appendChild(dot);
    });

    carousel.appendChild(prevBtn);
    carousel.appendChild(viewport);
    carousel.appendChild(nextBtn);
    carousel.appendChild(dotsContainer);

    this.container.appendChild(carousel);

    this.updateActiveSlide();
    this.setActiveVideo(this.state.currentIndex);
  }

  private createCarouselItem(video: VideoDTO, index: number): HTMLDivElement {
    const item = document.createElement('div');
    item.className = 'jaaq-carousel-item';
    item.dataset.index = index.toString();

    const player = document.createElement('jaaq-video-player') as HTMLElement;
    player.setAttribute('video-id', video.videoId);

    if (this.config.apiKey) player.setAttribute('api-key', this.config.apiKey);
    if (this.config.clientId) player.setAttribute('client-id', this.config.clientId);
    if (this.config.baseUrl) player.setAttribute('base-url', this.config.baseUrl);

    player.setAttribute('autoplay', String(this.config.autoplay ?? false));
    player.setAttribute('width', '100%');
    player.setAttribute('height', '100%');

    if (this.client && (player as any).client !== undefined) {
      (player as any).client = this.client;
    }

    player.addEventListener('jaaq:play', () => {
      this.handleVideoPlay(video.videoId, index);
    });

    player.addEventListener('jaaq:ended', () => {
      if (index === this.state.currentIndex) {
        this.next();
      }
    });

    this.elements.players.push(player);
    item.appendChild(player);

    return item;
  }

  private attachEventListeners(): void {
    if (this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener('click', () => this.prev());
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', () => this.next());
    }

    if (this.elements.dotsContainer) {
      this.elements.dotsContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('jaaq-carousel-dot')) {
          const index = parseInt(target.dataset.index || '0', 10);
          this.goToSlide(index);
        }
      });
    }

    document.addEventListener('keydown', this.handleKeydown);
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowLeft') {
      this.prev();
    } else if (e.key === 'ArrowRight') {
      this.next();
    }
  };

  private handleVideoPlay(videoId: string, index: number): void {
    this.elements.players.forEach((player, i) => {
      if (i !== index && typeof (player as any).pause === 'function') {
        (player as any).pause();
      }
    });

    this.emit('videoplay', { videoId });
  }

  next(): void {
    const maxIndex = this.state.videos.length - 1;
    const nextIndex = Math.min(this.state.currentIndex + 1, maxIndex);

    if (nextIndex !== this.state.currentIndex) {
      this.goToSlide(nextIndex);
    }
  }

  prev(): void {
    const prevIndex = Math.max(0, this.state.currentIndex - 1);

    if (prevIndex !== this.state.currentIndex) {
      this.goToSlide(prevIndex);
    }
  }

  goToSlide(index: number): void {
    const maxIndex = this.state.videos.length - 1;

    if (index < 0 || index > maxIndex) return;
    if (index === this.state.currentIndex) return;

    this.state.currentIndex = index;
    this.updateActiveSlide();
    this.setActiveVideo(index);

    const video = this.state.videos[index];
    this.emit('slidechange', { index, video });
  }

  private updateActiveSlide(): void {
    if (!this.elements.track || !this.elements.viewport) return;

    const viewportWidth = this.elements.viewport.offsetWidth;
    const isMobile = viewportWidth <= 768;
    const gap = isMobile ? 12 : 24;
    const scaleRatio = isMobile ? 1.1 : 1.2;

    const baseWidth = Math.floor(viewportWidth * 0.28);
    const activeWidth = baseWidth * scaleRatio;

    this.elements.items.forEach((item, i) => {
      item.style.width = `${baseWidth}px`;
      item.style.minWidth = `${baseWidth}px`;
      item.style.maxWidth = `${baseWidth}px`;
      item.style.flexShrink = '0';
      item.style.flexGrow = '0';

      if (i === this.state.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const centerOffset = viewportWidth / 2 - activeWidth / 2;
    const itemOffset = this.state.currentIndex * (baseWidth + gap);
    const finalOffset = itemOffset - centerOffset;

    this.elements.track.style.transform = `translateX(-${finalOffset}px)`;

    if (this.elements.dotsContainer) {
      const dots = this.elements.dotsContainer.querySelectorAll('.jaaq-carousel-dot');
      dots.forEach((dot, i) => {
        if (i === this.state.currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    const maxIndex = Math.max(0, this.state.videos.length - 1);

    if (this.elements.prevBtn) {
      this.elements.prevBtn.disabled = this.state.currentIndex === 0;
    }

    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = this.state.currentIndex >= maxIndex;
    }
  }

  private setActiveVideo(index: number): void {
    this.elements.players.forEach((player, i) => {
      if (i === index) {
        if (this.config.autoplay && typeof (player as any).play === 'function') {
          (player as any).play();
        }
      } else {
        if (typeof (player as any).pause === 'function') {
          (player as any).pause();
        }
      }
    });
  }

  on<K extends keyof CarouselEventMap>(event: K, callback: CarouselEventCallback<CarouselEventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as CarouselEventCallback<unknown>);
  }

  off<K extends keyof CarouselEventMap>(event: K, callback: CarouselEventCallback<CarouselEventMap[K]>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback as CarouselEventCallback<unknown>);
    }
  }

  private emit<K extends keyof CarouselEventMap>(event: K, data: CarouselEventMap[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(data);
      });
    }
  }

  getState(): CarouselState {
    return { ...this.state };
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeydown);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.elements.players.forEach((player) => {
      if (typeof (player as any).destroy === 'function') {
        (player as any).destroy();
      }
    });

    this.listeners.clear();
    this.container.innerHTML = '';
  }
}
