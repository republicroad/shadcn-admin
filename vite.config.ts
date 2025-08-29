import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import Terminal from 'vite-plugin-terminal';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    Terminal({
              console: 'terminal', // Redirects console.log from browser to terminal
              // You can also specify other options like 'output' to control where logs appear
            }),
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
      },
      '/geerule': {
        target: 'http://localhost:8000', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
        configure: (proxy, options) => {
          // Log incoming requests to the proxy
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // console.log("import.meta.env.VITE_API_URL:", import.meta.env.VITE_API_URL);
            // console.log("import.meta.env.BASE_URL:", import.meta.env.BASE_URL);
            console.log('Proxy Request:', req.method, req.url);
            // You can also log headers or body if needed:
            // console.log('Request Headers:', proxyReq.getHeaders());
            // console.log('Request Bodys:', req.body);`
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy Response:', req.method, req.url, proxyRes.statusCode);
            // console.log('Response Headers:', proxyRes.headers);
            // let body: any = [];
            // proxyRes.on('data', (chunk) => {
            //   body.push(chunk);
            // });
            // proxyRes.on('end', () => {
            //   body = Buffer.concat(body).toString();
            //   console.log('Proxy Response:', req.method, req.url, proxyRes.statusCode);
            //   console.log('Response Headers:', proxyRes.headers);
            //   console.log(`Proxy Response Body for ${req.url}:`, body);
            // });
          });

          // Log errors during proxying
          proxy.on('error', (err, req, res) => {
            console.error('Proxy Error:', err.message, req.url);
          });
        },
      },
    },
  },
})
