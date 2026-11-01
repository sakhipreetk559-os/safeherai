import React from 'react';
import { Shield, PhoneCall, Share2, AlertTriangle, Moon, Sun, Radio } from 'lucide-react';

export function Navbar({
  onOpenSos,
  onOpenHelpline,
  onOpenShare,
  onOpenSafeHaven,
  isNightMode,
  setIsNightMode,
  activeRoute
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Live Beacon */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 shadow-lg shadow-pink-500/20 text-white">
            <Shield className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-pink-100 to-pink-300 bg-clip-text text-transparent">
                SafeHer <span className="text-pink-500">AI</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Guardian 2.0
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-400">
              Real-time Women's Safety & Intelligent Route Navigation
            </p>
          </div>
        </div>

        {/* Center: Live Protection Status */}
        <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">OSM Corridor Sentinel:</span>
          <span className="text-emerald-400 font-semibold">Active & Patrolled</span>
          {activeRoute && (
            <span className="text-slate-400 border-l border-slate-700 pl-2">
              ETA: <span className="text-white font-semibold">{activeRoute.durationMin} mins</span> ({activeRoute.distanceKm} km)
            </span>
          )}
        </div>

        {/* Action Controls & Emergency SOS */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Night Mode Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            title={isNightMode ? 'Night Protocol Active' : 'Day Mode Active'}
            className={`p-2 rounded-xl transition border text-xs flex items-center space-x-1.5 ${
              isNightMode
                ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
            }`}
          >
            {isNightMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="hidden md:inline font-medium">
              {isNightMode ? 'Night Watch' : 'Day Commute'}
            </span>
          </button>

          {/* Nearest Safe Haven Button */}
          <button
            onClick={onOpenSafeHaven}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Locate closest Police station or Hospital"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Nearest Haven</span>
          </button>

          {/* Share Live Trip Button */}
          <button
            onClick={onOpenShare}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Share live tracking coordinates"
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Share Trip</span>
          </button>

          {/* Women Helpline Directory Hub */}
          <button
            onClick={onOpenHelpline}
            className="px-3 py-2 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/30 text-pink-300 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
            <span>1091 / 112 Hub</span>
          </button>

          {/* SOS Floating / Primary Button */}
          <button
            onClick={onOpenSos}
            className="relative group px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-red-600/30 transition transform active:scale-95 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
