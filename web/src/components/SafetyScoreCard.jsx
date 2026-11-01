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
  TrendingUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function SafetyScoreCard({ analysis, activeRoute, destination }) {
  if (!analysis) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 shadow-2xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-slate-100">SafeHer AI Safety Sentinel</h3>
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

  const ringColor = isHighSafe ? '#10b981' : isModSafe ? '#f59e0b' : '#ef4444';
  const tierBg = isHighSafe
    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
    : isModSafe
    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
    : 'bg-rose-500/15 border-rose-500/40 text-rose-300';

  const tierText = isHighSafe
    ? 'Level 1: Shielded Safe Corridor'
    : isModSafe
    ? 'Level 2: Moderate Precaution'
    : 'Level 3: High Alert / Avoid at Night';

  // SVG Circular Meter math
  const strokeWidth = 7;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safetyScore / 100) * circumference;

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Banner: Score Gauge & Tier */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-4">
          {/* Circular Progress Meter */}
          <div className="relative w-22 h-22 flex items-center justify-center flex-shrink-0">
            <svg className="w-22 h-22 transform -rotate-90">
              <circle
                cx="44"
                cy="44"
                r={radius}
                stroke="#1e293b"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="44"
                cy="44"
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
              <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">Score</span>
            </div>
          </div>

          {/* Title & Badge */}
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-400">
              SafeHer AI Sentinel Rating
            </span>
            <h3 className="font-black text-base text-white">
              {activeRoute ? activeRoute.name : 'Analyzed Route'}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${tierBg}`}>
              {isHighSafe ? <ShieldCheck className="w-3.5 h-3.5 mr-1" /> : <ShieldAlert className="w-3.5 h-3.5 mr-1" />}
              {tierText}
            </span>
          </div>
        </div>

        {/* Quick Corridor Distance & ETA */}
        {activeRoute && (
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs text-slate-400 pt-1">
            <span className="font-semibold text-[11px] text-slate-400">Route Analytics</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-white font-black text-sm">{activeRoute.durationMin} mins</span>
              <span>•</span>
              <span className="text-slate-300 font-bold">{activeRoute.distanceKm} km</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Summary Note */}
      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 flex items-start space-x-2.5 leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p>{summary}</p>
      </div>

      {/* 5 Safety Metric Breakdowns */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          Corridor Risk Breakdown
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Police & Women Cells */}
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block">Police & Women Desks</span>
                <span className="text-[10px] text-slate-400">{breakdown?.police?.status || 'Coverage active'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-white text-sm block">{breakdown?.police?.count || 0}</span>
              <span className="text-[10px] text-emerald-400 font-extrabold">{breakdown?.police?.impact}</span>
            </div>
          </div>

          {/* 24/7 Hospitals */}
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cross className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block">24/7 Emergency Hospitals</span>
                <span className="text-[10px] text-slate-400">{breakdown?.hospital?.status || 'Available'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-white text-sm block">{breakdown?.hospital?.count || 0}</span>
              <span className="text-[10px] text-emerald-400 font-extrabold">{breakdown?.hospital?.impact}</span>
            </div>
          </div>

          {/* Liquor Shops & Bars */}
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg border ${
                (breakdown?.liquor?.count || 0) > 0
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                <Wine className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block">Liquor Outlets & Bars</span>
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
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg border ${
                (breakdown?.accident?.count || 0) > 0
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block">Accident Blackspots</span>
                <span className="text-[10px] text-slate-400">{breakdown?.accident?.status || 'Low risk'}</span>
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
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/70 flex items-center justify-between sm:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block">Safe Public Shelters (Hotels & Cafes)</span>
                <span className="text-[10px] text-slate-400">{breakdown?.safeHaven?.status || 'Populated shelter'}</span>
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
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-pink-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Destination Area Audit</span>
            </div>
            <span className="text-xs font-black text-white bg-slate-800/90 px-2.5 py-0.5 rounded-full border border-slate-700">
              {destinationAudit.score}% Safe
            </span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-100 font-bold truncate pr-2">{destinationAudit.name}</span>
              <span className="text-[10px] text-emerald-400 font-bold whitespace-nowrap">{destinationAudit.lightingRating}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-700/40 text-slate-300">
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
