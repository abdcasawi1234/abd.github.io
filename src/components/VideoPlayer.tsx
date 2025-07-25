import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Info, ArrowLeft } from 'lucide-react';
import { Channel, PlayerState } from '../types';

interface VideoPlayerProps {
  channel: Channel | null;
  onStateChange: (state: Partial<PlayerState>) => void;
  playerState: PlayerState;
  onBack?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  channel, 
  onStateChange, 
  playerState,
  onBack
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [qualities, setQualities] = useState<string[]>([]);

  useEffect(() => {
    if (!channel || !videoRef.current) return;

    const video = videoRef.current;
    
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hlsRef.current = hls;
      hls.loadSource(channel.url);
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
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url;
      video.play().catch(console.error);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel]);

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
      />
      
      {!channel && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="text-center text-white">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8" />
            </div>
            <p className="text-xl font-semibold mb-2">No Channel Selected</p>
            <p className="text-gray-400">Choose a channel from the playlist to start watching</p>
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
                  disabled={!channel}
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