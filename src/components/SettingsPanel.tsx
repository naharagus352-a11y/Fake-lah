import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, X, Smartphone, Cpu, Activity, Zap } from 'lucide-react';
import { DeviceSpecs, SensitivitySettings, Settings as AppSettings } from '../types';
import { getDeviceSpecs } from '../services/deviceInfo';
import { generateAiSensitivity } from '../services/aiSensitivity';

interface SettingsPanelProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [specs, setSpecs] = useState<DeviceSpecs | null>(null);
  const [sensitivity, setSensitivity] = useState<SensitivitySettings | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setSpecs(getDeviceSpecs());
    const savedSens = localStorage.getItem('ff_sensitivity');
    if (savedSens) setSensitivity(JSON.parse(savedSens));
  }, []);

  const handleAiGenerate = async () => {
    if (!specs) return;
    setIsGenerating(true);
    const result = await generateAiSensitivity(specs);
    setSensitivity(result);
    localStorage.setItem('ff_sensitivity', JSON.stringify(result));
    setIsGenerating(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-[100] p-3 rounded-full bg-black/40 border border-white/20 backdrop-blur-md active:scale-90 transition-transform"
      >
        <SettingsIcon className="text-white" size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-white/10 z-[200] overflow-y-auto p-6 hardware-bg"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <SettingsIcon size={20} className="text-brand-red" />
                PENGATURAN
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Device Info */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3 text-brand-red">
                <Smartphone size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Device Info</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-60 flex items-center gap-1"><Cpu size={12} /> RAM:</span>
                  <span className="font-mono text-brand-green">{specs?.ram}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-60 flex items-center gap-1"><Activity size={12} /> CPU:</span>
                  <span className="font-mono text-brand-green">{specs?.cpu}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-60 flex items-center gap-1"><Zap size={12} /> GPU:</span>
                  <span className="font-mono text-brand-green truncate ml-4 text-right">{specs?.gpu}</span>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="space-y-6 mb-8">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="uppercase opacity-60">Ukuran Tombol</span>
                  <span className="text-brand-red">{settings.buttonSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="60" 
                  max="150" 
                  value={settings.buttonSize}
                  onChange={(e) => setSettings({ ...settings, buttonSize: parseInt(e.target.value) })}
                  className="w-full accent-brand-red h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="uppercase opacity-60">Opacity</span>
                  <span className="text-brand-red">{settings.opacity}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={settings.opacity}
                  onChange={(e) => setSettings({ ...settings, opacity: parseInt(e.target.value) })}
                  className="w-full accent-brand-red h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* AI Sensitivity */}
            <div className="space-y-4">
              <button
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-brand-red to-orange-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Activity size={20} />
                )}
                AI GENERATE SENSITIVITY
              </button>

              {sensitivity && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-2"
                >
                  {Object.entries(sensitivity).map(([key, value]) => (
                    <div key={key} className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="text-[10px] uppercase opacity-40 mb-1">{key}</div>
                      <div className="text-lg font-mono font-bold text-brand-green">{value}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-[10px] opacity-40 font-mono">TIKTOK: looks_airputih</p>
              <p className="text-[10px] opacity-40 font-mono mt-1">LEX SYSTEM v1.0.4</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
