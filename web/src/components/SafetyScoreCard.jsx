import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Wine, 
  AlertTriangle, 
  Cross, 
  Shield, 
  Coffee, 
  Info, 
  MapPin, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Activity
} from 'lucide-react';

export function SafetyScoreCard({ analysis, activeRoute, destination }) {
  if (!analysis) {
    return (
      <div className="glass-panel rounded-3xl p-6 shadow-glass text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-300 mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-white">SafeHer AI Sentinel</h3>
          <p className="text-xs text-slate-400 mt-1">
            Calculating real-time corridor risk analysis and AI safety scoring...
          </p>
        </div>
      </div>
    );
  }

  const { safetyScore, grade, summary, breakdown, destinationAudit } = analysis;

  const isHighSafe = safetyScore >= 85;
  const isModSafe = safetyScore >= 68 && safetyScore < 85;

  const ringColor = isHighSafe ? '#10b981' : isModSafe ? '#f59e0b' : '#f43f5e';
  const tierBg = isHighSafe
    ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-glow-emerald'
    : isModSafe
    ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
    : 'bg-rose-500/15 border-rose-400/40 text-rose-300 shadow-glow-rose';

  const tierText = isHighSafe
    ? 'Level 1: Shielded Safe Corridor'
    : isModSafe
    ? 'Level 2: Moderate Precaution'
    : 'Level 3: High Alert / Avoid at Night';

  // SVG Circular Meter math
  const strokeWidth = 7;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safetyScore / 100) * circumference;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-glass space-y-5">
      {/* Top Banner: Score Gauge & Tier Assessment */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-4">
          {/* Circular Progress Gauge */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black tracking-tight text-white">{safetyScore}%</span>
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">SCORE</span>
            </div>
          </div>

          {/* Title & Classification */}
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center justify-center sm:justify-start space-x-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>AI CORRIDOR AUDIT</span>
            </span>
            <h3 className="font-extrabold text-base text-white">
              {activeRoute ? activeRoute.name : 'Analyzed Route'}
            </h3>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-black border ${tierBg}`}>
              {isHighSafe ? <ShieldCheck className="w-3.5 h-3.5 mr-1" /> : <ShieldAlert className="w-3.5 h-3.5 mr-1" />}
              {tierText}
            </span>
          </div>
        </div>

        {/* Quick Corridor Distance & ETA */}
        {activeRoute && (
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs text-slate-400 pt-1">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400">Total Commute</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-white font-black text-sm">{activeRoute.durationMin} mins</span>
              <span>•</span>
              <span className="text-cyan-300 font-bold">{activeRoute.distanceKm} km</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Intelligence Summary Note */}
      <div className="p-3.5 rounded-2xl bg-obsidian-900/60 border border-white/[0.08] text-xs text-slate-200 flex items-start space-x-3 leading-relaxed">
        <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5" />
        </div>
        <p className="font-medium text-[11.5px] leading-relaxed">{summary}</p>
      </div>

      {/* 5 Safety Metric Breakdowns */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          CORRIDOR RISK MATRIX
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* Police & Women Cells */}
          <div className="p-3 rounded-2xl bg-obsidian-900/60 border border-white/[0.06] hover:border-white/10 flex items-center justify-between transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white block">Police & Women Desks</span>
                <span className="text-[10px] text-slate-400">{breakdown?.police?.status || 'Active response'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-white text-sm block">{breakdown?.police?.count || 0}</span>
              <span className="text-[10px] text-emerald-400 font-extrabold">{breakdown?.police?.impact}</span>
            </div>
          </div>

          {/* 24/7 Hospitals */}
          <div className="p-3 rounded-2xl bg-obsidian-900/60 border border-white/[0.06] hover:border-white/10 flex items-center justify-between transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Cross className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white block">24/7 Hospitals & Trauma</span>
                <span className="text-[10px] text-slate-400">{breakdown?.hospital?.status || 'Immediate access'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-white text-sm block">{breakdown?.hospital?.count || 0}</span>
              <span className="text-[10px] text-emerald-400 font-extrabold">{breakdown?.hospital?.impact}</span>
            </div>
          </div>

          {/* Liquor Shops & Bars */}
          <div className="p-3 rounded-2xl bg-obsidian-900/60 border border-white/[0.06] hover:border-white/10 flex items-center justify-between transition-all">
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-xl border ${
                (breakdown?.liquor?.count || 0) > 0
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                <Wine className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white block">Liquor Outlets & Bars</span>
                <span className="text-[10px] text-slate-400">{breakdown?.liquor?.status || 'Zero risk'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-white text-sm block">{breakdown?.liquor?.count || 0}</span>
              <span className={`text-[10px] font-extrabold ${
                (breakdown?.liquor?.count || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {breakdown?.liquor?.impact}
              </span>
            </div>
          </div>

          {/* Accident Blackspots */}
          <div className="p-3 rounded-2xl bg-obsidian-900/60 border border-white/[0.06] hover:border-white/10 flex items-center justify-between transition-all">
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-xl border ${
                (breakdown?.accident?.count || 0) > 0
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white block">Accident Blackspots</span>
                <span className="text-[10px] text-slate-400">{breakdown?.accident?.status || 'Safe highway'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-white text-sm block">{breakdown?.accident?.count || 0}</span>
              <span className={`text-[10px] font-extrabold ${
                (breakdown?.accident?.count || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {breakdown?.accident?.impact}
              </span>
            </div>
          </div>

          {/* Safe Public Shelters */}
          <div className="p-3 rounded-2xl bg-obsidian-900/60 border border-white/[0.06] hover:border-white/10 flex items-center justify-between sm:col-span-2 transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white block">Safe Public Shelters (Hotels & Cafes)</span>
                <span className="text-[10px] text-slate-400">{breakdown?.safeHaven?.status || 'Populated stops'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-white text-sm block">{breakdown?.safeHaven?.count || 0}</span>
              <span className="text-[10px] text-violet-400 font-extrabold">{breakdown?.safeHaven?.impact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Safety Audit Card */}
      {destinationAudit && (
        <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>DESTINATION POINT AUDIT</span>
            </div>
            <span className="text-xs font-black text-white bg-obsidian-800 px-3 py-0.5 rounded-full border border-white/10 shadow-sm">
              {destinationAudit.score}% Safe
            </span>
          </div>

          <div className="bg-obsidian-900/60 border border-white/[0.06] rounded-2xl p-3.5 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-extrabold truncate pr-2">{destinationAudit.name}</span>
              <span className="text-[10px] text-emerald-400 font-bold whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {destinationAudit.lightingRating}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-white/[0.06] text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Police: {destinationAudit.policeCount} nearby</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Cross className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Hospital: {destinationAudit.hospitalCount} nearby</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
