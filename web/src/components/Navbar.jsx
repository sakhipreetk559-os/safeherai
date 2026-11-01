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
  Zap
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
    <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 border-b border-white/[0.07] bg-obsidian-950/80 backdrop-blur-2xl shadow-glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Live Beacon */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-obsidian-950 rounded-[15px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-300 stroke-[2.5]" />
            </div>
            {/* Live radar beacon */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-obsidian-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center">
                SafeHer<span className="text-cyan-400 ml-1 font-black">AI</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                PRO SENTINEL
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              Intelligent Women's Safety Navigation & Risk Corridors
            </p>
          </div>
        </div>

        {/* Center: Live Sentinel Status */}
        <div className="hidden lg:flex items-center space-x-3 px-4 py-1.5 rounded-full bg-obsidian-900/90 border border-white/[0.08] shadow-inner text-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 font-medium">Corridor Watch:</span>
          <span className="text-emerald-400 font-bold tracking-wide">ACTIVE & MONITORED</span>
          {activeRoute && (
            <span className="text-slate-400 border-l border-white/10 pl-3">
              ETA: <strong className="text-white font-bold">{activeRoute.durationMin} mins</strong> ({activeRoute.distanceKm} km)
            </span>
          )}
        </div>

        {/* Action Controls & Emergency SOS */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Day Commute / Night Watch Segmented Switch */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            title={isNightMode ? 'Night Watch Protocol (High Scrutiny)' : 'Day Commute Protocol'}
            className={`px-3 py-1.5 rounded-xl transition-all border text-xs font-bold flex items-center space-x-2 ${
              isNightMode
                ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200 shadow-glow-cyan'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-200 hover:bg-amber-900/50'
            }`}
          >
            {isNightMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
                <span className="hidden sm:inline">Night Watch</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span className="hidden sm:inline">Day Commute</span>
              </>
            )}
          </button>

          {/* Nearest Safe Haven Button */}
          <button
            onClick={onOpenSafeHaven}
            className="px-3 py-1.5 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-800 border border-white/[0.08] text-cyan-300 text-xs font-bold flex items-center space-x-1.5 transition-all hover:border-cyan-500/40 hover:shadow-glow-cyan"
            title="Locate closest Police station or Hospital"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Nearest Haven</span>
          </button>

          {/* Share Live Trip Button */}
          <button
            onClick={onOpenShare}
            className="px-3 py-1.5 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-800 border border-white/[0.08] text-violet-300 text-xs font-bold flex items-center space-x-1.5 transition-all hover:border-violet-500/40"
            title="Share live tracking coordinates"
          >
            <Share2 className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Share Trip</span>
          </button>

          {/* Women Helpline Directory Hub */}
          <button
            onClick={onOpenHelpline}
            className="px-3 py-1.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 text-pink-300 text-xs font-extrabold flex items-center space-x-1.5 transition-all hover:border-pink-500/60"
          >
            <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Helpline Hub</span>
            <span className="sm:hidden">112/1091</span>
          </button>

          {/* SOS Floating Command Button */}
          <button
            onClick={onOpenSos}
            className="radar-sos relative px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-glow-rose transition-all transform active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
