#!/bin/bash

echo "================================"
echo "彩云天气MCP服务器测试运行器"
echo "================================"
echo ""

# 检查是否有.env文件
if [ -f .env ]; then
    echo "✅ 检测到.env文件"
    # 检查是否有API token
    if grep -q "CAIYUN_API_TOKEN=" .env; then
        echo "✅ 检测到API密钥"
        RUN_INTEGRATION=true
    else
        echo "⚠️  未找到API密钥，跳过集成测试"
        RUN_INTEGRATION=false
    fi
else
    echo "⚠️  未找到.env文件，跳过集成测试"
    RUN_INTEGRATION=false
fi

echo ""
echo "开始运行测试..."
echo "================================"
echo ""

# 运行单元测试
echo "📋 运行单元测试..."
npm test -- --run tests/index.test.ts tests/tools.test.ts tests/mcp-server-simple.test.ts tests/prompts.test.ts

if [ "$RUN_INTEGRATION" = true ]; then
    echo ""
    echo "📋 运行集成测试..."
    npm test -- --run tests/integration.test.ts
else
    echo ""
    echo "⏭️  跳过集成测试（需要API密钥）"
fi

echo ""
echo "================================"
echo "测试完成！"
echo ""
echo "查看详细报告: tests/TEST_REPORT.md"
echo "================================"