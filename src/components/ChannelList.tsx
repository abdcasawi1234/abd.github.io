import React from 'react';
import { Play, Radio } from 'lucide-react';
import { Channel } from '../types';

interface ChannelListProps {
  channels: Channel[];
  currentChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  currentChannel,
  onChannelSelect,
}) => {
  const groupedChannels = channels.reduce((groups, channel) => {
    const group = channel.group || 'Ungrouped';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(channel);
    return groups;
  }, {} as Record<string, Channel[]>);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 h-full overflow-hidden">
      <div className="flex items-center space-x-2 mb-4">
        <Radio className="w-5 h-5 text-blue-400" />
        <h2 className="text-white font-semibold">Channels ({channels.length})</h2>
      </div>
      
      <div className="space-y-4 overflow-y-auto h-full pb-20">
        {Object.entries(groupedChannels).map(([groupName, groupChannels]) => (
          <div key={groupName}>
            <h3 className="text-gray-300 text-sm font-medium mb-2 px-2">
              {groupName}
            </h3>
            
            <div className="space-y-1">
              {groupChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${
                    currentChannel?.id === channel.id
                      ? 'bg-blue-500/20 border border-blue-400/50'
                      : 'bg-black/20'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium truncate">
                      {channel.name}
                    </p>
                    {channel.group && (
                      <p className="text-gray-400 text-xs truncate">
                        {channel.group}
                      </p>
                    )}
                  </div>
                  
                  {currentChannel?.id === channel.id && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {channels.length === 0 && (
          <div className="text-center py-8">
            <Radio className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No channels loaded</p>
            <p className="text-gray-500 text-sm">Load a playlist to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};