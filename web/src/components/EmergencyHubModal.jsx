import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  PhoneCall, 
  Copy, 
  Check, 
  Shield, 
  AlertOctagon, 
  HeartHandshake, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { VERIFIED_HELPLINES, SAFETY_TIPS } from '../data/helplines';

export function EmergencyHubModal({ isOpen, onClose }) {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (id, number) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const modalNode = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-[1000000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Women's Safety & Helpline Hub</h2>
              <p className="text-xs text-slate-400">Verified official 24x7 emergency response services</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top SOS banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/50 via-rose-900/30 to-slate-900 border border-red-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertOctagon className="w-6 h-6 text-red-400 flex-shrink-0 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm text-red-200">Immediate Life Threat or Harassment?</h4>
                <p className="text-xs text-red-300/80">Call 112 or 1091 directly for high-priority dispatch.</p>
              </div>
            </div>
            <a
              href="tel:112"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-red-600/30 transition flex-shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 112</span>
            </a>
          </div>

          {/* Helpline Cards Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified 24/7 National Directories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {VERIFIED_HELPLINES.map(line => {
                const isCopied = copiedId === line.id;

                return (
                  <div
                    key={line.id}
                    className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300">
                          {line.badge}
                        </span>
                        <span className="font-black text-lg tracking-tight text-white font-mono">
                          {line.number}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-100 mt-1">{line.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {line.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-700/50">
                      <a
                        href={`tel:${line.number}`}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call {line.number}</span>
                      </a>

                      <button
                        onClick={() => handleCopy(line.id, line.number)}
                        className="py-1.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition"
                        title="Copy phone number"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Protocols / Tips */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-pink-400">
              <BookOpen className="w-4 h-4" />
              <span>Safety Advice & Rights Protocol</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
              {SAFETY_TIPS.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>SafeHer AI Shield System</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
}
