import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    'base': '/EbruTs/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                inkdrop: resolve(__dirname, 'src/pages/inkdrop/index.html'),
                tineline: resolve(__dirname, 'src/pages/tineline/index.html')
            }
        }
    }
})
