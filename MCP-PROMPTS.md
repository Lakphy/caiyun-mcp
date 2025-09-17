# 🧠 彩云天气 MCP Prompt 系统

## 概述

本项目实现了一个完整的 MCP (Model Context Protocol) Prompt 系统，专门为彩云天气 API v2.6 设计，为 AI 提供丰富深入的气象知识和专业服务能力。

## 🎯 系统特色

### 🧠 智能化知识服务
- **动态内容生成**: 基于实时天气数据自动生成个性化分析
- **上下文感知**: 根据用户需求和天气状况选择最适合的知识模板
- **多层次深度**: 支持基础、中级、高级、专家级别的知识服务

### 📚 全方位知识覆盖
- **气象学基础**: 天气现象、物理机制、季节变化
- **空气质量**: AQI标准、污染物分析、健康防护
- **预报技术**: 数值预报、精度评估、不确定性分析
- **生活应用**: 个性化建议、健康指导、出行规划
- **专业服务**: 行业应用、风险评估、决策支持

### 🌍 本土化优势
- **中国特色**: 专门针对中国气象特点和彩云API优化
- **多语言支持**: 15种语言的国际化服务
- **地区适应**: 考虑不同地区的气候和地理特征

## 📋 Prompt 分类体系

### 🧠 知识类 (Knowledge Prompts)

#### 1. 气象学专家 (`meteorologyKnowledge`)
**功能**: 提供深度的气象学专业知识
**特点**: 
- 涵盖天气现象、气象要素、物理机制
- 支持4个深度级别 (basic/intermediate/advanced/professional)
- 结合彩云API的skycon分类系统
- 包含季节特征和地理影响分析

**示例场景**:
```javascript
// 询问体感温度原理
{
  "name": "meteorologyKnowledge",
  "arguments": {
    "topic": "体感温度",
    "level": "intermediate"
  }
}
```

#### 2. 空气质量专家 (`airQualityKnowledge`)
**功能**: 专业的空气质量知识和健康指导
**特点**:
- 详解PM2.5、PM10、O3等污染物
- 中美AQI标准对照
- 分人群健康防护建议
- 污染天气成因分析

#### 3. 天气预报专家 (`forecastKnowledge`)
**功能**: 深入解析天气预报技术和原理
**特点**:
- 数值天气预报原理
- 不同时效预报的精度特征
- 彩云API的技术特色
- 不确定性表达和风险评估

### 📊 分析类 (Analysis Prompts)

#### 1. 天气数据分析专家 (`weatherAnalysisExpert`)
**功能**: 专业的天气数据分析和解读
**特点**:
- 统计分析方法 (描述性统计、时间序列、空间分析)
- 异常值检测和数据质量控制
- 多种应用场景 (农业、城市、能源、交通)
- 定量化分析结果和可视化建议

#### 2. 生活应用顾问 (`lifeApplicationAdvisor`)
**功能**: 个性化的生活天气指导服务
**特点**:
- 分人群定制建议 (儿童、老人、孕妇等)
- 分活动类型指导 (运动、出行、健康等)
- 季节性生活建议
- 综合舒适度评估

### 🏢 专业类 (Professional Prompts)

#### 1. 专业气象服务 (`professionalMeteoService`)
**功能**: 面向各行业的专业气象服务
**特点**:
- 8大行业应用 (农业、航空、海洋、能源、建筑等)
- 风险评估与管理
- 决策支持系统
- 国际标准和技术规范

#### 2. 气象教育专家 (`weatherEducationExpert`)
**功能**: 气象科普和教育服务
**特点**:
- 分受众教学 (儿童、学生、公众、专业人士)
- 多种教学方式 (故事、互动、视觉、科学)
- 常见误区纠正
- 实验演示和数字化工具

### 🤖 动态类 (Dynamic Prompts)

#### 1. 实时天气智能分析 (`realtime_weather_analysis`)
**功能**: 基于实时数据的智能分析
**输入**: 实时天气数据JSON + 地理位置
**输出**: 
- 天气成因分析
- 趋势预判
- 健康影响评估
- 生活建议
- 风险提醒

#### 2. 降水预警分析 (`precipitation_alert_analysis`)
**功能**: 分钟级降水预警和影响分析
**输入**: 分钟级降水数据JSON
**输出**:
- 降水机制分析
- 精确时间预报
- 强度变化趋势
- 局地影响评估
- 应对建议

#### 3. 极端天气预警 (`extreme_weather_alert`)
**功能**: 基于官方预警的详细分析
**输入**: 预警数据JSON数组
**输出**:
- 灾害成因分析
- 风险等级评估
- 时空分布预测
- 防护措施指导
- 应急响应建议

#### 4. 季节性生活指导 (`seasonal_life_guidance`)
**功能**: 基于天气趋势的季节性指导
**输入**: 天级预报数据 + 季节信息
**输出**:
- 健康养生建议
- 穿衣搭配方案
- 饮食营养指导
- 运动健身计划
- 生活作息调整

#### 5. 综合天气咨询 (`comprehensive_weather_consultation`)
**功能**: 全方位天气咨询服务
**输入**: 综合天气数据 + 咨询类型 + 用户特征
**输出**: 根据咨询类型(健康/旅游/农业/商业)提供专业建议

## 🚀 使用方式

### 基础使用

```javascript
// 列出所有可用的 prompts
const prompts = await mcpClient.listPrompts();

// 获取特定 prompt
const result = await mcpClient.getPrompt('meteorologyKnowledge', {
  topic: '雷电形成',
  level: 'basic'
});
```

### 动态 Prompt 使用

```javascript
// 实时天气分析
const realtimeData = {
  temperature: 25,
  humidity: 0.65,
  skycon: 'CLOUDY',
  air_quality: { aqi: { chn: 85 } }
  // ... 其他实时数据
};

const analysis = await mcpClient.getPrompt('realtime_weather_analysis', {
  weather_data: JSON.stringify(realtimeData),
  location: '北京市',
  analysis_depth: 'detailed'
});
```

### 专业咨询使用

```javascript
// 农业气象咨询
const consultation = await mcpClient.getPrompt('comprehensive_weather_consultation', {
  comprehensive_data: JSON.stringify(weatherData),
  consultation_type: 'agriculture',
  user_profile: 'professional'
});
```

## 📈 系统统计

- **总计**: 11个专业 Prompt
- **知识类**: 3个 (气象学、空气质量、预报技术)
- **分析类**: 2个 (数据分析、生活应用)
- **专业类**: 2个 (行业服务、教育科普)
- **动态类**: 5个 (实时分析、降水预警、极端天气、季节指导、综合咨询)

## 🎨 技术架构

### 核心组件

1. **WeatherPromptBuilder**: Prompt构建器，支持链式调用
2. **PromptContentGenerator**: 动态内容生成器，支持模板变量插值
3. **IntelligentWeatherAnalyst**: 智能分析引擎，基于实时数据生成分析
4. **WeatherPromptManager**: MCP集成管理器，处理协议交互
5. **CAIYUN_CONSTANTS**: 彩云天气数据常量库

### 设计模式

- **构建者模式**: 灵活构建复杂的 Prompt 配置
- **模板方法模式**: 统一的内容生成流程
- **策略模式**: 不同场景使用不同的分析策略
- **工厂模式**: 根据输入数据动态创建分析模板

## 🔮 扩展能力

### 添加新的知识类 Prompt

```typescript
const newKnowledgePrompt = new WeatherPromptBuilder(
  PromptCategory.KNOWLEDGE,
  WeatherDomain.CUSTOM_DOMAIN
)
.setName('custom_expert')
.setDescription('自定义专家知识')
.addArgument({
  name: 'topic',
  description: '话题',
  type: 'string',
  required: true
})
.setTemplate({
  system: '你是{{topic}}方面的专家...'
})
.build();
```

### 添加新的动态 Prompt

```typescript
// 在 WeatherPromptManager 中注册
this.prompts.set('custom_analysis', {
  name: 'custom_analysis',
  description: '自定义分析',
  arguments: [/* ... */],
  category: 'dynamic',
  domain: 'custom',
  template: { system: '' }
});
```

## 🎯 应用场景

### 普通用户
- **日常生活**: 穿衣、出行、健康建议
- **科普学习**: 天气现象解释、气象知识
- **应急准备**: 极端天气预警和防护

### 专业用户
- **农业生产**: 农事活动指导、病虫害预测
- **能源管理**: 风光资源评估、负荷预测
- **交通运输**: 恶劣天气影响、路线优化
- **建筑工程**: 施工条件评估、设计参数

### 教育机构
- **课堂教学**: 气象科普、实验演示
- **科研支持**: 数据分析、论文写作
- **公众教育**: 科学传播、误区纠正

### 企业应用
- **风险管理**: 天气风险评估、保险理赔
- **决策支持**: 基于天气的商业决策
- **客户服务**: 天气相关的咨询服务

## 🌟 创新亮点

### 1. 智能化程度高
- 基于实时数据动态生成个性化内容
- 自动识别天气状况并选择合适模式
- 结合用户特征提供定制化服务

### 2. 专业性强
- 基于彩云天气API v2.6深度定制
- 涵盖气象学各个专业领域
- 符合国际和行业标准

### 3. 实用性突出
- 提供具体可操作的建议
- 考虑中国用户的实际需求
- 支持多种应用场景

### 4. 扩展性好
- 模块化设计，便于添加新功能
- 支持自定义模板和参数
- 提供丰富的API接口

### 5. 用户体验佳
- 自然语言交互
- 分层次的知识服务
- 图文并茂的科普内容

## 📝 总结

彩云天气MCP Prompt系统是一个完整的、专业的、智能的天气知识服务平台。它不仅为AI提供了丰富的气象专业知识，更重要的是建立了一套完整的知识服务框架，可以根据实际需求灵活扩展和定制。

通过这套系统，AI助手能够：
- 🧠 **理解天气**: 深入掌握气象学原理和预报技术
- 📊 **分析数据**: 专业解读天气数据，发现关键信息
- 💡 **提供建议**: 基于天气条件给出实用的生活和工作建议
- 🎓 **科普教育**: 用通俗易懂的方式传播气象科学知识
- 🏢 **专业服务**: 为各行业提供专业的气象技术支持

这套系统将大大提升AI在天气服务领域的专业能力和用户体验，为智能天气服务的发展奠定坚实基础。