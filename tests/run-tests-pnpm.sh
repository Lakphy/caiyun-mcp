#!/bin/bash

echo "================================"
echo "彩云天气MCP服务器测试运行器 (pnpm)"
echo "================================"
echo ""

# 单元测试（不需要API Key）
echo "📋 运行单元测试..."
pnpm test -- --run tests/index.test.ts tests/tools.test.ts tests/mcp-server-simple.test.ts tests/prompts.test.ts

echo ""

# 集成测试（需要API Key）
if [ -n "$CAIYUN_API_TOKEN" ]; then
    echo "✅ 检测到API密钥"
    echo "📋 运行集成测试..."
    pnpm test -- --run tests/integration-live.test.ts
else
    echo "⚠️  未设置API密钥，跳过集成测试"
    echo "   设置方式: export CAIYUN_API_TOKEN=your_token"
    echo "   或运行: CAIYUN_API_TOKEN=your_token pnpm test"
fi

echo ""
echo "================================"
echo "测试完成！"
echo "================================"