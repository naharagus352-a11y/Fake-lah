import { DeviceSpecs } from './types';

export const getDeviceSpecs = (): DeviceSpecs => {
  const ram = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unknown';
  const cores = navigator.hardwareConcurrency || 0;
  
  let gpu = 'Unknown';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpu = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch (e) {
    console.error('GPU detection failed', e);
  }

  return {
    ram,
    cpu: `${cores} Core CPU`,
    gpu,
    cores
  };
};
