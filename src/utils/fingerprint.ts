// Hardware & Device Fingerprinting for 100% Isolated Local Storage

export function getDeviceFingerprint(): string {
  try {
    let localSecret = localStorage.getItem('ta_device_secret');
    if (!localSecret) {
      localSecret = 'SEC-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      localStorage.setItem('ta_device_secret', localSecret);
    }

    const nav = typeof window !== 'undefined' ? window.navigator : ({} as any);
    const scr = typeof window !== 'undefined' ? window.screen : ({} as any);

    const components = [
      nav.userAgent || 'unknown-ua',
      nav.language || 'en',
      nav.hardwareConcurrency || 4,
      scr.width || 1920,
      scr.height || 1080,
      scr.colorDepth || 24,
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      localSecret
    ].join('###');

    // Simple FNV-1a hash algorithm
    let hash = 2166136261;
    for (let i = 0; i < components.length; i++) {
      hash ^= components.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }

    const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
    return `FP-${hex.substring(0, 4)}-${hex.substring(4, 8)}`;
  } catch (e) {
    return 'FP-LOCAL-VAULT';
  }
}
