import React from 'react';
import { 
  Shield, 
  PhoneCall, 
  Share2, 
  AlertTriangle, 
  Moon, 
  Sun, 
  Radio,
  Compass,
  Sparkles,
  Signal
} from 'lucide-react';

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
    <header className="bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/90 sticky top-0 z-40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Live Beacon */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-pink-600 to-rose-600 shadow-lg shadow-pink-500/25 text-white">
            <Shield className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-pink-200 bg-clip-text text-transparent">
                SafeHer <span className="text-pink-500">AI</span>
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tracking-wider">
                Sentinel 2.0
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              Intelligent Women's Multi-Stop Safety Navigation
            </p>
          </div>
        </div>

        {/* Center: Live Protection Status */}
        <div className="hidden lg:flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 text-xs shadow-inner">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-medium">Corridor Watch:</span>
          <span className="text-emerald-400 font-bold">Patrolled & Monitored</span>
          {activeRoute && (
            <span className="text-slate-400 border-l border-slate-700/80 pl-2.5">
              ETA: <strong className="text-white">{activeRoute.durationMin} mins</strong> ({activeRoute.distanceKm} km)
            </span>
          )}
        </div>

        {/* Action Controls & Emergency SOS */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Night Watch / Day Mode Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            title={isNightMode ? 'Night Watch Active (High Scrutiny)' : 'Day Commute Active'}
            className={`px-3 py-1.5 rounded-xl transition border text-xs font-bold flex items-center space-x-1.5 ${
              isNightMode
                ? 'bg-indigo-950/70 border-indigo-500/50 text-indigo-200 hover:bg-indigo-900/80 shadow-sm shadow-indigo-500/20'
                : 'bg-amber-950/50 border-amber-500/40 text-amber-200 hover:bg-amber-900/60 shadow-sm'
            }`}
          >
            {isNightMode ? <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" /> : <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />}
            <span className="hidden sm:inline">
              {isNightMode ? 'Night Watch' : 'Day Commute'}
            </span>
          </button>

          {/* Nearest Safe Haven Button */}
          <button
            onClick={onOpenSafeHaven}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm hover:border-cyan-500/50"
            title="Locate closest Police station or Hospital"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Nearest Haven</span>
          </button>

          {/* Share Live Trip Button */}
          <button
            onClick={onOpenShare}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-purple-300 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm hover:border-purple-500/50"
            title="Share live tracking coordinates"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Share Trip</span>
          </button>

          {/* Women Helpline Directory Hub */}
          <button
            onClick={onOpenHelpline}
            className="px-3 py-1.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/40 text-pink-200 text-xs font-extrabold flex items-center space-x-1.5 transition shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Helpline Hub</span>
            <span className="sm:hidden">112/1091</span>
          </button>

          {/* SOS Primary Button */}
          <button
            onClick={onOpenSos}
            className="radar-sos relative px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-xl shadow-red-600/40 transition transform active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
