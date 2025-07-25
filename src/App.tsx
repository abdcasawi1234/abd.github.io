import React, { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { ChannelList } from './components/ChannelList';
import { PlaylistLoader } from './components/PlaylistLoader';
import { Channel, PlayerState } from './types';
import { Tv, Settings, Menu, X } from 'lucide-react';

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentChannel: null,
    isPlaying: false,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    currentTime: 0,
    duration: 0,
    quality: 'Auto',
  });

  const handlePlaylistLoad = (loadedChannels: Channel[]) => {
    setChannels(loadedChannels);
    if (loadedChannels.length > 0) {
      setCurrentChannel(loadedChannels[0]);
    }
  };

  const handleChannelSelect = (channel: Channel) => {
    setCurrentChannel(channel);
    setPlayerState(prev => ({ ...prev, currentChannel: channel }));
  };

  const handlePlayerStateChange = (newState: Partial<PlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...newState }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IPTV Player</h1>
                <p className="text-xs text-gray-400">Live Streaming Player</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-300">
                {currentChannel && (
                  <>
                    <span className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${playerState.isPlaying ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span>{playerState.isPlaying ? 'Live' : 'Stopped'}</span>
                    </span>
                    <span>{channels.length} channels</span>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden bg-white/10 hover:bg-white/20 rounded-lg p-2 text-white transition-colors"
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Video Player */}
        <div className="flex-1 p-4">
          <div className="h-full">
            <VideoPlayer
              channel={currentChannel}
              onStateChange={handlePlayerStateChange}
              playerState={playerState}
              onBack={() => setShowSidebar(true)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className={`w-80 bg-black/20 backdrop-blur-sm border-l border-white/10 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
          <div className="h-full p-4">
            {channels.length > 0 ? (
              <ChannelList
                channels={channels}
                currentChannel={currentChannel}
                onChannelSelect={handleChannelSelect}
              />
            ) : (
              <PlaylistLoader onPlaylistLoad={handlePlaylistLoad} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}

export default App;