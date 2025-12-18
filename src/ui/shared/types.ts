import type { JaaqClient } from '@src/index';
import type { VideoDTO } from '@src/types';

/**
 * Configuration options for video player components
 */
export type PlayerConfig = {
  /** Video ID to load */
  videoId: string;
  /** API key for authentication (required if no client provided) */
  apiKey?: string;
  /** Client ID for authentication (required if no client provided) */
  clientId?: string;
  /** Existing JaaqClient instance to use instead of creating a new one */
  client?: JaaqClient;
  /** Custom API base URL */
  baseUrl?: string;
  /** Whether to automatically start playback when video loads */
  autoplay?: boolean;
  /** Whether to show player controls */
  controls?: boolean;
  /** CSS width of the player container */
  width?: string;
  /** CSS height of the player container */
  height?: string;
  /** Additional CSS class name(s) to apply to the player */
  className?: string;
  /** Whether to show the JAAQ logo */
  showLogo?: boolean;
  /** Whether to show the video title */
  showTitle?: boolean;
  /** Whether to show the author name */
  showAuthor?: boolean;
  /** Whether to show the description */
  showDescription?: boolean;
  /** Whether to show captions button */
  showCaptions?: boolean;
};

/**
 * Current state of the video player
 */
export type PlayerState = {
  /** Whether the video is currently playing */
  isPlaying: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total video duration in seconds */
  duration: number;
  /** Current volume level (0-1) */
  volume: number;
  /** Whether the audio is muted */
  isMuted: boolean;
  /** Whether the player is in fullscreen mode */
  isFullscreen: boolean;
  /** Whether the video is currently loading */
  isLoading: boolean;
  /** Error message if an error occurred, null otherwise */
  error: string | null;
  /** Loaded video data, null if not yet loaded */
  videoData: VideoDTO | null;
  /** Whether captions are currently enabled */
  captionsEnabled: boolean;
};

/**
 * Map of player event names to their payload types
 */
export type PlayerEventMap = {
  /** Fired when playback starts */
  play: void;
  /** Fired when playback pauses */
  pause: void;
  /** Fired when playback time updates, provides current time in seconds */
  timeupdate: number;
  /** Fired when volume changes, provides new volume level (0-1) */
  volumechange: number;
  /** Fired when playback reaches the end */
  ended: void;
  /** Fired when an error occurs, provides Error object */
  error: Error;
  /** Fired when video metadata is loaded, provides VideoDTO */
  loaded: VideoDTO;
  /** Fired when fullscreen state changes, provides boolean fullscreen state */
  fullscreenchange: boolean;
};

/**
 * Event callback function type for player events
 * @template T - The type of data passed to the callback
 */
export type PlayerEventCallback<T> = (_data: T) => void;

/**
 * Video settings that can be passed to carousel components
 * Excludes carousel-specific props that are handled separately
 */
export type VideoSettings = Omit<PlayerConfig, 'videoId' | 'apiKey' | 'clientId' | 'baseUrl' | 'client' | 'autoplay'>;
