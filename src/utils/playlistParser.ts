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
    id: '0',
    name: 'Live Stream',
    url: 'https://td3wb1bchdvsahp.ngolpdkyoctjcddxshli469r.org/sunshine/xRyrVSyJi6hnr4jBjkU7FhWULb063F_FFxY4mK4PgjsN9s99HISeGwjjrWjxiSAk44ejaarMfe6YW_4_3okS5AxnoFhtPbgY6jooNz9VJ788jfNL44CL_qSWvm9mn8Qf7xw4FR0ST0MCw7_gsQSH2OPiThfjNqbl4n6GzL39LjKRbNNAD1Wx0bE5kCTj8YmtM7o9cQ0CrA7M_sKi4nkA0Wg_jF1pglSqRAOssemJuKE/hls/index.m3u8',
    logo: 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    group: 'Live Channels'
  },
  {
    id: '1',
    name: 'Sample HLS Stream',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    logo: 'https://images.pexels.com/photos/1174952/pexels-photo-1174952.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    group: 'HLS Streams'
  },
  {
    id: '2',
    name: 'Sample Live Stream',
    url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    logo: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    group: 'HLS Streams'
  },
  {
    id: '3',
    name: 'Big Buck Bunny (MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    logo: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    group: 'MP4 Streams'
  },
  {
    id: '4',
    name: 'Sintel (WebM)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/b/b3/Big_Buck_Bunny_Trailer_400p.ogv/Big_Buck_Bunny_Trailer_400p.ogv.360p.webm',
    logo: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    group: 'WebM Streams'
  }
];