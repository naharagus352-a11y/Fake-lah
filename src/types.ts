export interface DeviceSpecs {
  ram: string;
  cpu: string;
  gpu: string;
  cores: number;
}

export interface Settings {
  buttonSize: number;
  opacity: number;
}

export interface SensitivitySettings {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniper: number;
  freeLook: number;
}
