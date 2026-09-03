// src/utils/criticalCSS.js

// ============================================
// 1. Critical CSS for Above the Fold
// ============================================
export const criticalCSS = `
  /* Base Styles */
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  html { 
    font-family: system-ui, -apple-system, sans-serif;
    scroll-behavior: smooth;
  }
  
  body {
    background: #f8fafc;
    color: #0f172a;
    line-height: 1.6;
    min-height: 100vh;
  }
  
  /* Container */
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  /* Loading */
  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 4px solid #e2e8f0;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 2rem auto;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Buttons */
  .btn-primary {
    background: #2563eb;
    color: white;
    padding: 0.625rem 1.25rem;
    border-radius: 0.75rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:active { transform: scale(0.98); }
  
  /* Dark Mode */
  .dark { color-scheme: dark; }
  .dark body { background: #0f172a; color: #f1f5f9; }
`;

// ============================================
// 2. Inject Critical CSS
// ============================================
export const injectCriticalCSS = () => {
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// ============================================
// 3. Load Non-Critical CSS
// ============================================
export const loadNonCriticalCSS = (href) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  document.head.appendChild(link);
};