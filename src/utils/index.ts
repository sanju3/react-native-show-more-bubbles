import { DeviceEventEmitter } from 'react-native';

export const separator = (s: string, m: string): string[] => {
  return s.split(new RegExp(`(${m})`, 'gi')).filter((e) => e);
};

export const free = (s: string, m: string): string => {
  return s.replace(new RegExp(m, 'g'), '').trim();
};

export const unFocus = (): void => {
  DeviceEventEmitter.emit('unfocusBubble', true);
};
