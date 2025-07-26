import React from 'react';
import { Play, Radio } from 'lucide-react';
import { Channel } from '../types';

interface ChannelListProps {
  channels: Channel[];
  currentChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  viewMode?: 'grid' | 'list';
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  currentChannel,
  onChannelSelect,
  viewMode = 'list',
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
    <div className="space-y-6">
        {Object.entries(groupedChannels).map(([groupName, groupChannels]) => (
          <div key={groupName}>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
              <Radio className="w-5 h-5 text-blue-400" />
              <span>{groupName}</span>
              <span className="text-gray-400 text-sm">({groupChannels.length})</span>
            </h3>
            
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : 'space-y-2'
            }>
              {groupChannels.map((channel) => (
                viewMode === 'grid' ? (
                  <button
                    key={channel.id}
                    onClick={() => onChannelSelect(channel)}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-200 hover:bg-white/20 hover:scale-105 ${
                      currentChannel?.id === channel.id
                        ? 'ring-2 ring-blue-400 bg-blue-500/20'
                        : ''
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-3 flex items-center justify-center">
                      {channel.logo ? (
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Play className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <p className="text-white font-medium text-sm truncate">
                      {channel.name}
                    </p>
                  </button>
                ) : (
                  <button
                    key={channel.id}
                    onClick={() => onChannelSelect(channel)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 hover:bg-white/10 ${
                      currentChannel?.id === channel.id
                        ? 'bg-blue-500/20 border border-blue-400/50'
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {channel.logo ? (
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">
                        {channel.name}
                      </p>
                      {channel.group && (
                        <p className="text-gray-400 text-sm">
                          {channel.group}
                        </p>
                      )}
                    </div>
                    
                    {currentChannel?.id === channel.id && (
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </button>
                )
              ))}
            </div>
          </div>
        ))}
        
        {channels.length === 0 && (
          <div className="text-center py-12">
            <Radio className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No channels found</p>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
    </div>
  );
};

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