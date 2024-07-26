import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'




export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
        input: path.join(__dirname, 'public/index.html'),
        },
      },
    server: {
        host: '0.0.0.0', // This will allow access from any IP address
        port: 3000, // Default port for Vite; adjust if needed
        
    }

});
