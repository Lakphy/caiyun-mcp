# 测试套件说明

这是彩云天气MCP服务器的完整测试套件，使用 Vitest 测试框架。

## 快速开始

```bash
# 安装依赖
pnpm install

# 运行所有测试
pnpm test

# 运行并观察文件变化
pnpm test -- --watch
```

## 测试文件

### 单元测试（无需API密钥）
- `index.test.ts` - 核心服务器功能测试
- `tools.test.ts` - 所有天气工具的详细测试
- `mcp-server-simple.test.ts` - MCP协议和服务器测试
- `prompts.test.ts` - Prompt系统基础测试

### 集成测试（需要API密钥）
- `integration-live.test.ts` - 实际API调用测试

## 测试命令

```bash
# 运行所有单元测试
pnpm test -- --run tests/index.test.ts tests/tools.test.ts tests/mcp-server-simple.test.ts tests/prompts.test.ts

# 运行集成测试（需要设置 CAIYUN_API_TOKEN）
CAIYUN_API_TOKEN=your_token pnpm test tests/integration-live.test.ts

# 生成测试覆盖率报告
pnpm test -- --coverage

# 使用UI界面查看测试
pnpm test -- --ui
```

## 文档

- `TEST_SUMMARY.md` - 测试总结和状态
- `TEST_REPORT.md` - 详细测试报告
- `USAGE_EXAMPLES.md` - API使用示例和场景

## 注意事项

1. 单元测试使用mock数据，不需要网络连接
2. 集成测试需要有效的彩云API密钥
3. MaxListenersExceededWarning警告可以忽略，不影响测试运行