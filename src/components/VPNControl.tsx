import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldCheck, Power, Minus } from 'lucide-react';
import { playActivationSound, playDeactivationSound } from '../lib/sounds';

interface VPNControlProps {
  size: number;
  opacity: number;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export const VPNControl: React.FC<VPNControlProps> = ({ size, opacity, isConnected, setIsConnected }) => {
  const [ip, setIp] = useState('Detecting...');
  const [proxyIp, setProxyIp] = useState('');
  const [isHidden, setIsHidden] = useState(false);

  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (isConnected && !proxyIp) {
      setProxyIp(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
    }
  }, [isConnected, proxyIp]);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('127.0.0.1'));
  }, []);

  const toggleVPN = () => {
    if (!isConnected) {
      setIsRequesting(true);
    } else {
      setProxyIp('');
      setIsConnected(false);
      playDeactivationSound();
    }
  };

  const confirmVPN = () => {
    setIsRequesting(false);
    // Simulate connecting
    setProxyIp(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
    setIsConnected(true);
    playActivationSound();
  };

  return (
    <>
    <AnimatePresence>
      {!isHidden ? (
        <motion.div
          key="vpn-panel"
          drag
          dragMomentum={false}
          initial={{ x: 20, y: 300, opacity: 0, scale: 0.9 }}
          animate={{ opacity: opacity / 100, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileDrag={{ 
            backgroundColor: "rgba(0, 255, 0, 0.2)",
            borderColor: "#00ff00"
          }}
          className="fixed z-50 p-4 rounded-3xl border-2 border-white/20 hardware-bg draggable-handle backdrop-blur-md select-none"
          style={{
            width: size * 2.5,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <ShieldCheck className="text-brand-green animate-pulse" size={20} />
              ) : (
                <Shield className="text-white/40" size={20} />
              )}
              <span className="text-xs font-bold font-mono">VPN REAL</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsHidden(true)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minus size={16} className="text-white/60" />
              </button>
              <div className={`px-2 py-0.5 rounded text-[8px] font-bold ${isConnected ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                {isConnected ? "SECURED" : "OFFLINE"}
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[10px] font-mono opacity-60">
              <span>REAL IP:</span>
              <span>{ip}</span>
            </div>
            {isConnected && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between text-[10px] font-mono text-brand-green"
              >
                <span>PROXY IP:</span>
                <span>{proxyIp}</span>
              </motion.div>
            )}
          </div>

          <button
            onClick={toggleVPN}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isConnected ? "bg-brand-green text-black" : "bg-brand-red text-white"
            }`}
          >
            <Power size={18} />
            <span className="font-bold text-sm uppercase">{isConnected ? "Disconnect" : "Connect VPN"}</span>
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="vpn-mini"
          drag
          dragMomentum={false}
          initial={{ x: 20, y: 300, opacity: 0, scale: 0.5 }}
          animate={{ opacity: opacity / 100, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileDrag={{ scale: 1.1 }}
          onClick={() => setIsHidden(false)}
          className="fixed z-50 rounded-2xl hardware-bg border border-white/20 p-3 shadow-lg cursor-pointer draggable-handle flex items-center justify-center"
          style={{ width: 50, height: 50 }}
        >
          {isConnected ? (
            <ShieldCheck className="text-brand-green" size={24} />
          ) : (
            <Shield className="text-brand-red" size={24} />
          )}
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {isRequesting && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xs bg-[#1a1a1a] border border-white/20 rounded-3xl p-6 text-center space-y-6"
          >
            <div className="p-4 bg-brand-red/10 rounded-full w-fit mx-auto">
              <ShieldCheck className="text-brand-red animate-pulse" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Connection Request</h3>
              <p className="text-xs opacity-60">FAKELAG REAL ingin menyiapkan koneksi VPN yang memungkinkan untuk memantau trafik jaringan. Izinkan hanya jika anda mempercayai sumbernya.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsRequesting(false)}
                className="flex-1 py-3 text-xs font-bold uppercase opacity-40"
              >
                Batal
              </button>
              <button 
                onClick={confirmVPN}
                className="flex-1 py-3 bg-brand-red rounded-xl text-xs font-bold uppercase"
              >
                Izinkan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};
