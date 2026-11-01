import React from 'react';
import { 
  Sliders, 
  Wine, 
  ShieldCheck, 
  AlertTriangle, 
  Coffee, 
  Sparkles,
  Check
} from 'lucide-react';

export function SafetyFilters({ filters, onToggleFilter }) {
  const filterList = [
    {
      key: 'avoidLiquor',
      title: 'Strictly Avoid Liquor Shops',
      desc: 'Bypasses alcohol vends, bars & unregulated drinking clusters',
      icon: Wine,
      color: 'amber',
      activeBorder: 'border-amber-400/50 bg-amber-950/20 text-amber-300 shadow-sm'
    },
    {
      key: 'prioritizePoliceHospital',
      title: 'Prioritize Police & Hospital Corridors',
      desc: 'Maximizes proximity to 24/7 Women Desks & Emergency Trauma Centers',
      icon: ShieldCheck,
      color: 'blue',
      activeBorder: 'border-blue-400/50 bg-blue-950/20 text-blue-300 shadow-sm'
    },
    {
      key: 'lowAccidentRisk',
      title: 'Low Road Accident Risk Only',
      desc: 'Avoids blind curves, highway conflict zones & unlit stretches',
      icon: AlertTriangle,
      color: 'rose',
      activeBorder: 'border-rose-400/50 bg-rose-950/20 text-rose-300 shadow-sm'
    },
    {
      key: 'showSafeStopovers',
      title: 'Show Safe Stopovers (Hotels & Cafes)',
      desc: 'Highlights populated 24/7 rest points, petrol pumps & lit cafes',
      icon: Coffee,
      color: 'purple',
      activeBorder: 'border-violet-400/50 bg-violet-950/20 text-violet-300 shadow-sm'
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-glass space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-wide">Smart Safety Parameters</h3>
            <p className="text-[11px] text-slate-400">Dynamic route re-ranking & corridor reweighting</p>
          </div>
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          REAL-TIME
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filterList.map(item => {
          const isActive = filters[item.key];
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => onToggleFilter(item.key)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 select-none ${
                isActive
                  ? item.activeBorder
                  : 'bg-obsidian-900/40 border-white/[0.06] hover:border-white/20 hover:bg-obsidian-800/50 text-slate-300'
              }`}
            >
              {/* Custom Switch / Checkbox */}
              <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all border ${
                isActive
                  ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 border-cyan-300 text-white shadow-glow-cyan'
                  : 'bg-obsidian-800 border-white/20'
              }`}>
                {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-1.5">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <h4 className="font-extrabold text-xs text-white leading-tight">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
