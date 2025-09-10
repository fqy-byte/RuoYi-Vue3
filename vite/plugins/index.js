import vue from '@vitejs/plugin-vue'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'

export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue()]
    vitePlugins.push(createAutoImport())
	vitePlugins.push(createSetupExtend())
    vitePlugins.push(createSvgIcon(isBuild))
	isBuild && vitePlugins.push(...createCompression(viteEnv))
    
    // 添加 Tailwind CSS 插件配置
    const postcssConfig = {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
    
    // 确保样式通过 PostCSS 处理
    vitePlugins.push({
      name: 'postcss-config',
      config: () => ({ css: { postcss: postcssConfig } })
    })
    
    return vitePlugins
}
