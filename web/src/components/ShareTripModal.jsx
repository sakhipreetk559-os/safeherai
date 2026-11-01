import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  Navigation,
  ExternalLink
} from 'lucide-react';

export function ShareTripModal({ isOpen, onClose, startPoint, destination, activeRoute, safetyScore }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const tripId = `TR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const originStr = startPoint?.name || 'Origin Point';
  const destStr = destination?.name || 'Destination Point';
  const etaMins = activeRoute?.durationMin || 24;
  const score = safetyScore || 94;

  // Live tracking URL
  const trackingUrl = `https://safeher.ai/track/${tripId}?lat=${startPoint?.lat || 28.6315}&lng=${startPoint?.lng || 77.2167}`;

  const messageText = `🛡️ SafeHer AI Live Journey Tracking:
Origin: ${originStr}
Destination: ${destStr}
ETA: ${etaMins} mins
SafeHer Safety Score: ${score}% (${score >= 85 ? 'Level 1: Shielded Corridor' : 'Standard Precautions'})
Track my live location & route: ${trackingUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[100000]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Share Live Journey</h3>
              <p className="text-xs text-slate-400">Keep family and trusted guardians informed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Trip Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Corridor Token: {tripId}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                {score}% Safe
              </span>
            </div>

            <div className="space-y-1 text-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span className="truncate font-medium">{originStr}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                <span className="truncate font-medium">{destStr}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-400 pt-1 border-t border-slate-700/50">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                <strong className="text-white">ETA {etaMins} mins</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Active Sentinel Protected</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share Live Route on WhatsApp</span>
            </a>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-pink-400" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Live Tracking Link'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Your trusted contact will see your real-time path, distance, and nearest safe haven contacts.
          </p>
        </div>
      </div>
    </div>
  );
}
