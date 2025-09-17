# 项目架构说明

## 📁 项目结构

```
src/
├── index.ts                    # 主入口文件，MCP Server实现
├── types.ts                    # 类型定义文件
├── tools/                      # 工具模块目录
│   ├── base.ts                 # 基础工具配置和接口
│   ├── index.ts                # 工具汇总导出
│   ├── realtime-weather.ts     # 实时天气工具
│   ├── minutely-precipitation.ts # 分钟级降水工具
│   ├── hourly-forecast.ts      # 小时级预报工具
│   ├── daily-forecast.ts       # 天级预报工具
│   ├── weather-alerts.ts       # 天气预警工具
│   └── comprehensive-weather.ts # 综合天气工具
├── prompts/                    # 提示词模块（预留）
│   ├── index.ts                # 提示词导出
│   └── README.md               # 提示词模块说明
└── resources/                  # 资源模块（预留）
    ├── index.ts                # 资源导出
    └── README.md               # 资源模块说明
```

## 🎯 重构目标

本次重构的主要目标是将原本集中在单个文件中的工具配置拆分为模块化的结构：

1. **模块化拆分** - 每个工具独立一个文件，便于维护和扩展
2. **清晰的文件夹结构** - 按功能模块组织代码
3. **可扩展性** - 为未来的prompt和resource功能预留空间
4. **代码复用** - 抽取公共配置到base.ts中

## 📋 模块说明

### 🛠️ tools/ 工具模块

负责管理所有彩云天气API相关的MCP工具：

#### base.ts - 基础配置
- 定义工具配置接口 (`ToolConfig`, `ToolOptions`)
- 提供公共类型定义 (`JsonSchema`, `Endpoint`, `ToolName`)
- 实现参数Schema生成函数 (`createInputSchema`)
- 管理默认值常量

#### 各工具文件
每个工具文件包含一个特定API端点的配置：
- **realtime-weather.ts** - 实时天气查询
- **minutely-precipitation.ts** - 分钟级降水预报
- **hourly-forecast.ts** - 小时级天气预报
- **daily-forecast.ts** - 天级天气预报
- **weather-alerts.ts** - 天气预警查询
- **comprehensive-weather.ts** - 综合天气信息

#### index.ts - 工具汇总
- 导出所有工具配置
- 提供工具配置映射表 (`TOOL_CONFIGS`)
- 提供辅助函数 (`getToolConfig`, `hasToolConfig`)

### 💬 prompts/ 提示词模块（预留）

预留用于存储和管理MCP服务的提示词配置：
- 系统提示词
- 用户交互提示词
- 错误消息模板
- 多语言提示词

### 📦 resources/ 资源模块（预留）

预留用于存储和管理MCP服务的资源文件：
- 静态数据（城市坐标、地区代码等）
- 地理数据（行政区划、地理边界等）
- UI资源（天气图标、主题配置等）
- 配置模板

## 🔄 主要变化

### 重构前
```typescript
// src/index.ts (单文件，~600行代码)
export const TOOL_CONFIGS: Record<ToolName, ToolConfig> = {
  get_realtime_weather: { /* 配置 */ },
  get_minutely_precipitation: { /* 配置 */ },
  // ... 所有工具配置集中在一个对象中
};
```

### 重构后
```typescript
// src/tools/realtime-weather.ts
export const realtimeWeatherTool: ToolConfig = { /* 配置 */ };

// src/tools/index.ts
export const TOOL_CONFIGS: Record<ToolName, ToolConfig> = {
  get_realtime_weather: realtimeWeatherTool,
  // ... 从各文件导入的工具配置
};

// src/index.ts (主文件，专注MCP Server逻辑)
import { TOOL_CONFIGS } from "./tools/index.js";
```

## ✅ 重构优势

### 1. **代码组织更清晰**
- 每个工具都有独立的文件
- 功能模块按目录组织
- 职责单一，易于理解

### 2. **维护性更好**
- 修改某个工具不影响其他工具
- 添加新工具只需创建新文件
- 删除工具只需删除对应文件

### 3. **可扩展性强**
- 预留的prompts和resources模块
- 工具配置可以独立扩展
- 支持更复杂的工具配置

### 4. **代码复用**
- 公共配置抽取到base.ts
- 避免重复的参数定义
- 统一的工具接口规范

### 5. **团队协作友好**
- 不同工具可以并行开发
- 减少代码冲突
- 清晰的文件边界

## 🎪 使用示例

### 添加新工具

1. 创建工具文件 `src/tools/new-tool.ts`：
```typescript
import { createInputSchema, type ToolConfig } from "./base.js";

export const newTool: ToolConfig = {
  endpoint: "new-endpoint",
  description: "新工具的详细描述",
  options: { lang: true },
  schema: createInputSchema({ lang: true }),
};
```

2. 在 `src/tools/index.ts` 中导出：
```typescript
export { newTool } from "./new-tool.js";

export const TOOL_CONFIGS: Record<ToolName, ToolConfig> = {
  // ... 现有工具
  new_tool: newTool,
};
```

### 修改现有工具

直接编辑对应的工具文件，例如修改实时天气工具：
```typescript
// src/tools/realtime-weather.ts
export const realtimeWeatherTool: ToolConfig = {
  // ... 修改配置
};
```

## 📊 代码统计

| 文件类型 | 重构前 | 重构后 | 变化 |
|---------|--------|--------|------|
| 工具配置 | 1个大文件 | 7个模块文件 | +模块化 |
| 代码行数 | ~600行 | ~400行 | -简化 |
| 文件数量 | 3个核心文件 | 12个文件 | +结构化 |
| 维护难度 | 中等 | 简单 | ↓降低 |

## 🚀 后续规划

1. **prompts模块开发**
   - 智能提示词生成
   - 多语言提示词支持
   - 场景化模板

2. **resources模块开发**
   - 城市数据库
   - 天气图标库
   - 地理服务集成

3. **工具功能增强**
   - 更多天气数据源
   - 自定义数据处理
   - 缓存策略优化

4. **开发体验优化**
   - 自动化测试覆盖
   - 文档生成工具
   - 代码质量检查

通过这次重构，项目代码结构更加清晰，为后续的功能扩展和维护打下了良好的基础。