import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Layers, CheckCircle2, ChevronRight } from 'lucide-react';

interface PermissionGateProps {
  onAllGranted: () => void;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ onAllGranted }) => {
  const [vpnAllowed, setVpnAllowed] = useState(false);
  const [overlayAllowed, setOverlayAllowed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ff_permissions_granted');
    if (saved === 'true') {
      setIsVisible(false);
      onAllGranted();
    }
  }, [onAllGranted]);

  const handleGrant = (type: 'vpn' | 'overlay') => {
    if (type === 'vpn') setVpnAllowed(true);
    else setOverlayAllowed(true);
  };

  const finalize = () => {
    if (vpnAllowed && overlayAllowed) {
      localStorage.setItem('ff_permissions_granted', 'true');
      setIsVisible(false);
      onAllGranted();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-8 hardware-bg"
        >
          <div className="w-full max-w-xs space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black italic">
                <span className="text-white">FAKELAG</span>
                <span className="text-brand-red">REAL</span>
              </h1>
              <p className="text-[10px] font-mono tracking-[0.2em] opacity-40 uppercase">System Authorization Required</p>
            </div>

            <div className="space-y-4">
              {/* Overlay Permission */}
              <button
                onClick={() => handleGrant('overlay')}
                disabled={overlayAllowed}
                className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between ${
                  overlayAllowed ? 'bg-brand-green/10 border-brand-green' : 'bg-white/5 border-white/10 active:border-white/40'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-3 rounded-xl ${overlayAllowed ? 'bg-brand-green/20' : 'bg-white/10'}`}>
                    <Layers size={20} className={overlayAllowed ? 'text-brand-green' : 'text-white'} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Display Overlay</div>
                    <div className="text-[10px] opacity-40 leading-tight">Izinkan aplikasi muncul di atas FF</div>
                  </div>
                </div>
                {overlayAllowed ? <CheckCircle2 size={20} className="text-brand-green" /> : <ChevronRight size={16} className="opacity-20" />}
              </button>

              {/* VPN Permission */}
              <button
                onClick={() => handleGrant('vpn')}
                disabled={vpnAllowed}
                className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between ${
                  vpnAllowed ? 'bg-brand-green/10 border-brand-green' : 'bg-white/5 border-white/10 active:border-white/40'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-3 rounded-xl ${vpnAllowed ? 'bg-brand-green/20' : 'bg-white/10'}`}>
                    <ShieldAlert size={20} className={vpnAllowed ? 'text-brand-green' : 'text-white'} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">VPN Connection</div>
                    <div className="text-[10px] opacity-40 leading-tight">Izinkan enkripsi traffic game</div>
                  </div>
                </div>
                {vpnAllowed ? <CheckCircle2 size={20} className="text-brand-green" /> : <ChevronRight size={16} className="opacity-20" />}
              </button>
            </div>

            <button
              onClick={finalize}
              disabled={!vpnAllowed || !overlayAllowed}
              className={`w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-lg ${
                vpnAllowed && overlayAllowed 
                  ? 'bg-brand-red text-white shadow-red-500/20' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              START FAKELAG REAL
            </button>
          </div>
          
          <div className="absolute bottom-8 text-center">
            <p className="text-[10px] opacity-20 font-mono">LEX SYSTEM SECURITY ENFORCED v1.0.4</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
