import React, { useRef } from 'react';
import { Upload, FileText, Link, Zap } from 'lucide-react';
import { Channel } from '../types';
import { parseM3U, generateSamplePlaylist } from '../utils/playlistParser';

interface PlaylistLoaderProps {
  onPlaylistLoad: (channels: Channel[]) => void;
}

export const PlaylistLoader: React.FC<PlaylistLoaderProps> = ({ onPlaylistLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const channels = parseM3U(content);
      onPlaylistLoad(channels);
    };
    reader.readAsText(file);
  };

  const handleUrlLoad = async () => {
    if (!urlInput.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(urlInput);
      const content = await response.text();
      const channels = parseM3U(content);
      onPlaylistLoad(channels);
      setUrlInput('');
    } catch (error) {
      console.error('Failed to load playlist from URL:', error);
      alert('Failed to load playlist from URL. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSamplePlaylist = () => {
    const sampleChannels = generateSamplePlaylist();
    onPlaylistLoad(sampleChannels);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Load IPTV Playlist</h2>
        <p className="text-gray-300">Choose how you'd like to load your M3U playlist</p>
      </div>

      <div className="space-y-4">
        {/* File Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-4 flex items-center justify-center space-x-3 transition-all duration-200"
        >
          <Upload className="w-5 h-5" />
          <span className="font-medium">Upload M3U File</span>
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".m3u,.m3u8"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* URL Input */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter M3U playlist URL..."
              className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleUrlLoad}
              disabled={!urlInput.trim() || isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg px-6 py-3 flex items-center space-x-2 transition-colors"
            >
              <Link className="w-4 h-4" />
              <span>{isLoading ? 'Loading...' : 'Load'}</span>
            </button>
          </div>
        </div>

        {/* Sample Playlist */}
        <button
          onClick={loadSamplePlaylist}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg p-4 flex items-center justify-center space-x-3 transition-all duration-200"
        >
          <Zap className="w-5 h-5" />
          <span className="font-medium">Try Sample Playlist</span>
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Supports M3U and M3U8 playlist formats</p>
      </div>
    </div>
  );
};