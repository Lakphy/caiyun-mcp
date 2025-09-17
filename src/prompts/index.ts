/**
 * 彩云天气 MCP Prompt 系统
 * 
 * 完整的天气知识 prompt 体系,为 AI 提供丰富的气象专业知识
 * 基于 MCP 规范 2025-06-18,支持动态内容生成和个性化服务
 */

// 导出基础架构
export * from './base.js';

// 导出各类 prompt 模块
export { knowledgePrompts } from './knowledge.js';
export { analysisPrompts } from './analysis.js';
export { professionalPrompts } from './professional.js';

// 导出动态生成系统
export { IntelligentWeatherAnalyst } from './dynamic.js';

// 导出 MCP 集成
export { 
  WeatherPromptManager, 
  weatherPromptManager 
} from './mcp-integration.js';

/**
 * Prompt 系统概览
 * 
 * 🧠 **知识类 (Knowledge Prompts)**
 * - meteorologyKnowledge: 气象学专家知识
 * - airQualityKnowledge: 空气质量专业知识  
 * - forecastKnowledge: 天气预报专业知识
 * 
 * 📊 **分析类 (Analysis Prompts)**  
 * - weatherAnalysisExpert: 天气数据分析专家
 * - lifeApplicationAdvisor: 生活应用顾问
 * 
 * 🏢 **专业类 (Professional Prompts)**
 * - professionalMeteoService: 专业气象服务
 * - weatherEducationExpert: 气象教育科普专家
 * 
 * 🤖 **动态类 (Dynamic Prompts)**
 * - realtime_weather_analysis: 实时天气智能分析
 * - precipitation_alert_analysis: 降水预警分析
 * - extreme_weather_alert: 极端天气预警
 * - seasonal_life_guidance: 季节性生活指导
 * - comprehensive_weather_consultation: 综合天气咨询
 * 
 * ## 特色功能
 * 
 * ### 🎯 智能化
 * - 基于实时数据动态生成个性化 prompt
 * - 自动识别天气状况并选择合适的分析模式
 * - 结合用户特征提供定制化建议
 * 
 * ### 📚 专业化
 * - 涵盖气象学、空气质量、预报技术等专业领域
 * - 支持多种行业应用场景(农业、航空、能源等)
 * - 提供不同深度级别的知识服务
 * 
 * ### 🌍 本土化
 * - 专门针对彩云天气 API v2.6 优化
 * - 包含中国气象特色的知识内容
 * - 支持中文语境下的自然表达
 * 
 * ### 🔄 可扩展
 * - 模块化设计,便于添加新的 prompt 类型
 * - 支持自定义模板和参数
 * - 提供丰富的 API 接口
 */

// 快速访问常用 prompts
export const quickAccess = {
  // 最常用的知识类 prompts
  meteorology: 'meteorologyKnowledge',
  airQuality: 'airQualityKnowledge', 
  forecast: 'forecastKnowledge',
  
  // 最常用的应用类 prompts
  analysis: 'weatherAnalysisExpert',
  lifeAdvice: 'lifeApplicationAdvisor',
  education: 'weatherEducationExpert',
  
  // 最常用的动态 prompts
  realtimeAnalysis: 'realtime_weather_analysis',
  precipitationAlert: 'precipitation_alert_analysis',
  extremeWeatherAlert: 'extreme_weather_alert'
} as const;

/**
 * 获取推荐的 prompt 配置
 */
export function getRecommendedPrompts(scenario: string) {
  const scenarios: Record<string, string[]> = {
    // 普通用户场景
    general: [
      quickAccess.lifeAdvice,
      quickAccess.realtimeAnalysis,
      quickAccess.education
    ],
    
    // 专业用户场景  
    professional: [
      quickAccess.meteorology,
      quickAccess.forecast,
      quickAccess.analysis,
      'professionalMeteoService'
    ],
    
    // 教育场景
    education: [
      quickAccess.education,
      quickAccess.meteorology,
      quickAccess.airQuality
    ],
    
    // 应急场景
    emergency: [
      quickAccess.extremeWeatherAlert,
      quickAccess.precipitationAlert,
      quickAccess.analysis
    ]
  };
  
  return scenarios[scenario] || scenarios.general;
}