/**
 * Formats a time value in seconds to a human-readable string (M:SS format)
 * @param seconds - Time in seconds to format
 * @returns Formatted time string in M:SS format, or "0:00" if invalid
 * @example
 * formatTime(65) // "1:05"
 * formatTime(0) // "0:00"
 * formatTime(125) // "2:05"
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Checks if a video URL is an HLS (HTTP Live Streaming) source
 * @param url - Video URL to check
 * @returns True if the URL contains .m3u8 extension, false otherwise
 */
export function isHLSSource(url: string): boolean {
  return url.includes('.m3u8');
}

/**
 * Toggles fullscreen mode for the given element
 * If not in fullscreen, requests fullscreen for the element
 * If already in fullscreen, exits fullscreen mode
 * @param element - HTML element to toggle fullscreen for
 * @returns Promise that resolves when fullscreen state changes
 */
export function toggleFullscreen(element: HTMLElement): Promise<void> {
  if (!document.fullscreenElement) {
    return element.requestFullscreen();
  } else {
    return document.exitFullscreen();
  }
}

/**
 * Clamps a numeric value between a minimum and maximum value
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 * @example
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
