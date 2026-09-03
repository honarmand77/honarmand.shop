// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // استفاده از jsx runtime اتوماتیک
      jsxRuntime: 'automatic',
      // تنظیمات Babel در صورت نیاز
      babel: {
        presets: ['@babel/preset-react'],
      },
    }),
  ],
  
  server: {
    port: 3000,
    proxy: {
      '/wp-json': {
        target: 'https://api.honarmand.shop',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://honarmand.shop');
            proxyReq.setHeader('Referer', 'https://honarmand.shop/');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://honarmand.shop';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        }
      },
      '/hcms': {
        target: 'https://api.honarmand.shop',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://honarmand.shop');
            proxyReq.setHeader('Referer', 'https://honarmand.shop/');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://honarmand.shop';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        }
      },
      '/wc': {
        target: 'https://api.honarmand.shop',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://honarmand.shop');
            proxyReq.setHeader('Referer', 'https://honarmand.shop/');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://honarmand.shop';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        }
      },
      '/auth': {
        target: 'https://api.honarmand.shop',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://honarmand.shop');
            proxyReq.setHeader('Referer', 'https://honarmand.shop/');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://honarmand.shop';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        }
      },
      '/theme': {
        target: 'https://api.honarmand.shop',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://honarmand.shop');
            proxyReq.setHeader('Referer', 'https://honarmand.shop/');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://honarmand.shop';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        }
      },
      '/wp-content/uploads': {
        target: 'https://api.honarmand.shop',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('Origin');
            proxyReq.setHeader('Referer', 'https://honarmand.shop/');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://honarmand.shop';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            proxyRes.headers['Cache-Control'] = 'public, max-age=31536000, immutable';
          });
        }
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    cssMinify: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react') || id.includes('@headlessui') || id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('axios') || id.includes('lodash') || id.includes('date-fns')) {
              return 'vendor-utils';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux') || id.includes('redux-persist')) {
              return 'vendor-redux';
            }
            if (id.includes('@tanstack/react-query') || id.includes('react-query')) {
              return 'vendor-query';
            }
            if (id.includes('swiper') || id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            return 'vendor';
          }
        },
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name].[hash].[ext]';
          }
          if (assetInfo.name?.endsWith('.ttf') || assetInfo.name?.endsWith('.woff') || assetInfo.name?.endsWith('.woff2')) {
            return 'fonts/[name].[hash].[ext]';
          }
          if (assetInfo.name?.endsWith('.png') || assetInfo.name?.endsWith('.jpg') || assetInfo.name?.endsWith('.jpeg') || assetInfo.name?.endsWith('.svg') || assetInfo.name?.endsWith('.webp')) {
            return 'images/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@services': '/src/services',
      '@assets': '/src/assets',
      '@features': '/src/features',
      '@app': '/src/app',
      '@api': '/src/api',
      '@store': '/src/store',
    },
    extensions: ['.jsx', '.js', '.json', '.ts', '.tsx'],
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'axios',
      '@reduxjs/toolkit',
      'react-redux',
      '@tanstack/react-query',
      'swiper',
      'framer-motion',
    ],
    // غیرفعال کردن oxc در توسعه
    esbuildOptions: {
      jsx: 'automatic',
      jsxDev: false,
    },
  },

  // حذف بخش esbuild از اینجا
  // esbuild: {
  //   jsx: 'automatic',
  //   jsxDev: false,
  // },

  base: '/',

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://api.honarmand.shop'),
  },
});