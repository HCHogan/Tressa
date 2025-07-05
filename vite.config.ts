import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 将大型编辑器相关库分离到单独的 chunk
          if (id.includes('monaco-editor') || id.includes('@monaco-editor')) {
            return 'monaco-editor';
          }

          // 将 React 相关库分离
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }

          // 将 Radix UI 组件分离
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }

          // 将 Markdown 相关库分离
          if (id.includes('react-markdown') || id.includes('remark-') || id.includes('rehype-')) {
            return 'markdown';
          }

          // 将 KaTeX 相关库分离
          if (id.includes('katex') || id.includes('react-katex')) {
            return 'katex';
          }

          // 将语法高亮相关库分离
          if (id.includes('react-syntax-highlighter')) {
            return 'syntax-highlighter';
          }

          // 将路由相关库分离
          if (id.includes('react-router')) {
            return 'router';
          }

          // 将工具库分离
          if (id.includes('lodash') || id.includes('axios') || id.includes('zustand')) {
            return 'utils';
          }

          // 将 Babel 相关库分离（用于代码解析）
          if (id.includes('@babel')) {
            return 'babel';
          }

          // 其他 node_modules 依赖
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // 增加 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react()],
  define: {
    'process.env': {}, // 或者指定一些环境变量
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
