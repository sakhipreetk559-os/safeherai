import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Shield, 
  Cross, 
  Coffee, 
  Navigation, 
  PhoneCall, 
  ArrowRight,
  Clock,
  Compass
} from 'lucide-react';

export function SafeHavenDrawer({ isOpen, onClose, haven, onNavigate }) {
  if (!isOpen || !haven) return null;

  const isPolice = haven.category === 'police';
  const isHospital = haven.category === 'hospital';

  const badgeBg = isPolice
    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    : isHospital
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    : 'bg-purple-500/20 text-purple-300 border-purple-500/40';

  const drawerNode = (
    <div className="fixed inset-x-0 bottom-4 z-[99990] p-4 max-w-lg mx-auto animate-in slide-in-from-bottom duration-300 pointer-events-auto">
      <div 
        className="bg-slate-900/95 border-2 border-cyan-500/90 rounded-3xl shadow-2xl p-5 space-y-4 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              Immediate Safe Haven Guidance
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-cyan-400 flex-shrink-0">
            {isPolice ? <Shield className="w-6 h-6 text-blue-400" /> : isHospital ? <Cross className="w-6 h-6 text-emerald-400" /> : <Coffee className="w-6 h-6 text-purple-400" />}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badgeBg}`}>
                {isPolice ? 'Police Station' : isHospital ? '24/7 Hospital' : 'Safe Rest Stop'}
              </span>
              <span className="text-[11px] font-bold text-cyan-300">
                {haven.distanceMeters}m away
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-white leading-tight">
              {haven.title}
            </h4>
            <div className="flex items-center space-x-2 text-xs text-slate-300 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Est. {haven.walkingTimeMin} min walking / 2 min drive</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => {
              if (onNavigate) onNavigate(haven);
              onClose();
            }}
            className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-cyan-500/20"
          >
            <Compass className="w-4 h-4" />
            <span>Guide to Haven</span>
          </button>

          <a
            href={isPolice ? 'tel:100' : 'tel:108'}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <PhoneCall className="w-4 h-4 text-pink-400" />
            <span>{isPolice ? 'Call Police PCR' : 'Call Ambulance'}</span>
          </a>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(drawerNode, document.body) : null;
}
