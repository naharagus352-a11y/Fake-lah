import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Gamepad2, 
  ShieldAlert, 
  BellOff, 
  Video, 
  Cpu, 
  Layers, 
  Wifi, 
  X,
  Maximize2,
  GaugeCircle
} from 'lucide-react';
import { playActivationSound, playDeactivationSound } from '../lib/sounds';

interface GameSpaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameSpace: React.FC<GameSpaceProps> = ({ isOpen, onClose }) => {
  const [fps, setFps] = useState(60);
  const [cpuUsage, setCpuUsage] = useState(32);
  const [gpuUsage, setGpuUsage] = useState(45);
  const [ping, setPing] = useState(24);

  const [toggles, setToggles] = useState([
    { id: 'turbo', icon: Zap, label: 'Turbo', active: true, color: 'text-brand-red' },
    { id: 'dist', icon: BellOff, label: 'No Dist.', active: false, color: 'text-white' },
    { id: 'record', icon: Video, label: 'Record', active: false, color: 'text-white' },
    { id: 'lag', icon: ShieldAlert, label: 'Anti-Lag', active: true, color: 'text-brand-green' },
  ]);

  const handleToggle = (id: string) => {
    setToggles(prev => prev.map(t => {
      if (t.id === id) {
        const newState = !t.active;
        if (newState) playActivationSound();
        else playDeactivationSound();
        return { ...t, active: newState };
      }
      return t;
    }));
  };

  // Simulated metrics
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 4));
      setCpuUsage(Math.floor(20 + Math.random() * 20));
      setGpuUsage(Math.floor(40 + Math.random() * 15));
      setPing(Math.floor(15 + Math.random() * 10));
    }, 1500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const apps = [
    { name: 'Mobile Legends', icon: 'ML' },
    { name: 'PUBG Mobile', icon: 'PUBG' },
    { name: 'Free Fire', icon: 'FF' },
    { name: 'Genshin Impact', icon: 'GI' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Main Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[101] bg-[#121212] border-l border-brand-red/30 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header / Top Bar */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                  <Gamepad2 className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter text-white">REDMAGIC</h3>
                  <p className="text-[10px] font-mono text-brand-red font-bold">GAME SPACE 4.0</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <X className="text-white/60" size={24} />
              </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 gap-3 p-6">
              <div className="hardware-bg p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <GaugeCircle size={14} />
                  <span className="text-[10px] font-bold uppercase">FPS</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black italic text-brand-green">{fps}</span>
                  <span className="text-[10px] opacity-40">FPS</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    animate={{ width: `${(fps/60) * 100}%` }}
                    className="h-full bg-brand-green" 
                  />
                </div>
              </div>

              <div className="hardware-bg p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Wifi size={14} />
                  <span className="text-[10px] font-bold uppercase">Latency</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black italic text-cyan-400">{ping}</span>
                  <span className="text-[10px] opacity-40">MS</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    animate={{ width: `${Math.min((100 - ping)/100 * 100, 100)}%` }}
                    className="h-full bg-cyan-400" 
                  />
                </div>
              </div>

              <div className="hardware-bg p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Cpu size={14} />
                  <span className="text-[10px] font-bold uppercase">CPU Load</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black italic text-white">{cpuUsage}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    animate={{ width: `${cpuUsage}%` }}
                    className="h-full bg-white/40" 
                  />
                </div>
              </div>

              <div className="hardware-bg p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Layers size={14} />
                  <span className="text-[10px] font-bold uppercase">GPU Load</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black italic text-white">{gpuUsage}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    animate={{ width: `${gpuUsage}%` }}
                    className="h-full bg-white/40" 
                  />
                </div>
              </div>
            </div>

            {/* Quick Toggles */}
            <div className="px-6 mb-6">
              <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">Functional Switch</h4>
              <div className="grid grid-cols-4 gap-3">
                {toggles.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleToggle(item.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      item.active ? 'bg-brand-red/10 border border-brand-red/40' : 'bg-white/5 border border-white/10'
                    }`}>
                      <item.icon className={item.active ? 'text-brand-red' : 'text-white/40'} size={24} />
                    </div>
                    <span className="text-[9px] font-bold uppercase text-white/60">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Mode Selector */}
            <div className="px-6 mb-8">
              <div className="bg-black/40 p-1 rounded-xl flex gap-1">
                {['ECO', 'BALANCED', 'DIABLO'].map((mode, i) => (
                  <button 
                    key={mode}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black italic tracking-tighter transition-all ${
                      i === 2 ? 'bg-brand-red text-white' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Apps / Game Library */}
            <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Game Library</h4>
                <Maximize2 size={12} className="text-white/20" />
              </div>
              
              <div className="space-y-3">
                {apps.map((app, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-4 hardware-bg rounded-2xl border border-white/5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black italic text-white/20 border border-white/5 group-hover:border-brand-red/40 transition-colors">
                        {app.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{app.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                          <span className="text-[9px] font-mono text-white/40">READY TO PLAY</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                      <Zap size={14} className="text-brand-red" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Glow Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-red shadow-[0_0_30px_rgba(255,0,0,1)]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
