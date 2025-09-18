import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

// 加载 .env 文件
config()

export default defineConfig({
  test: {
    env: {
      // 确保环境变量被传递到测试中
      CAIYUN_API_TOKEN: process.env.CAIYUN_API_TOKEN || ''
    }
  }
})
