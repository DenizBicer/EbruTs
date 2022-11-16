import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    'base': '/dist/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/pages/inkdrop/index.html')
            }
        }
    }
})
