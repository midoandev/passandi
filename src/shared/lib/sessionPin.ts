let _cachedPin: string | null = null;

export const getSessionPin = (): string | null => _cachedPin;
export const setSessionPin = (pin: string | null) => { _cachedPin = pin; };
