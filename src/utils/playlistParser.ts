import { Channel } from '../types';

export const parseM3U = (content: string): Channel[] => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const channels: Channel[] = [];
  
  let currentChannel: Partial<Channel> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      // Parse channel info
      const match = line.match(/#EXTINF:(-?\d+).*?,(.*)/);
      if (match) {
        currentChannel.name = match[2].trim();
        currentChannel.id = Math.random().toString(36).substr(2, 9);
        
        // Extract logo if present
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        if (logoMatch) {
          currentChannel.logo = logoMatch[1];
        }
        
        // Extract group if present
        const groupMatch = line.match(/group-title="([^"]+)"/);
        if (groupMatch) {
          currentChannel.group = groupMatch[1];
        }
      }
    } else if (line.startsWith('http') && currentChannel.name) {
      // This is a URL line
      currentChannel.url = line;
      channels.push(currentChannel as Channel);
      currentChannel = {};
    }
  }
  
  return channels;
};

export const generateSamplePlaylist = (): Channel[] => [
  {
    id: '1',
    name: 'Sample Stream 1',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    logo: 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    group: 'Demo'
  },
  {
    id: '2',
    name: 'Sample Stream 2',
    url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    logo: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    group: 'Demo'
  }
];