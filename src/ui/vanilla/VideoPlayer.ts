import Hls from 'hls.js';
import { createJaaqClient, type JaaqClient } from '@src/index';
import { formatTime, isHLSSource, toggleFullscreen, clamp } from '@ui/shared/controls';
import type { PlayerConfig, PlayerEventMap, PlayerEventCallback, PlayerState } from '@ui/shared/types';
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
export class JaaqVideoPlayer {
  private container: HTMLElement;
  private config: PlayerConfig;
  private client: JaaqClient | null = null;
  private hls: Hls | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private state: PlayerState;
  private listeners: Map<keyof PlayerEventMap, Set<PlayerEventCallback<unknown>>> = new Map();
  private elements: {
    player?: HTMLDivElement;
    controls?: HTMLDivElement;
    progressBar?: HTMLDivElement;
    progressFilled?: HTMLDivElement;
    playPauseBtn?: HTMLButtonElement;
    timeDisplay?: HTMLSpanElement;
    volumeBtn?: HTMLButtonElement;
    volumeSlider?: HTMLInputElement;
    fullscreenBtn?: HTMLButtonElement;
    loading?: HTMLDivElement;
    error?: HTMLDivElement;
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
      isMuted: false,
      isFullscreen: false,
      isLoading: true,
      error: null,
      videoData: null,
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
    player.appendChild(video);

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

    const progressBar = document.createElement('div');
    progressBar.className = 'jaaq-progress-bar';
    this.elements.progressBar = progressBar;

    const progressFilled = document.createElement('div');
    progressFilled.className = 'jaaq-progress-filled';
    this.elements.progressFilled = progressFilled;
    progressBar.appendChild(progressFilled);
    controls.appendChild(progressBar);

    const controlsBottom = document.createElement('div');
    controlsBottom.className = 'jaaq-controls-bottom';

    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'jaaq-control-btn';
    playPauseBtn.textContent = '▶';
    playPauseBtn.setAttribute('aria-label', 'Play');
    this.elements.playPauseBtn = playPauseBtn;
    controlsBottom.appendChild(playPauseBtn);

    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'jaaq-time';
    timeDisplay.textContent = '0:00 / 0:00';
    this.elements.timeDisplay = timeDisplay;
    controlsBottom.appendChild(timeDisplay);

    const spacer = document.createElement('div');
    spacer.className = 'jaaq-spacer';
    controlsBottom.appendChild(spacer);

    const volumeContainer = document.createElement('div');
    volumeContainer.className = 'jaaq-volume-container';

    const volumeBtn = document.createElement('button');
    volumeBtn.className = 'jaaq-control-btn';
    volumeBtn.textContent = '🔊';
    volumeBtn.setAttribute('aria-label', 'Mute');
    this.elements.volumeBtn = volumeBtn;
    volumeContainer.appendChild(volumeBtn);

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.01';
    volumeSlider.value = '1';
    volumeSlider.className = 'jaaq-volume-slider';
    volumeSlider.setAttribute('aria-label', 'Volume');
    this.elements.volumeSlider = volumeSlider;
    volumeContainer.appendChild(volumeSlider);

    controlsBottom.appendChild(volumeContainer);

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
  }

  private async loadVideo(): Promise<void> {
    if (!this.client || !this.videoElement) return;

    try {
      this.setState({ isLoading: true, error: null });

      const video = await this.client.videos.getById(this.config.videoId);
      this.setState({ videoData: video });
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

          hls.loadSource(videoUrl);
          hls.attachMedia(this.videoElement);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            this.setState({ isLoading: false });
            if (this.elements.loading) {
              this.elements.loading.style.display = 'none';
            }
            if (this.config.autoplay) {
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
          this.setState({ isLoading: false });
          if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
          }
          if (this.config.autoplay) {
            this.play();
          }
        } else {
          throw new Error('HLS is not supported in this browser');
        }
      } else {
        this.videoElement.src = videoUrl;
        this.setState({ isLoading: false });
        if (this.elements.loading) {
          this.elements.loading.style.display = 'none';
        }
        if (this.config.autoplay) {
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

  private attachEventListeners(): void {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('play', () => {
      this.setState({ isPlaying: true });
      this.updatePlayPauseButton();
      this.emit('play', undefined);
    });

    this.videoElement.addEventListener('pause', () => {
      this.setState({ isPlaying: false });
      this.updatePlayPauseButton();
      this.emit('pause', undefined);
    });

    this.videoElement.addEventListener('timeupdate', () => {
      this.setState({ currentTime: this.videoElement!.currentTime });
      this.updateProgress();
      this.updateTimeDisplay();
      this.emit('timeupdate', this.videoElement!.currentTime);
    });

    this.videoElement.addEventListener('durationchange', () => {
      this.setState({ duration: this.videoElement!.duration });
      this.updateTimeDisplay();
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

    this.elements.progressBar?.addEventListener('click', (e) => {
      this.handleSeek(e);
    });

    this.elements.volumeBtn?.addEventListener('click', () => {
      this.toggleMute();
    });

    this.elements.volumeSlider?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.setVolume(parseFloat(target.value));
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

  private updateTimeDisplay(): void {
    if (this.elements.timeDisplay) {
      this.elements.timeDisplay.textContent = `${formatTime(this.state.currentTime)} / ${formatTime(this.state.duration)}`;
    }
  }

  private updateVolumeUI(): void {
    if (this.elements.volumeBtn) {
      const { isMuted, volume } = this.state;
      this.elements.volumeBtn.textContent = isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊';
    }
    if (this.elements.volumeSlider) {
      this.elements.volumeSlider.value = this.state.isMuted ? '0' : this.state.volume.toString();
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

  private toggleFullscreen(): void {
    if (this.elements.player) {
      toggleFullscreen(this.elements.player);
    }
  }

  /**
   * Starts or resumes video playback
   */
  public play(): void {
    this.videoElement?.play();
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
