
export const playActivationSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // A clean tech beep
  audio.volume = 0.5;
  audio.play().catch(err => console.log('Audio playback prevented:', err));
};

export const playDeactivationSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // A lower tone beep
  audio.volume = 0.3;
  audio.play().catch(err => console.log('Audio playback prevented:', err));
};
