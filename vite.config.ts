import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    'base': '/EbruTs/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        },
        sourcemap: true
    }
})
