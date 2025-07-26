import React, { useState } from 'react';
import { ArrowLeft, Search, Grid, List } from 'lucide-react';
import { UniversalPlayer } from './UniversalPlayer';
import { ChannelList } from './ChannelList';
import { PlaylistLoader } from './PlaylistLoader';
import { Channel, PlayerState } from '../types';

interface LiveTVProps {
  onBack: () => void;
}

export const LiveTV: React.FC<LiveTVProps> = ({ onBack }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showPlayer, setShowPlayer] = useState(false);
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
  };

  const handleChannelSelect = (channel: Channel) => {
    setCurrentChannel(channel);
    setPlayerState(prev => ({ ...prev, currentChannel: channel }));
    setShowPlayer(true);
  };

  const handlePlayerStateChange = (newState: Partial<PlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...newState }));
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (channel.group && channel.group.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (showPlayer && currentChannel) {
    return (
      <div className="min-h-screen bg-black">
        <UniversalPlayer
          channel={currentChannel}
          onStateChange={handlePlayerStateChange}
          playerState={playerState}
          onBack={() => setShowPlayer(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="bg-white/10 hover:bg-white/20 rounded-lg p-2 text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-white">Live TV</h1>
              {channels.length > 0 && (
                <span className="text-sm text-gray-300">({channels.length} channels)</span>
              )}
            </div>
            
            {channels.length > 0 && (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/30 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none w-64"
                  />
                </div>
                
                <div className="flex bg-black/30 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {channels.length > 0 ? (
          <ChannelList
            channels={filteredChannels}
            currentChannel={currentChannel}
            onChannelSelect={handleChannelSelect}
            viewMode={viewMode}
          />
        ) : (
          <div className="max-w-md mx-auto">
            <PlaylistLoader onPlaylistLoad={handlePlaylistLoad} />
          </div>
        )}
      </div>
    </div>
  );
};