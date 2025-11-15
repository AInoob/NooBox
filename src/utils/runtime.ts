export const getGlobalScope = (): any => {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  return {};
};

export const isManifestV3 = (): boolean => {
  try {
    return chrome.runtime.getManifest().manifest_version === 3;
  } catch {
    return false;
  }
};
