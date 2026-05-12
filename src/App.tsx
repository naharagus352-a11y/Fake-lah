import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DraggableAction } from './components/DraggableAction';
import { VPNControl } from './components/VPNControl';
import { GameSpace } from './components/GameSpace';
import { SettingsPanel } from './components/SettingsPanel';
import { PermissionGate } from './components/PermissionGate';
import { Settings } from './types';
import { Snowflake, Plane, Ghost, Github as TikTok, Gamepad2 } from 'lucide-react';
import { playActivationSound, playDeactivationSound } from './lib/sounds';

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [isGameSpaceOpen, setIsGameSpaceOpen] = useState(false);
  const [mods, setMods] = useState({
    freeze: false,
    teleport: false,
    ghost: false
  });
  const [vpnConnected, setVpnConnected] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    buttonSize: 90,
    opacity: 100
  });

  // Load settings and mods from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem('ff_system_active');
    if (savedStatus) setIsSystemActive(savedStatus === 'true');

    const savedSettings = localStorage.getItem('ff_app_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedMods = localStorage.getItem('ff_app_mods');
    if (savedMods) setMods(JSON.parse(savedMods));

    const savedVPN = localStorage.getItem('ff_vpn_state');
    if (savedVPN) setVpnConnected(savedVPN === 'true');
  }, []);

  // Save settings on change
  useEffect(() => {
    localStorage.setItem('ff_app_settings', JSON.stringify(settings));
  }, [settings]);

  // Save mods on change
  useEffect(() => {
    localStorage.setItem('ff_app_mods', JSON.stringify(mods));
  }, [mods]);

  // Save VPN state
  useEffect(() => {
    localStorage.setItem('ff_vpn_state', String(vpnConnected));
  }, [vpnConnected]);

  // Save System Active state
  useEffect(() => {
    localStorage.setItem('ff_system_active', String(isSystemActive));
  }, [isSystemActive]);

  const toggleMod = (mod: keyof typeof mods) => {
    if (!isSystemActive) return;
    const newState = !mods[mod];
    if (newState) playActivationSound();
    else playDeactivationSound();
    setMods(prev => ({ ...prev, [mod]: newState }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden hardware-bg">
      <PermissionGate onAllGranted={() => setIsAuthorized(true)} />
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 px-10 py-20 flex flex-col justify-center select-none">
        <h1 className="text-[15vw] font-black leading-none text-white/5 uppercase tracking-tighter">
          FAKELAG
        </h1>
        <h1 className="text-[15vw] font-black leading-none text-brand-red uppercase tracking-tighter ml-auto">
          REAL
        </h1>
      </div>

      {/* Header Branding */}
      <div className="absolute top-6 left-6 z-[80] flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-black italic flex flex-col leading-none">
            <span className="text-white">FAKELAG</span>
            <span className="text-brand-red">REAL</span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isSystemActive ? 'bg-brand-green' : 'bg-brand-red'}`} />
            <span className="text-[10px] font-mono opacity-60 tracking-wider">
              {isSystemActive ? 'SYSTEM ACTIVE' : 'SYSTEM INACTIVE'}
            </span>
          </div>
        </div>

        {/* Master Toggle */}
        <button 
          onClick={() => {
            const newState = !isSystemActive;
            if (newState) playActivationSound();
            else playDeactivationSound();
            setIsSystemActive(newState);
          }}
          className={`group flex items-center gap-3 p-1 pr-4 rounded-full border transition-all active:scale-95 ${
            isSystemActive ? 'bg-brand-green/10 border-brand-green text-brand-green' : 'bg-white/5 border-white/10 text-white/40'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isSystemActive ? 'bg-brand-green text-black scale-100' : 'bg-white/10 text-white scale-90'
          }`}>
            <div className={`w-3 h-3 rounded-full border-2 border-current`} />
          </div>
          <span className="text-xs font-black uppercase tracking-tighter">
            {isSystemActive ? 'ON (Aktif)' : 'OFF (Nonaktif)'}
          </span>
        </button>
      </div>

      {/* LEX Key System */}
      <div className="absolute bottom-6 left-6 z-[80] font-mono">
        <div className="text-xs opacity-40 uppercase tracking-widest mb-1">Key System</div>
        <div className="text-3xl font-black text-brand-red drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">LEX</div>
      </div>

      {/* TikTok Handle */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
          <TikTok size={14} className="text-white" />
          <span className="text-xs font-bold tracking-tight">looks_airputih</span>
        </div>
      </div>

      {/* Mod Buttons (Only visible if System is Active) */}
      <AnimatePresence>
        {isSystemActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <DraggableAction 
              label="FREEZE" 
              icon={Snowflake} 
              isActive={mods.freeze}
              onToggle={() => toggleMod('freeze')}
              size={settings.buttonSize} 
              opacity={settings.opacity}
              initialX={50}
              initialY={220}
            />
            
            <DraggableAction 
              label="TELEPORT" 
              icon={Plane} 
              isActive={mods.teleport}
              onToggle={() => toggleMod('teleport')}
              size={settings.buttonSize} 
              opacity={settings.opacity}
              initialX={160}
              initialY={220}
            />

            <DraggableAction 
              label="GHOST" 
              icon={Ghost} 
              isActive={mods.ghost}
              onToggle={() => toggleMod('ghost')}
              size={settings.buttonSize} 
              opacity={settings.opacity}
              initialX={270}
              initialY={220}
            />



            <VPNControl 
              size={settings.buttonSize} 
              opacity={settings.opacity} 
              isConnected={vpnConnected}
              setIsConnected={setVpnConnected}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Overlay */}
      <SettingsPanel settings={settings} setSettings={setSettings} />

      {/* Game Space */}
      <GameSpace 
        isOpen={isGameSpaceOpen} 
        onClose={() => setIsGameSpaceOpen(false)} 
      />

      {/* Game Space Trigger (Handle) */}
      <motion.button
        whileHover={{ x: -10 }}
        onClick={() => setIsGameSpaceOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] h-32 w-2 bg-brand-red rounded-l-full shadow-[0_0_15px_rgba(255,0,0,0.5)] flex items-center justify-center group"
      >
        <div className="absolute right-4 py-2 px-3 bg-brand-red text-white text-[10px] font-black italic tracking-tighter rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          GAME SPACE
        </div>
        <Gamepad2 className="text-white/20 -translate-x-px" size={10} />
      </motion.button>

      {/* Android Status Bar Simulation Spacer */}
      <div className="h-6 w-full bg-black/50" />
    </div>
  );
}

