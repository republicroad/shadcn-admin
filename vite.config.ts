/// <reference types="vitest/config" />
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { playwright } from '@vitest/browser-playwright'
import Terminal from 'vite-plugin-terminal'

function viteProxyRequestLogger(proxyReq:any, req:any, res:any) {
    let body = '';
    // Collect the data chunks from the request
    req.on('data', (chunk:any) => {
      body += chunk;
    });
    req.on('end', () => {
      console.log('Proxy Request:', req.method, req.url);
      console.log('--- Request Headers ---');
      console.log(proxyReq.getHeaders());
      console.log('--- Request Body ---');
      console.log(body);
    });
}

function viteProxyResponesLogger(proxyRes:any, req:any, res:any) {
    let body: any = [];
    proxyRes.on('data', (chunk:any) => {
      body.push(chunk);
    });
    proxyRes.on('end', () => {
      body = Buffer.concat(body).toString();
      console.log('Proxy Response:', req.method, req.url, proxyRes.statusCode);
      console.log('--- Response Headers ---');
      console.log(proxyRes.headers);
      console.log('--- Response Body ---');
      console.log(body);
    });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    Terminal(),  //{console: 'terminal'}
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
        configure: (proxy, options) => {
          // Log incoming requests to the proxy
          proxy.on('proxyReq', (proxyReq, req, res) => {
            viteProxyRequestLogger(proxyReq, req, res)
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            viteProxyResponesLogger(proxyRes, req, res)
          });
          // Log errors during proxying
          proxy.on('error', (err, req, res) => {
            console.error('Proxy Error:', err.message, req.url);
          });
        },
      },
      '/geerule': {
        target: 'http://localhost:8000', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
        configure: (proxy, options) => {
          // Log incoming requests to the proxy
          proxy.on('proxyReq', (proxyReq, req, res) => {
            viteProxyRequestLogger(proxyReq, req, res)
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            viteProxyResponesLogger(proxyRes, req, res)
          });
          // Log errors during proxying
          proxy.on('error', (err, req, res) => {
            console.error('Proxy Error:', err.message, req.url);
          });
        },
      },
    },
  },
  test: {
    silent: 'passed-only',
    unstubEnvs: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      // include: ['src/**/*.{js,jsx,ts,tsx}'], // Uncomment to expand the report to all src/**/* so untested modules appear as 0% coverage.
      exclude: [
        'src/components/ui/**',
        'src/assets/**',
        'src/tanstack-table.d.ts',
        'src/routeTree.gen.ts',
        'src/test-utils/**',
        'src/routes/**',
      ],
    },
  },
})
