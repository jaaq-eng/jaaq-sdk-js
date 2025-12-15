import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as React from 'react';
import { registerJaaqComponents } from '@ui/webcomponents/register';
import { JaaqVideoPlayerElement } from '@ui/webcomponents/VideoPlayer';
import type { VideoDTO } from '@src/types';
import type { PlayerConfig, PlayerState } from '@ui/shared/types';

if (typeof window !== 'undefined') {
  registerJaaqComponents();
}

type VideoPlayerProps = PlayerConfig & {
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (_error: Error) => void;
  onLoaded?: (_video: VideoDTO) => void;
  onTimeUpdate?: (_time: number) => void;
  onVolumeChange?: (_volume: number) => void;
  onEnded?: () => void;
  onFullscreenChange?: (_isFullscreen: boolean) => void;
  showInfo?: boolean;
};

type VideoPlayerHandle = {
  play: () => void;
  pause: () => void;
  setVolume: (_volume: number) => void;
  toggleMute: () => void;
  seek: (_time: number) => void;
  getState: () => PlayerState | null;
  destroy: () => void;
};

function VideoPlayerComponent(
  {
    videoId,
    apiKey,
    clientId,
    client,
    baseUrl,
    autoplay = false,
    controls = true,
    width = '100%',
    height = 'auto',
    className = '',
    showLogo = true,
    showTitle = true,
    showAuthor = true,
    showDescription = true,
    showCaptions = true,
    onPlay,
    onPause,
    onError,
    onLoaded,
    onTimeUpdate,
    onVolumeChange,
    onEnded,
    onFullscreenChange,
    showInfo = false,
  }: VideoPlayerProps,
  ref: React.ForwardedRef<VideoPlayerHandle>,
) {
  const playerRef = useRef<JaaqVideoPlayerElement>(null);
  const videoDataRef = useRef<VideoDTO | null>(null);

  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.play(),
    pause: () => playerRef.current?.pause(),
    setVolume: (volume: number) => playerRef.current?.setVolume(volume),
    toggleMute: () => playerRef.current?.toggleMute(),
    seek: (time: number) => playerRef.current?.seek(time),
    getState: () => playerRef.current?.getState() || null,
    destroy: () => playerRef.current?.destroy(),
  }));

  const handleLoaded = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    videoDataRef.current = detail;
    onLoaded?.(detail);
  };

  const handlePlay = () => onPlay?.();
  const handlePause = () => onPause?.();
  const handleTimeUpdate = (e: Event) => {
    const time = (e as CustomEvent).detail;
    onTimeUpdate?.(time);
  };
  const handleVolumeChange = (e: Event) => {
    const volume = (e as CustomEvent).detail;
    onVolumeChange?.(volume);
  };
  const handleEnded = () => onEnded?.();
  const handleError = (e: Event) => {
    const error = (e as CustomEvent).detail;
    onError?.(error);
  };
  const handleFullscreenChange = (e: Event) => {
    const isFullscreen = (e as CustomEvent).detail;
    onFullscreenChange?.(isFullscreen);
  };

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (client) {
      player.client = client;
    }

    player.addEventListener('jaaq:loaded', handleLoaded);
    player.addEventListener('jaaq:play', handlePlay);
    player.addEventListener('jaaq:pause', handlePause);
    player.addEventListener('jaaq:timeupdate', handleTimeUpdate);
    player.addEventListener('jaaq:volumechange', handleVolumeChange);
    player.addEventListener('jaaq:ended', handleEnded);
    player.addEventListener('jaaq:error', handleError);
    player.addEventListener('jaaq:fullscreenchange', handleFullscreenChange);

    return () => {
      player.removeEventListener('jaaq:loaded', handleLoaded);
      player.removeEventListener('jaaq:play', handlePlay);
      player.removeEventListener('jaaq:pause', handlePause);
      player.removeEventListener('jaaq:timeupdate', handleTimeUpdate);
      player.removeEventListener('jaaq:volumechange', handleVolumeChange);
      player.removeEventListener('jaaq:ended', handleEnded);
      player.removeEventListener('jaaq:error', handleError);
      player.removeEventListener('jaaq:fullscreenchange', handleFullscreenChange);
    };
  }, [client, onPlay, onPause, onError, onLoaded, onTimeUpdate, onVolumeChange, onEnded, onFullscreenChange]);

  return (
    <div style={{ width, height }} className={className}>
      <jaaq-video-player
        ref={playerRef}
        video-id={videoId}
        api-key={apiKey}
        client-id={clientId}
        base-url={baseUrl}
        autoplay={autoplay ? 'true' : 'false'}
        controls={controls ? 'true' : 'false'}
        show-logo={showLogo ? 'true' : 'false'}
        show-title={showTitle ? 'true' : 'false'}
        show-author={showAuthor ? 'true' : 'false'}
        show-description={showDescription ? 'true' : 'false'}
        show-captions={showCaptions ? 'true' : 'false'}
        width="100%"
        height="auto"
      />
      {showInfo && videoDataRef.current && (
        <div className="jaaq-video-info" style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
            {videoDataRef.current.question || videoDataRef.current.description || 'Untitled Video'}
          </h3>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Video ID:</strong> {videoDataRef.current.id}
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Duration:</strong> {videoDataRef.current.duration || 'Unknown'} seconds
          </p>
        </div>
      )}
    </div>
  );
}

VideoPlayerComponent.displayName = 'VideoPlayer';

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(VideoPlayerComponent);
