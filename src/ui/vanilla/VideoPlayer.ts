import Hls from 'hls.js';
import { createJaaqClient, type JaaqClient } from '@src/index';
import { isHLSSource, toggleFullscreen, clamp } from '@ui/shared/controls';
import type { PlayerConfig, PlayerEventMap, PlayerEventCallback, PlayerState } from '@ui/shared/types';
import type { VideoDTO } from '@src/types';
import '@ui/shared/styles.css';
import './styles.css';

/**
 * Vanilla JavaScript video player with custom controls, HLS support, and event system
 * @example
 * const player = new JaaqVideoPlayer('#container', {
 *   videoId: 'video-id',
 *   apiKey: 'api-key',
 *   clientId: 'client-id',
 *   autoplay: false
 * });
 *
 * player.on('play', () => console.log('Playing'));
 * player.on('pause', () => console.log('Paused'));
 */
type CaptionCue = {
  start: number;
  end: number;
  text: string;
};

export class JaaqVideoPlayer {
  private container: HTMLElement;
  private config: PlayerConfig;
  private client: JaaqClient | null = null;
  private hls: Hls | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private state: PlayerState;
  private listeners: Map<keyof PlayerEventMap, Set<PlayerEventCallback<unknown>>> = new Map();
  private captionCues: CaptionCue[] = [];
  private elements: {
    player?: HTMLDivElement;
    controls?: HTMLDivElement;
    progressBar?: HTMLDivElement;
    progressFilled?: HTMLDivElement;
    playPauseBtn?: HTMLButtonElement;
    volumeBtn?: HTMLButtonElement;
    fullscreenBtn?: HTMLButtonElement;
    captionsBtn?: HTMLButtonElement;
    loading?: HTMLDivElement;
    error?: HTMLDivElement;
    logo?: HTMLDivElement;
    centerPlayBtn?: HTMLButtonElement;
    gradientOverlay?: HTMLDivElement;
    captionDisplay?: HTMLDivElement;
    videoTitle?: HTMLDivElement;
    videoAuthor?: HTMLDivElement;
    videoDescription?: HTMLDivElement;
  } = {};

  /**
   * Creates a new video player instance
   * @param container - HTML element or CSS selector to render the player into
   * @param config - Player configuration options
   * @throws {Error} If container element is not found or if authentication credentials are missing
   */
  constructor(container: HTMLElement | string, config: PlayerConfig) {
    this.container = typeof container === 'string' ? document.querySelector(container)! : container;

    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.config = config;
    this.state = {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: config.startMuted === true,
      isFullscreen: false,
      isLoading: true,
      error: null,
      videoData: null,
      captionsEnabled: false,
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
    await this.loadVideo();
    this.attachEventListeners();
    if (this.config.startMuted === true) {
      this.updateVolumeUI();
    }
  }

  private createDOM(): void {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.style.width = this.config.width || '100%';
    wrapper.style.height = this.config.height || 'auto';

    const player = document.createElement('div');
    player.className = `jaaq-video-player jaaq-vanilla-player ${this.config.className || ''}`;
    this.elements.player = player;

    const video = document.createElement('video');
    this.videoElement = video;
    if (this.config.startMuted === true) {
      video.muted = true;
      video.setAttribute('muted', '');
    }
    player.appendChild(video);

    const logo = document.createElement('div');
    logo.className = 'jaaq-logo';
    logo.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="15" viewBox="0 0 50 15" fill="none">
        <path d="M48.0329 10.7826C48.7578 9.6622 49.1402 8.37108 49.1402 7.02322C49.1402 3.19784 46.0283 0.0859375 42.2029 0.0859375C38.3775 0.0859375 35.2656 3.19784 35.2656 7.02322C35.2656 10.8486 38.3753 13.9578 42.1985 13.9605C42.1991 13.9605 42.2002 13.9605 42.2007 13.9605H42.2029C43.8475 13.9605 45.4305 13.3687 46.6698 12.3285L49.9971 14.56V12.0999L48.0334 10.7826H48.0329ZM37.309 7.02322C37.309 4.32479 39.5045 2.12927 42.2035 2.12927C44.9024 2.12927 47.0974 4.32479 47.0974 7.02322C47.0974 7.96252 46.8345 8.862 46.3359 9.64475L43.9817 8.06561C43.4531 7.71378 42.8373 7.52778 42.2002 7.52778C40.4394 7.52778 39.0054 8.95036 38.9846 10.7062C37.9586 9.80839 37.3084 8.49053 37.3084 7.02322H37.309ZM42.2035 11.9172C42.2035 11.9172 42.2002 11.9172 42.1985 11.9172C41.5527 11.9161 41.0274 11.3903 41.0274 10.7439C41.0274 10.0975 41.5538 9.57056 42.2007 9.57056C42.4331 9.57056 42.6578 9.6382 42.8493 9.76584L44.8714 11.1224C44.0853 11.633 43.1586 11.9172 42.2029 11.9172H42.2035Z" fill="white"/>
        <path d="M31.0751 0.686201C30.9856 0.579834 30.8858 0.483286 30.7767 0.39983C30.4374 0.138004 30.0283 0 29.5946 0C29.161 0 28.7524 0.138549 28.4126 0.39983C28.2304 0.540561 28.0755 0.711838 27.9533 0.909844C27.8835 1.02276 27.8257 1.14003 27.7815 1.25785L23.1172 13.7317H25.4551L29.5946 2.66135L33.7342 13.7317H36.0721L31.4078 1.25785C31.3303 1.05003 31.218 0.858024 31.0745 0.686746L31.0751 0.686201Z" fill="white"/>
        <path d="M17.4969 0.686201C17.4075 0.579834 17.3076 0.483286 17.1986 0.39983C16.8593 0.138004 16.4502 0 16.0165 0C15.5829 0 15.1743 0.138549 14.8345 0.39983C14.6523 0.540561 14.4974 0.711838 14.3752 0.909844C14.3054 1.02276 14.2476 1.14003 14.2034 1.25785L9.53906 13.7317H11.8769L16.0165 2.66135L20.1561 13.7317H22.494L17.8302 1.25731C17.7527 1.04948 17.6404 0.857478 17.4969 0.686201Z" fill="white"/>
        <path d="M9.86046 0.511825V0.371094H7.82204V9.02333C7.82204 10.6248 6.51891 11.928 4.91741 11.928C3.47028 11.928 2.23261 10.849 2.03897 9.41771L2.01988 9.27807L1.88024 9.29716L0.13964 9.5328L0 9.5519L0.0190914 9.69154C0.348555 12.1292 2.45462 13.9669 4.91741 13.9669C7.64313 13.9669 9.86046 11.7496 9.86046 9.02388V0.511825Z" fill="white"/>
      </svg>
    `;
    this.elements.logo = logo;
    player.appendChild(logo);

    const centerPlayBtn = document.createElement('button');
    centerPlayBtn.className = 'jaaq-center-play-btn';
    centerPlayBtn.innerHTML = `
      <svg viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="42" fill="white" fill-opacity="0.9"/>
        <path d="M33 28L56 42L33 56V28Z" fill="#000"/>
      </svg>
    `;
    centerPlayBtn.setAttribute('aria-label', 'Play video');
    this.elements.centerPlayBtn = centerPlayBtn;
    player.appendChild(centerPlayBtn);

    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'jaaq-gradient-overlay';
    this.elements.gradientOverlay = gradientOverlay;

    const captionDisplay = document.createElement('div');
    captionDisplay.className = 'jaaq-caption-display';
    captionDisplay.style.display = 'none';
    this.elements.captionDisplay = captionDisplay;
    gradientOverlay.appendChild(captionDisplay);

    const videoTitle = document.createElement('div');
    videoTitle.className = 'jaaq-video-title';
    this.elements.videoTitle = videoTitle;
    gradientOverlay.appendChild(videoTitle);

    const videoAuthor = document.createElement('div');
    videoAuthor.className = 'jaaq-video-author';
    this.elements.videoAuthor = videoAuthor;
    gradientOverlay.appendChild(videoAuthor);

    const videoDescription = document.createElement('div');
    videoDescription.className = 'jaaq-video-description';
    this.elements.videoDescription = videoDescription;
    gradientOverlay.appendChild(videoDescription);

    player.appendChild(gradientOverlay);

    const loading = document.createElement('div');
    loading.className = 'jaaq-loading';
    this.elements.loading = loading;
    player.appendChild(loading);

    const error = document.createElement('div');
    error.className = 'jaaq-error';
    error.style.display = 'none';
    this.elements.error = error;
    player.appendChild(error);

    const controls = document.createElement('div');
    controls.className = 'jaaq-controls';
    this.elements.controls = controls;

    const controlsBottom = document.createElement('div');
    controlsBottom.className = 'jaaq-controls-bottom';

    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'jaaq-control-btn';
    playPauseBtn.textContent = '▶';
    playPauseBtn.setAttribute('aria-label', 'Play');
    this.elements.playPauseBtn = playPauseBtn;
    controlsBottom.appendChild(playPauseBtn);

    const volumeBtn = document.createElement('button');
    volumeBtn.className = 'jaaq-control-btn';
    volumeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
        <path d="M11.2168 19.9287L4.20801 13.7031H0V6.22559H4.20898L11.2168 0V19.9287ZM14.0215 0.150391C16.2405 0.150468 18.1409 1.39074 19.4385 3.17676C20.7365 4.9634 21.499 7.36811 21.499 9.96484C21.499 12.5613 20.7363 14.9654 19.4385 16.752C18.1409 18.538 16.2405 19.7792 14.0215 19.7793V17.1025C15.2032 17.1025 16.3824 16.4464 17.3135 15.165C18.2442 13.8839 18.8593 12.0493 18.8594 9.96484C18.8594 7.88034 18.2442 6.04581 17.3135 4.76465C16.3824 3.4832 15.2033 2.82723 14.0215 2.82715V0.150391ZM14.0215 5.75879C15.5701 5.75896 16.8252 7.64189 16.8252 9.96484C16.8251 12.2877 15.57 14.1707 14.0215 14.1709V5.75879Z" fill="white"/>
      </svg>
    `;
    volumeBtn.setAttribute('aria-label', 'Mute');
    this.elements.volumeBtn = volumeBtn;
    controlsBottom.appendChild(volumeBtn);

    const progressBar = document.createElement('div');
    progressBar.className = 'jaaq-progress-bar';
    this.elements.progressBar = progressBar;

    const progressFilled = document.createElement('div');
    progressFilled.className = 'jaaq-progress-filled';
    this.elements.progressFilled = progressFilled;
    progressBar.appendChild(progressFilled);
    controlsBottom.appendChild(progressBar);

    const captionsBtn = document.createElement('button');
    captionsBtn.className = 'jaaq-control-btn jaaq-captions-btn';
    captionsBtn.innerHTML = 'CC';
    captionsBtn.setAttribute('aria-label', 'Captions');
    this.elements.captionsBtn = captionsBtn;
    controlsBottom.appendChild(captionsBtn);

    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'jaaq-control-btn';
    fullscreenBtn.textContent = '⛶';
    fullscreenBtn.setAttribute('aria-label', 'Fullscreen');
    this.elements.fullscreenBtn = fullscreenBtn;
    controlsBottom.appendChild(fullscreenBtn);

    controls.appendChild(controlsBottom);
    player.appendChild(controls);

    wrapper.appendChild(player);
    this.container.appendChild(wrapper);

    this.updateControlsVisibility();
  }

  private updateControlsVisibility(): void {
    const showControls = this.config.controls !== false;
    if (this.elements.controls) {
      this.elements.controls.style.display = showControls ? '' : 'none';
    }
  }

  private async loadVideo(): Promise<void> {
    if (!this.client || !this.videoElement) return;

    try {
      this.setState({ isLoading: true, error: null });

      const video = await this.client.videos.getById(this.config.videoId);
      this.setState({ videoData: video });

      if (video.subtitle) {
        this.captionCues = this.parseWebVTT(video.subtitle);
      }

      this.updateOverlayContent(video);
      this.emit('loaded', video);

      const videoUrl = video.videoUrl;

      if (isHLSSource(videoUrl)) {
        if (Hls.isSupported()) {
          if (this.hls) {
            this.hls.destroy();
          }

          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });

          if (this.config.startMuted === true && this.videoElement) {
            this.videoElement.muted = true;
            this.videoElement.setAttribute('muted', '');
          }

          hls.loadSource(videoUrl);
          hls.attachMedia(this.videoElement);

          if (this.config.startMuted === true && this.videoElement) {
            this.videoElement.muted = true;
            this.videoElement.setAttribute('muted', '');
          }

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            this.setState({ isLoading: false });
            if (this.elements.loading) {
              this.elements.loading.style.display = 'none';
            }
            if (this.config.startMuted === true && this.videoElement) {
              this.videoElement.muted = true;
              this.videoElement.setAttribute('muted', '');
              this.setState({ isMuted: true });
              this.updateVolumeUI();
            }
            if (this.config.autoplay) {
              if (this.config.startMuted === true && this.videoElement) {
                this.videoElement.muted = true;
                this.videoElement.setAttribute('muted', '');
                this.setState({ isMuted: true });
                this.updateVolumeUI();
              }
              this.play();
            }
          });

          hls.on(Hls.Events.ERROR, (_event: unknown, data: { fatal?: boolean; type?: string; details?: string }) => {
            if (data.fatal) {
              const errorMsg = `HLS Error: ${data.type} - ${data.details}`;
              this.showError(errorMsg);
              this.emit('error', new Error(errorMsg));
            }
          });

          this.hls = hls;
        } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
          this.videoElement.src = videoUrl;
          if (this.config.startMuted === true) {
            this.videoElement.muted = true;
            this.videoElement.setAttribute('muted', '');
            this.setState({ isMuted: true });
            this.updateVolumeUI();
          }
          this.setState({ isLoading: false });
          if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
          }
          if (this.config.autoplay) {
            if (this.config.startMuted === true && this.videoElement) {
              this.videoElement.muted = true;
              this.videoElement.setAttribute('muted', '');
              this.setState({ isMuted: true });
              this.updateVolumeUI();
            }
            this.play();
          }
        } else {
          throw new Error('HLS is not supported in this browser');
        }
      } else {
        this.videoElement.src = videoUrl;
        if (this.config.startMuted === true) {
          this.videoElement.muted = true;
          this.videoElement.setAttribute('muted', '');
          this.setState({ isMuted: true });
          this.updateVolumeUI();
        }
        this.setState({ isLoading: false });
        if (this.elements.loading) {
          this.elements.loading.style.display = 'none';
        }
        if (this.config.autoplay) {
          if (this.config.startMuted === true && this.videoElement) {
            this.videoElement.muted = true;
            this.videoElement.setAttribute('muted', '');
            this.setState({ isMuted: true });
            this.updateVolumeUI();
          }
          this.play();
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load video';
      this.showError(errorMsg);
      this.setState({ isLoading: false });
      this.emit('error', err instanceof Error ? err : new Error(errorMsg));
    }
  }

  private parseWebVTT(webvtt: string): CaptionCue[] {
    const cues: CaptionCue[] = [];
    const lines = webvtt.split('\n');

    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();

      if (line.includes('-->')) {
        const [startTime, endTime] = line.split('-->').map((t) => t.trim());

        const parseTimestamp = (timestamp: string): number => {
          const parts = timestamp.split(':');
          if (parts.length === 3) {
            const hours = parseFloat(parts[0]);
            const minutes = parseFloat(parts[1]);
            const seconds = parseFloat(parts[2]);
            return hours * 3600 + minutes * 60 + seconds;
          } else if (parts.length === 2) {
            const minutes = parseFloat(parts[0]);
            const seconds = parseFloat(parts[1]);
            return minutes * 60 + seconds;
          }
          return 0;
        };

        const start = parseTimestamp(startTime);
        const end = parseTimestamp(endTime);

        i++;
        const textLines: string[] = [];
        while (i < lines.length && lines[i].trim() !== '') {
          textLines.push(lines[i].trim());
          i++;
        }

        if (textLines.length > 0) {
          cues.push({
            start,
            end,
            text: textLines.join(' '),
          });
        }
      }

      i++;
    }

    return cues;
  }

  private updateOverlayContent(video: VideoDTO): void {
    const showLogo = this.config.showLogo !== false;
    const showTitle = this.config.showTitle !== false;
    const showAuthor = this.config.showAuthor !== false;
    const showDescription = this.config.showDescription !== false;
    const showCaptions = this.config.showCaptions !== false;

    if (this.elements.logo) {
      this.elements.logo.style.display = showLogo ? 'block' : 'none';
    }

    if (this.elements.videoTitle) {
      const question = video.question || '';
      const creator = video.creator || '';
      const titleText = creator ? `${question} - ${creator}` : question;
      this.elements.videoTitle.textContent = titleText;
      this.elements.videoTitle.style.display = showTitle && question ? 'block' : 'none';
    }

    if (this.elements.videoAuthor) {
      const authorData = (video as any).author || (video as any).creator || (video as any).userName || '';
      this.elements.videoAuthor.textContent = authorData;
      this.elements.videoAuthor.style.display = showAuthor && authorData ? 'block' : 'none';
    }

    if (this.elements.videoDescription) {
      const descriptionText = video.creatorBiography || video.description || '';
      if (descriptionText) {
        const maxLength = 150;
        const truncated = descriptionText.length > maxLength ? descriptionText.substring(0, maxLength) + '...' : descriptionText;
        this.elements.videoDescription.innerHTML = `
          <span class="jaaq-description-text">${truncated}</span>
          ${descriptionText.length > maxLength ? '<span class="jaaq-read-more">  Read more</span>' : ''}
        `;
      }
      this.elements.videoDescription.style.display = showDescription && descriptionText ? 'block' : 'none';
    }

    if (this.elements.captionsBtn) {
      this.elements.captionsBtn.style.display = showCaptions ? 'flex' : 'none';
    }
  }

  private attachEventListeners(): void {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('play', () => {
      this.setState({ isPlaying: true });
      this.updatePlayPauseButton();
      if (this.elements.centerPlayBtn) {
        this.elements.centerPlayBtn.style.display = 'none';
      }
      this.emit('play', undefined);
    });

    this.videoElement.addEventListener('pause', () => {
      this.setState({ isPlaying: false });
      this.updatePlayPauseButton();
      if (this.elements.centerPlayBtn) {
        this.elements.centerPlayBtn.style.display = 'flex';
      }
      this.emit('pause', undefined);
    });

    this.videoElement.addEventListener('timeupdate', () => {
      this.setState({ currentTime: this.videoElement!.currentTime });
      this.updateProgress();
      this.updateCaptions();
      this.emit('timeupdate', this.videoElement!.currentTime);
    });

    this.videoElement.addEventListener('durationchange', () => {
      this.setState({ duration: this.videoElement!.duration });
    });

    this.videoElement.addEventListener('volumechange', () => {
      this.setState({
        volume: this.videoElement!.volume,
        isMuted: this.videoElement!.muted,
      });
      this.updateVolumeUI();
      this.emit('volumechange', this.videoElement!.volume);
    });

    this.videoElement.addEventListener('ended', () => {
      this.emit('ended', undefined);
    });

    this.elements.playPauseBtn?.addEventListener('click', () => {
      this.togglePlayPause();
    });

    this.elements.centerPlayBtn?.addEventListener('click', () => {
      this.play();
      if (this.elements.centerPlayBtn) {
        this.elements.centerPlayBtn.style.display = 'none';
      }
    });

    this.elements.progressBar?.addEventListener('click', (e) => {
      this.handleSeek(e);
    });

    this.elements.volumeBtn?.addEventListener('click', () => {
      this.toggleMute();
    });

    this.elements.captionsBtn?.addEventListener('click', () => {
      this.toggleCaptions();
    });

    this.elements.fullscreenBtn?.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    document.addEventListener('fullscreenchange', () => {
      const isFullscreen = !!document.fullscreenElement;
      this.setState({ isFullscreen });
      this.elements.player?.classList.toggle('fullscreen', isFullscreen);
      this.emit('fullscreenchange', isFullscreen);
    });

    this.elements.player?.addEventListener('mousemove', () => {
      this.elements.player?.classList.remove('is-paused');
    });

    this.videoElement.addEventListener('pause', () => {
      this.elements.player?.classList.add('is-paused');
    });

    this.videoElement.addEventListener('play', () => {
      this.elements.player?.classList.remove('is-paused');
    });
  }

  private setState(newState: Partial<PlayerState>): void {
    this.state = { ...this.state, ...newState };
  }

  private updatePlayPauseButton(): void {
    if (this.elements.playPauseBtn) {
      this.elements.playPauseBtn.textContent = this.state.isPlaying ? '⏸' : '▶';
      this.elements.playPauseBtn.setAttribute('aria-label', this.state.isPlaying ? 'Pause' : 'Play');
    }
  }

  private updateProgress(): void {
    if (this.elements.progressFilled && this.state.duration > 0) {
      const progress = (this.state.currentTime / this.state.duration) * 100;
      this.elements.progressFilled.style.width = `${progress}%`;
    }
  }

  private updateVolumeUI(): void {
    if (this.elements.volumeBtn) {
      const { isMuted, volume } = this.state;

      if (isMuted || volume === 0) {
        this.elements.volumeBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
            <path d="M11.2168 19.9287L4.20801 13.7031H0V6.22559H4.20898L11.2168 0V19.9287Z" fill="white"/>
          </svg>
        `;
      } else {
        this.elements.volumeBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
            <path d="M11.2168 19.9287L4.20801 13.7031H0V6.22559H4.20898L11.2168 0V19.9287ZM14.0215 0.150391C16.2405 0.150468 18.1409 1.39074 19.4385 3.17676C20.7365 4.9634 21.499 7.36811 21.499 9.96484C21.499 12.5613 20.7363 14.9654 19.4385 16.752C18.1409 18.538 16.2405 19.7792 14.0215 19.7793V17.1025C15.2032 17.1025 16.3824 16.4464 17.3135 15.165C18.2442 13.8839 18.8593 12.0493 18.8594 9.96484C18.8594 7.88034 18.2442 6.04581 17.3135 4.76465C16.3824 3.4832 15.2033 2.82723 14.0215 2.82715V0.150391ZM14.0215 5.75879C15.5701 5.75896 16.8252 7.64189 16.8252 9.96484C16.8251 12.2877 15.57 14.1707 14.0215 14.1709V5.75879Z" fill="white"/>
          </svg>
        `;
      }
    }
  }

  private updateCaptions(): void {
    if (!this.elements.captionDisplay || !this.state.captionsEnabled) {
      if (this.elements.captionDisplay) {
        this.elements.captionDisplay.style.display = 'none';
      }
      return;
    }

    const currentTime = this.state.currentTime;
    const currentCue = this.captionCues.find((cue) => currentTime >= cue.start && currentTime <= cue.end);

    if (currentCue) {
      this.elements.captionDisplay.textContent = currentCue.text;
      this.elements.captionDisplay.style.display = 'block';
    } else {
      this.elements.captionDisplay.style.display = 'none';
    }
  }

  private handleSeek(e: MouseEvent): void {
    if (!this.videoElement || !this.state.duration || !this.elements.progressBar) return;

    const rect = this.elements.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.videoElement.currentTime = this.state.duration * clamp(percent, 0, 1);
  }

  private showError(message: string): void {
    this.setState({ error: message, isLoading: false });
    if (this.elements.error) {
      this.elements.error.textContent = message;
      this.elements.error.style.display = 'block';
    }
    if (this.elements.loading) {
      this.elements.loading.style.display = 'none';
    }
  }

  private togglePlayPause(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private toggleCaptions(): void {
    this.setState({ captionsEnabled: !this.state.captionsEnabled });
    this.updateCaptionsButton();
    this.updateCaptions();
  }

  private updateCaptionsButton(): void {
    if (this.elements.captionsBtn) {
      if (this.state.captionsEnabled) {
        this.elements.captionsBtn.classList.add('active');
      } else {
        this.elements.captionsBtn.classList.remove('active');
      }
    }
  }

  private toggleFullscreen(): void {
    if (this.elements.player) {
      toggleFullscreen(this.elements.player);
    }
  }

  /**
   * Starts or resumes video playback
   */
  public play(): void {
    if (this.videoElement) {
      if (this.config.startMuted === true && !this.videoElement.muted) {
        this.videoElement.muted = true;
        this.videoElement.setAttribute('muted', '');
        this.setState({ isMuted: true });
      }
      this.videoElement.play();
    }
  }

  /**
   * Pauses video playback
   */
  public pause(): void {
    this.videoElement?.pause();
  }

  /**
   * Sets the playback volume
   * @param volume - Volume level between 0 (silent) and 1 (maximum)
   */
  public setVolume(volume: number): void {
    if (this.videoElement) {
      this.videoElement.volume = clamp(volume, 0, 1);
      this.videoElement.muted = volume === 0;
    }
  }

  /**
   * Toggles audio mute state
   */
  public toggleMute(): void {
    if (this.videoElement) {
      this.videoElement.muted = !this.videoElement.muted;
    }
  }

  /**
   * Seeks to a specific time in the video
   * @param time - Target time in seconds
   */
  public seek(time: number): void {
    if (this.videoElement) {
      this.videoElement.currentTime = clamp(time, 0, this.state.duration);
    }
  }

  public setFeatures(
    features: Partial<
      Pick<PlayerConfig, 'showLogo' | 'showTitle' | 'showAuthor' | 'showDescription' | 'showCaptions' | 'controls' | 'startMuted'>
    >,
  ): void {
    this.config = { ...this.config, ...features };

    if (features.controls !== undefined) {
      this.updateControlsVisibility();
    }

    if (features.startMuted !== undefined && this.videoElement) {
      this.videoElement.muted = features.startMuted === true;
      if (features.startMuted === true) {
        this.videoElement.setAttribute('muted', '');
      } else {
        this.videoElement.removeAttribute('muted');
      }
      this.setState({ isMuted: features.startMuted === true });
      this.updateVolumeUI();
    }

    if (this.state.videoData) {
      this.updateOverlayContent(this.state.videoData);
    } else {
      if (features.showLogo !== undefined && this.elements.logo) {
        this.elements.logo.style.display = features.showLogo ? 'block' : 'none';
      }
      if (features.showCaptions !== undefined && this.elements.captionsBtn) {
        this.elements.captionsBtn.style.display = features.showCaptions ? 'flex' : 'none';
      }
    }
  }

  /**
   * Returns a copy of the current player state
   * @returns Current player state object
   */
  public getState(): PlayerState {
    return { ...this.state };
  }

  /**
   * Registers an event listener for player events
   * @param event - Event name to listen for
   * @param callback - Function to call when event fires
   */
  public on<K extends keyof PlayerEventMap>(event: K, callback: PlayerEventCallback<PlayerEventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as PlayerEventCallback<unknown>);
  }

  /**
   * Removes an event listener for player events
   * @param event - Event name to stop listening for
   * @param callback - Function to remove from listeners
   */
  public off<K extends keyof PlayerEventMap>(event: K, callback: PlayerEventCallback<PlayerEventMap[K]>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback as PlayerEventCallback<unknown>);
    }
  }

  private emit<K extends keyof PlayerEventMap>(event: K, data: PlayerEventMap[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  /**
   * Destroys the player instance and cleans up resources
   * Removes all event listeners, stops playback, and clears the DOM
   */
  public destroy(): void {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      this.videoElement = null;
    }

    this.listeners.clear();
    this.container.innerHTML = '';
  }
}
