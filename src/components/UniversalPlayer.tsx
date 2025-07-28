import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Info, ArrowLeft, AlertCircle } from 'lucide-react';
import { Channel, PlayerState } from '../types';
import { detectStreamType, getSupportedFormats } from '../utils/streamDetector';

interface UniversalPlayerProps {
  channel: Channel | null;
  onStateChange: (state: Partial<PlayerState>) => void;
  playerState: PlayerState;
  onBack?: () => void;
}

export const UniversalPlayer: React.FC<UniversalPlayerProps> = ({ 
  channel, 
  onStateChange, 
  playerState,
  onBack
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const dashPlayerRef = useRef<any>(null);
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [qualities, setQualities] = useState<string[]>([]);
  const [streamInfo, setStreamInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [supportedFormats] = useState<string[]>(getSupportedFormats());

  useEffect(() => {
    if (!channel || !videoRef.current) return;

    const video = videoRef.current;
    setError(null);
    
    // Clean up previous players
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    if (dashPlayerRef.current) {
      dashPlayerRef.current.destroy();
      dashPlayerRef.current = null;
    }

    const streamType = detectStreamType(channel.url);
    setStreamInfo(streamType);

    const setupPlayer = async () => {
      try {
        switch (streamType.type) {
          case 'hls':
            await setupHLSPlayer(video, channel.url);
            break;
          case 'dash':
            await setupDASHPlayer(video, channel.url);
            break;
          case 'mp4':
          case 'webm':
            setupNativePlayer(video, channel.url);
            break;
          case 'rtmp':
            setError('RTMP streams require Flash player which is no longer supported. Please use HLS or DASH streams.');
            break;
          case 'webrtc':
            setError('WebRTC streams are not yet supported in this player.');
            break;
          default:
            // Try native playback as fallback
            setupNativePlayer(video, channel.url);
        }
      } catch (err) {
        console.error('Player setup error:', err);
        setError(`Failed to load stream: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    setupPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (dashPlayerRef.current) {
        dashPlayerRef.current.destroy();
      }
    };
  }, [channel]);

  const setupHLSPlayer = async (video: HTMLVideoElement, url: string) => {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
      });
      
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels.map((level, index) => 
          `${level.height}p (${Math.round(level.bitrate / 1000)} kbps)`
        );
        setQualities(levels);
        video.play().catch(console.error);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error occurred while loading the stream');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error occurred, attempting recovery');
              hls.recoverMediaError();
              break;
            default:
              setError('Fatal error occurred, cannot recover');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = url;
      video.play().catch(console.error);
    } else {
      throw new Error('HLS is not supported in this browser');
    }
  };

  const setupDASHPlayer = async (video: HTMLVideoElement, url: string) => {
    try {
      // Dynamic import for DASH player
      const dashjs = await import('dashjs');
      const player = dashjs.MediaPlayer().create();
      dashPlayerRef.current = player;
      
      player.initialize(video, url, true);
      player.updateSettings({
        streaming: {
          lowLatencyEnabled: true,
          liveDelay: 3,
        }
      });

      player.on('streamInitialized', () => {
        const bitrates = player.getBitrateInfoListFor('video');
        const levels = bitrates.map((bitrate: any) => 
          `${bitrate.height}p (${Math.round(bitrate.bitrate / 1000)} kbps)`
        );
        setQualities(levels);
      });

      player.on('error', (e: any) => {
        console.error('DASH Error:', e);
        setError('DASH playback error occurred');
      });
    } catch (err) {
      throw new Error('DASH player failed to initialize');
    }
  };

  const setupNativePlayer = (video: HTMLVideoElement, url: string) => {
    video.src = url;
    video.load();
    
    video.addEventListener('loadedmetadata', () => {
      video.play().catch(console.error);
    });
    
    video.addEventListener('error', (e) => {
      setError('Failed to load video stream');
    });
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (playerState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMuted = !playerState.isMuted;
    videoRef.current.muted = newMuted;
    onStateChange({ isMuted: newMuted });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const volume = parseFloat(e.target.value);
    videoRef.current.volume = volume;
    onStateChange({ volume, isMuted: volume === 0 });
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      onStateChange({ isFullscreen: true });
    } else {
      document.exitFullscreen();
      onStateChange({ isFullscreen: false });
    }
  };

  return (
    <div 
      className="relative bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onPlay={() => onStateChange({ isPlaying: true })}
        onPause={() => onStateChange({ isPlaying: false })}
        onTimeUpdate={(e) => {
          const video = e.target as HTMLVideoElement;
          onStateChange({ 
            currentTime: video.currentTime,
            duration: video.duration || 0 
          });
        }}
        onVolumeChange={(e) => {
          const video = e.target as HTMLVideoElement;
          onStateChange({ 
            volume: video.volume,
            isMuted: video.muted 
          });
        }}
        crossOrigin="anonymous"
        playsInline
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/80 to-red-800/80 backdrop-blur-sm">
          <div className="text-center text-white p-8 max-w-md">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Playback Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {!channel && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="text-center text-white">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8" />
            </div>
            <p className="text-xl font-semibold mb-2">No Channel Selected</p>
            <p className="text-gray-400 mb-4">Choose a channel from the playlist to start watching</p>
            <div className="text-sm text-gray-500">
              <p className="mb-2">Supported formats:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {supportedFormats.map((format, index) => (
                  <span key={index} className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${showControls || !playerState.isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Top Info Bar */}
        {channel && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex items-center space-x-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-black/70 transition-colors"
                  title="Back to channels"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                <h3 className="text-white font-semibold">{channel.name}</h3>
                {channel.group && (
                  <p className="text-gray-300 text-sm">{channel.group}</p>
                )}
                {streamInfo && (
                  <p className="text-blue-400 text-xs">
                    {streamInfo.type.toUpperCase()} • {streamInfo.codec?.toUpperCase()}
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-black/70 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stream Info Panel */}
        {showInfo && channel && (
          <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white min-w-64">
            <h4 className="font-semibold mb-2">Stream Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Status:</span>
                <span className={playerState.isPlaying ? 'text-green-400' : 'text-red-400'}>
                  {playerState.isPlaying ? 'Live' : 'Stopped'}
                </span>
              </div>
              {streamInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Format:</span>
                    <span>{streamInfo.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Codec:</span>
                    <span>{streamInfo.codec?.toUpperCase() || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Container:</span>
                    <span>{streamInfo.container?.toUpperCase() || 'Unknown'}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-300">Quality:</span>
                <span>{playerState.quality || 'Auto'}</span>
              </div>
              {qualities.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Available:</span>
                  <span>{qualities.length} qualities</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-colors"
                  disabled={!channel || !!error}
                >
                  {playerState.isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {playerState.isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={playerState.isMuted ? 0 : playerState.volume}
                    onChange={handleVolumeChange}
                    className="w-24 accent-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {qualities.length > 0 && (
                  <button className="text-white hover:text-gray-300 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                )}
                
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};