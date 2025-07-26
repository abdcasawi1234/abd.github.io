import React from 'react';
import { Tv, Play, Film, Clock, Download, Grid, Settings, Bell, User, ShoppingCart } from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: '2-digit' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Tv className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">IPTV</h1>
            <span className="text-purple-400 font-semibold">SMARTERS</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{currentTime}</div>
            <div className="text-sm text-gray-300">{currentDate}</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-xs font-bold">
                REC
              </div>
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Live TV Card */}
          <div 
            onClick={() => onNavigate('live-tv')}
            className="bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 rounded-2xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 row-span-2"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Tv className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">LIVE TV</h2>
            </div>
          </div>

          {/* Movies Card */}
          <div 
            onClick={() => onNavigate('movies')}
            className="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">MOVIES</h2>
            </div>
          </div>

          {/* Series Card */}
          <div 
            onClick={() => onNavigate('series')}
            className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">SERIES</h2>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => onNavigate('install-epg')}
            className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-green-500/25"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">INSTALL EPG</h3>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('multi-screen')}
            className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-green-500/25"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">MULTI-SCREEN</h3>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('catch-up')}
            className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-green-500/25"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">CATCH UP</h3>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300">Expiration :</span>
            <span className="font-semibold">Unlimited</span>
          </div>

          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-gray-300" />
            <span className="font-semibold">Purchase Ads Free Version</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-300">Logged in :</span>
            <span className="font-semibold">pallu</span>
          </div>
        </div>
      </div>
    </div>
  );
};