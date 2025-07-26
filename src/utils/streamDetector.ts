export interface StreamInfo {
  type: 'hls' | 'dash' | 'mp4' | 'webm' | 'rtmp' | 'webrtc' | 'unknown';
  codec?: string;
  container?: string;
  isLive: boolean;
}

export const detectStreamType = (url: string): StreamInfo => {
  const urlLower = url.toLowerCase();
  
  // HLS Detection
  if (urlLower.includes('.m3u8') || urlLower.includes('hls')) {
    return {
      type: 'hls',
      codec: 'h264',
      container: 'm3u8',
      isLive: true
    };
  }
  
  // DASH Detection
  if (urlLower.includes('.mpd') || urlLower.includes('dash')) {
    return {
      type: 'dash',
      codec: 'h264',
      container: 'mpd',
      isLive: true
    };
  }
  
  // RTMP Detection
  if (urlLower.startsWith('rtmp://') || urlLower.startsWith('rtmps://')) {
    return {
      type: 'rtmp',
      codec: 'h264',
      container: 'flv',
      isLive: true
    };
  }
  
  // WebRTC Detection
  if (urlLower.includes('webrtc') || urlLower.startsWith('wss://')) {
    return {
      type: 'webrtc',
      codec: 'vp8',
      container: 'webm',
      isLive: true
    };
  }
  
  // MP4 Detection
  if (urlLower.includes('.mp4')) {
    return {
      type: 'mp4',
      codec: 'h264',
      container: 'mp4',
      isLive: false
    };
  }
  
  // WebM Detection
  if (urlLower.includes('.webm')) {
    return {
      type: 'webm',
      codec: 'vp9',
      container: 'webm',
      isLive: false
    };
  }
  
  return {
    type: 'unknown',
    isLive: true
  };
};

export const getSupportedFormats = (): string[] => {
  const video = document.createElement('video');
  const formats: string[] = [];
  
  // Check HLS support
  if (video.canPlayType('application/vnd.apple.mpegurl') || 
      video.canPlayType('application/x-mpegURL')) {
    formats.push('HLS (m3u8)');
  }
  
  // Check MP4 support
  if (video.canPlayType('video/mp4; codecs="avc1.42E01E"')) {
    formats.push('MP4 (H.264)');
  }
  
  // Check WebM support
  if (video.canPlayType('video/webm; codecs="vp8"')) {
    formats.push('WebM (VP8)');
  }
  
  if (video.canPlayType('video/webm; codecs="vp9"')) {
    formats.push('WebM (VP9)');
  }
  
  // Check HEVC support
  if (video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"')) {
    formats.push('HEVC (H.265)');
  }
  
  // Check AV1 support
  if (video.canPlayType('video/mp4; codecs="av01.0.08M.08"')) {
    formats.push('AV1');
  }
  
  return formats;
};