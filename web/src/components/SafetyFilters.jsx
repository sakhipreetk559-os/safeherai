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
      activeBorder: 'border-amber-500/50 bg-amber-950/20 text-amber-300'
    },
    {
      key: 'prioritizePoliceHospital',
      title: 'Prioritize Police & Hospital Corridors',
      desc: 'Maximizes proximity to 24/7 Women Cells & Trauma Centers',
      icon: ShieldCheck,
      color: 'blue',
      activeBorder: 'border-blue-500/50 bg-blue-950/20 text-blue-300'
    },
    {
      key: 'lowAccidentRisk',
      title: 'Low Road Accident Risk Only',
      desc: 'Eliminates sharp blind curves, heavy merging highways & unlit stretches',
      icon: AlertTriangle,
      color: 'rose',
      activeBorder: 'border-rose-500/50 bg-rose-950/20 text-rose-300'
    },
    {
      key: 'showSafeStopovers',
      title: 'Show Safe Stopovers (Hotels & Cafes)',
      desc: 'Highlights populated 24/7 rest points, petrol pumps & lit cafes',
      icon: Coffee,
      color: 'purple',
      activeBorder: 'border-purple-500/50 bg-purple-950/20 text-purple-300'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-pink-400" />
          <h3 className="font-bold text-sm text-slate-100">Smart Safety Filters</h3>
        </div>
        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          Dynamic Recalculation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filterList.map(item => {
          const isActive = filters[item.key];
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => onToggleFilter(item.key)}
              className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 select-none ${
                isActive
                  ? item.activeBorder
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              {/* Custom Switch / Checkbox */}
              <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition border ${
                isActive
                  ? 'bg-pink-500 border-pink-400 text-white shadow-sm shadow-pink-500/50'
                  : 'bg-slate-800 border-slate-600'
              }`}>
                {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-1.5">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <h4 className="font-bold text-xs text-slate-100">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
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
