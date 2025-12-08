import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { createJaaqClient, type JaaqClient } from '@src/index';
import type { VideoDTO } from '@src/types';
import { formatTime, isHLSSource, toggleFullscreen, clamp } from '@ui/shared/controls';
import type { PlayerConfig } from '@ui/shared/types';
import '@ui/shared/styles.css';
import './styles.css';

/**
 * Props for the VideoPlayer React component
 */
type VideoPlayerProps = Omit<PlayerConfig, 'controls'> & {
  /** Callback fired when playback starts */
  onPlay?: () => void;
  /** Callback fired when playback pauses */
  onPause?: () => void;
  /** Callback fired when an error occurs */
  onError?: (_error: Error) => void;
  /** Callback fired when video metadata is loaded */
  onLoaded?: (_video: VideoDTO) => void;
  /** Whether to show video metadata below the player */
  showInfo?: boolean;
};

/**
 * React video player component with custom controls, HLS support, and modern design
 *
 * @example
 * import { VideoPlayer } from '@jaaq/jaaq-sdk-js/ui/react';
 *
 * function App() {
 *   return (
 *     <VideoPlayer
 *       videoId="video-123"
 *       apiKey="your-api-key"
 *       clientId="your-client-id"
 *       autoplay={false}
 *       showInfo={true}
 *       onPlay={() => console.log('Playing')}
 *       onError={(err) => console.error(err)}
 *     />
 *   );
 * }
 */
export function VideoPlayer({
  videoId,
  apiKey,
  clientId,
  client: externalClient,
  baseUrl,
  autoplay = false,
  width = '100%',
  height = 'auto',
  className = '',
  onPlay,
  onPause,
  onError,
  onLoaded,
  showInfo = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const clientRef = useRef<JaaqClient | null>(externalClient || null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoDTO | null>(null);

  useEffect(() => {
    if (!clientRef.current && apiKey && clientId) {
      clientRef.current = createJaaqClient({ apiKey, clientId, baseUrl });
    }
  }, [apiKey, clientId, baseUrl]);

  useEffect(() => {
    const loadVideo = async () => {
      if (!clientRef.current) {
        setError('No client available. Please provide either a client instance or apiKey and clientId.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const video = await clientRef.current.videos.getById(videoId);
        setVideoData(video);
        onLoaded?.(video);

        if (videoRef.current) {
          const videoUrl = video.videoUrl;

          if (isHLSSource(videoUrl)) {
            if (Hls.isSupported()) {
              if (hlsRef.current) {
                hlsRef.current.destroy();
              }

              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
              });

              hls.loadSource(videoUrl);
              hls.attachMedia(videoRef.current);

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
                if (autoplay) {
                  videoRef.current?.play();
                }
              });

              hls.on(Hls.Events.ERROR, (_event: unknown, data: { fatal?: boolean; type?: string; details?: string }) => {
                if (data.fatal) {
                  const errorMsg = `HLS Error: ${data.type} - ${data.details}`;
                  setError(errorMsg);
                  const err = new Error(errorMsg);
                  onError?.(err);
                }
              });

              hlsRef.current = hls;
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
              videoRef.current.src = videoUrl;
              setIsLoading(false);
              if (autoplay) {
                videoRef.current.play();
              }
            } else {
              throw new Error('HLS is not supported in this browser');
            }
          } else {
            videoRef.current.src = videoUrl;
            setIsLoading(false);
            if (autoplay) {
              videoRef.current.play();
            }
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load video';
        setError(errorMsg);
        setIsLoading(false);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      }
    };

    loadVideo();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoId, autoplay, onError, onLoaded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [onPlay, onPause]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = duration * clamp(percent, 0, 1);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleFullscreenToggle = () => {
    if (containerRef.current) {
      toggleFullscreen(containerRef.current);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{ width, height }}>
      <div
        ref={containerRef}
        className={`jaaq-video-player jaaq-react-player ${isFullscreen ? 'fullscreen' : ''} ${!isPlaying ? 'is-paused' : ''} ${className}`}
      >
        <video ref={videoRef} />

        {isLoading && <div className="jaaq-loading" />}

        {error && <div className="jaaq-error">{error}</div>}

        {!error && !isLoading && (
          <div className="jaaq-controls">
            <div className="jaaq-progress-bar" onClick={handleSeek}>
              <div className="jaaq-progress-filled" style={{ width: `${progress}%` }} />
            </div>

            <div className="jaaq-controls-bottom">
              <button className="jaaq-control-btn" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? '⏸' : '▶'}
              </button>

              <div className="jaaq-time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="jaaq-spacer" />

              <div className="jaaq-volume-container">
                <button className="jaaq-control-btn" onClick={handleMuteToggle} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="jaaq-volume-slider"
                  aria-label="Volume"
                />
              </div>

              <button className="jaaq-control-btn" onClick={handleFullscreenToggle} aria-label="Fullscreen">
                {isFullscreen ? '⛶' : '⛶'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showInfo && videoData && (
        <div className="jaaq-video-info">
          <h3>{videoData.question || videoData.description || 'Untitled Video'}</h3>
          <p>
            <strong>Video ID:</strong> {videoData.id}
          </p>
          <p>
            <strong>Duration:</strong> {videoData.duration || 'Unknown'} seconds
          </p>
          <p>
            <strong>Format:</strong> {isHLSSource(videoData.videoUrl) ? 'HLS (.m3u8)' : 'MP4'}
          </p>
        </div>
      )}
    </div>
  );
}
