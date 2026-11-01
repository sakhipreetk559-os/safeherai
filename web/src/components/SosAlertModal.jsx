import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Send, 
  X, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2,
  Radio
} from 'lucide-react';
import { startEmergencySiren, stopEmergencySiren } from '../services/emergencyAudio';

export function SosAlertModal({ isOpen, onClose, currentCoords, currentAddress }) {
  const [countdown, setCountdown] = useState(5);
  const [isMuted, setIsMuted] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setCountdown(5);
      setSosSent(false);
      startEmergencySiren();

      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setSosSent(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopEmergencySiren();
    }

    return () => {
      clearInterval(timer);
      stopEmergencySiren();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSound = () => {
    if (isMuted) {
      startEmergencySiren();
      setIsMuted(false);
    } else {
      stopEmergencySiren();
      setIsMuted(true);
    }
  };

  const handleManualTrigger = () => {
    setCountdown(0);
    setSosSent(true);
  };

  const handleDismiss = () => {
    stopEmergencySiren();
    onClose();
  };

  const lat = currentCoords?.lat || 28.6315;
  const lng = currentCoords?.lng || 77.2167;
  const locationString = currentAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  const emergencyMessage = encodeURIComponent(
    `EMERGENCY SOS! I need immediate help. My current location is ${locationString} (https://maps.google.com/?q=${lat},${lng}). Sent via SafeHer AI.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-6">
        {/* Pulsing Siren Icon Header */}
        <div className="relative flex items-center justify-center mx-auto w-24 h-24">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/80">
            <AlertTriangle className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        {/* Title & Siren Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
              Emergency SOS Beacon
            </h2>
          </div>
          <p className="text-xs text-red-300 font-medium">
            Dual-tone emergency acoustic alert is active.
          </p>

          <button
            onClick={toggleSound}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isMuted ? 'Unmute Acoustic Alarm' : 'Mute Alarm'}</span>
          </button>
        </div>

        {/* Countdown or Dispatch Confirmation */}
        {!sosSent ? (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-3">
            <span className="text-xs text-red-300 font-semibold uppercase tracking-wider block">
              Auto-Dispatching In
            </span>
            <div className="text-5xl font-black text-red-400 font-mono">
              0{countdown}
            </div>
            <p className="text-[11px] text-slate-400">
              Press cancel if this was triggered accidentally.
            </p>
            <button
              onClick={handleManualTrigger}
              className="text-xs font-bold text-red-400 underline hover:text-red-300 transition"
            >
              Trigger Instantly Without Waiting
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-left">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>SOS Alert Broadcasted</span>
            </div>
            <p className="text-xs text-slate-300">
              Emergency dispatch signal active. Share via SMS or dial emergency services directly below.
            </p>
          </div>
        )}

        {/* Location Pin Intel */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-2 text-left text-xs">
          <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Distress Pin</span>
            <span className="text-white font-medium truncate block">{locationString}</span>
          </div>
        </div>

        {/* Action Buttons: SMS & Dial 112 */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* SMS Trigger with Pre-Filled Coords */}
          <a
            href={`sms:112?body=${emergencyMessage}`}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-red-600/40 transition"
          >
            <Send className="w-4 h-4" />
            <span>Send SOS SMS</span>
          </a>

          {/* Direct Emergency Call */}
          <a
            href="tel:112"
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Dial 112 PCR</span>
          </a>
        </div>

        {/* Cancel Button */}
        <div>
          <button
            onClick={handleDismiss}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel / False Alarm
          </button>
        </div>
      </div>
    </div>
  );
}
