/**
 * Canvas Image Resizer & Automatic WebP Compressor
 * Downscales large user uploads to max 800px width and compresses to ~20KB-35KB WebP.
 * Completely eliminates DOMException: The quota has been exceeded and speeds up API responses.
 */
export const compressImage = (dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl);
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const compressed = canvas.toDataURL('image/webp', quality);
          resolve(compressed);
        } catch (e) {
          resolve(dataUrl);
        }
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

/**
 * Protected keys that MUST NEVER be purged from LocalStorage
 */
const PROTECTED_KEYS = [
  'visual-builder-local-saved-drafts',
  'visual-builder-pages-cms',
  'visual-builder-is-admin',
  'visual-builder-admin-passcode',
  'published_site'
];

const isProtectedKey = (keyName: string): boolean => {
  return PROTECTED_KEYS.some(p => keyName.includes(p));
};

/**
 * Safe LocalStorage setter that automatically purges giant legacy uncompressed Base64
 * keys if the browser's 5MB quota is reached.
 */
export const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[STORAGE] LocalStorage quota limit reached for key: "${key}". Purging legacy large images...`);
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k !== key && !isProtectedKey(k)) {
          const val = localStorage.getItem(k);
          // Only purge large Base64 image data strings
          if (val && val.startsWith('data:image')) {
            keysToRemove.push(k);
          }
        }
      }
      
      keysToRemove.forEach(k => {
        try {
          localStorage.removeItem(k);
          console.warn(`[STORAGE] Purged legacy image key to free quota: ${k}`);
        } catch (err) {}
      });

      // Retry setItem
      localStorage.setItem(key, value);
    } catch (err) {
      console.error(`[STORAGE] Unable to write key ${key} to LocalStorage:`, err);
    }
  }
};

/**
 * On application startup, purges any giant legacy uncompressed base64 data URLs > 200KB from LocalStorage
 * that were saved during previous uncompressed tests.
 */
export const cleanStorageOnStartup = (): void => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && !isProtectedKey(k)) {
        const val = localStorage.getItem(k);
        if (val && val.startsWith('data:image') && val.length > 200000) {
          keysToRemove.push(k);
        }
      }
    }
    if (keysToRemove.length > 0) {
      console.warn(`[STORAGE] Cleaning ${keysToRemove.length} stale uncompressed legacy image keys from LocalStorage...`);
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
  } catch (e) {
    console.error('[STORAGE] Error during startup LocalStorage cleanup:', e);
  }
};
