// src/utils/fontLoader.js

// ============================================
// 1. Load Font with Font Face Observer
// ============================================
export const loadFont = (fontFamily, url, weight = 'normal', style = 'normal') => {
  return new Promise((resolve, reject) => {
    const font = new FontFace(fontFamily, `url(${url})`, {
      weight,
      style,
    });

    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        resolve(loadedFont);
      })
      .catch((error) => {
        console.warn(`Failed to load font ${fontFamily}:`, error);
        reject(error);
      });
  });
};

// ============================================
// 2. Preload Fonts
// ============================================
export const preloadFonts = (fonts) => {
  fonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.url;
    link.as = 'font';
    link.type = font.type || 'font/ttf';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// ============================================
// 3. Font Display Strategy
// ============================================
export const setFontDisplay = (fontFamily, display = 'swap') => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: '${fontFamily}';
      font-display: ${display};
    }
  `;
  document.head.appendChild(style);
};

// ============================================
// 4. Check if Font is Loaded
// ============================================
export const isFontLoaded = (fontFamily) => {
  return document.fonts.check(`1em "${fontFamily}"`);
};

// ============================================
// 5. Wait for Font to Load
// ============================================
export const waitForFont = (fontFamily, timeout = 3000) => {
  return new Promise((resolve) => {
    if (isFontLoaded(fontFamily)) {
      resolve(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      resolve(false);
    }, timeout);

    document.fonts.ready.then(() => {
      clearTimeout(timeoutId);
      resolve(isFontLoaded(fontFamily));
    });
  });
};