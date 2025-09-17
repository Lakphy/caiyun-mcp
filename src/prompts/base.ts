/**
 * MCP Prompt 基础架构
 * 基于 MCP 规范 2025-06-18,为 AI 提供丰富的彩云天气知识
 */

import type { 
  PromptMessage,
  TextContent
} from '@modelcontextprotocol/sdk/types.js';

// Prompt 类型定义
export interface WeatherPrompt {
  name: string;
  description: string;
  arguments?: PromptArgument[];
}

export interface PromptArgument {
  name: string;
  description: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean';
  enum?: string[];
  default?: any;
}

export interface PromptTemplate {
  system: string;
  user?: string;
  examples?: Array<{
    input: string;
    output: string;
  }>;
}

// Prompt 类别枚举
export enum PromptCategory {
  KNOWLEDGE = 'knowledge',           // 天气知识
  ANALYSIS = 'analysis',            // 数据分析
  INTERPRETATION = 'interpretation', // 数据解读
  ADVISORY = 'advisory',            // 建议咨询
  EDUCATIONAL = 'educational',      // 教育科普
  PROFESSIONAL = 'professional'     // 专业应用
}

// 天气知识领域
export enum WeatherDomain {
  METEOROLOGY = 'meteorology',      // 气象学基础
  FORECASTING = 'forecasting',      // 天气预报
  CLIMATOLOGY = 'climatology',      // 气候学
  AIR_QUALITY = 'air_quality',      // 空气质量
  LIFE_INDICES = 'life_indices',    // 生活指数
  ALERTS = 'alerts',                // 预警系统
  APPLICATIONS = 'applications'     // 应用场景
}

// 基础 Prompt 生成器
export class WeatherPromptBuilder {
  private name: string = '';
  private description: string = '';
  private category: PromptCategory;
  private domain: WeatherDomain;
  private arguments: PromptArgument[] = [];
  private template: PromptTemplate;

  constructor(category: PromptCategory, domain: WeatherDomain) {
    this.category = category;
    this.domain = domain;
    this.template = { system: '' };
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  addArgument(arg: PromptArgument): this {
    this.arguments.push(arg);
    return this;
  }

  setTemplate(template: PromptTemplate): this {
    this.template = template;
    return this;
  }

  build(): WeatherPrompt & { 
    category: PromptCategory, 
    domain: WeatherDomain, 
    template: PromptTemplate 
  } {
    return {
      name: this.name,
      description: this.description,
      arguments: this.arguments,
      category: this.category,
      domain: this.domain,
      template: this.template
    };
  }
}

// 动态内容生成器
export class PromptContentGenerator {
  /**
   * 根据参数生成动态prompt内容
   */
  static generateContent(
    template: PromptTemplate, 
    args: Record<string, any> = {}
  ): PromptMessage[] {
    const messages: PromptMessage[] = [];

    // 系统消息转为用户消息
    if (template.system) {
      messages.push({
        role: 'user',
        content: {
          type: 'text',
          text: this.interpolate(template.system, args)
        } as TextContent
      });
    }

    // 用户消息
    if (template.user) {
      messages.push({
        role: 'user', 
        content: {
          type: 'text',
          text: this.interpolate(template.user, args)
        } as TextContent
      });
    }

    // 示例消息
    if (template.examples) {
      template.examples.forEach(example => {
        messages.push({
          role: 'user',
          content: {
            type: 'text',
            text: this.interpolate(example.input, args)
          } as TextContent
        });
        messages.push({
          role: 'assistant',
          content: {
            type: 'text', 
            text: this.interpolate(example.output, args)
          } as TextContent
        });
      });
    }

    return messages;
  }

  /**
   * 字符串插值,替换模板中的变量
   */
  private static interpolate(template: string, args: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return args[key] !== undefined ? String(args[key]) : match;
    });
  }
}

// 彩云天气特定的数据常量
export const CAIYUN_CONSTANTS = {
  // 天气现象代码及其含义
  SKYCON_CODES: {
    'CLEAR_DAY': { name: '晴天', description: '白天晴朗,云量小于10%', icon: '☀️' },
    'CLEAR_NIGHT': { name: '晴夜', description: '夜晚晴朗,云量小于10%', icon: '🌙' },
    'PARTLY_CLOUDY_DAY': { name: '多云', description: '白天多云,云量10%-90%', icon: '⛅' },
    'PARTLY_CLOUDY_NIGHT': { name: '多云', description: '夜晚多云,云量10%-90%', icon: '☁️' },
    'CLOUDY': { name: '阴天', description: '云量大于90%', icon: '☁️' },
    'LIGHT_HAZE': { name: '轻雾霾', description: '能见度1-3km,轻度污染', icon: '🌫️' },
    'MODERATE_HAZE': { name: '中雾霾', description: '能见度0.5-1km,中度污染', icon: '🌫️' },
    'HEAVY_HAZE': { name: '重雾霾', description: '能见度小于0.5km,重度污染', icon: '🌫️' },
    'LIGHT_RAIN': { name: '小雨', description: '降水强度0.1-2.5mm/h', icon: '🌧️' },
    'MODERATE_RAIN': { name: '中雨', description: '降水强度2.6-8.0mm/h', icon: '🌧️' },
    'HEAVY_RAIN': { name: '大雨', description: '降水强度8.1-15.9mm/h', icon: '🌧️' },
    'STORM_RAIN': { name: '暴雨', description: '降水强度≥16mm/h', icon: '⛈️' },
    'FOG': { name: '雾', description: '水汽凝结,能见度<1km', icon: '🌫️' },
    'LIGHT_SNOW': { name: '小雪', description: '降雪强度0.1-2.5mm/h', icon: '❄️' },
    'MODERATE_SNOW': { name: '中雪', description: '降雪强度2.6-5.0mm/h', icon: '❄️' },
    'HEAVY_SNOW': { name: '大雪', description: '降雪强度5.1-10mm/h', icon: '❄️' },
    'STORM_SNOW': { name: '暴雪', description: '降雪强度>10mm/h', icon: '❄️' },
    'DUST': { name: '浮尘', description: '远距离输送的细颗粒物', icon: '🌪️' },
    'SAND': { name: '沙尘暴', description: '强风卷起大量沙尘', icon: '🌪️' },
    'WIND': { name: '大风', description: '风力显著,无其他突出现象', icon: '💨' }
  },

  // AQI等级及健康建议
  AQI_LEVELS: {
    GOOD: { range: [0, 50], name: '优', color: '#4CAF50', advice: '空气质量令人满意,适宜各类户外活动' },
    MODERATE: { range: [51, 100], name: '良', color: '#FFEB3B', advice: '可接受,敏感人群应减少室外活动' },
    UNHEALTHY_FOR_SENSITIVE: { range: [101, 150], name: '轻度污染', color: '#FF9800', advice: '易感人群应减少户外活动' },
    UNHEALTHY: { range: [151, 200], name: '中度污染', color: '#F44336', advice: '建议减少外出,外出时佩戴口罩' },
    VERY_UNHEALTHY: { range: [201, 300], name: '重度污染', color: '#9C27B0', advice: '避免外出,关闭门窗' },
    HAZARDOUS: { range: [301, 500], name: '严重污染', color: '#795548', advice: '避免外出,佩戴专业防护口罩' }
  },

  // 风向对照表
  WIND_DIRECTIONS: {
    'N': { name: '北风', angle: 0, description: '来自北方的风' },
    'NNE': { name: '北北东风', angle: 22.5, description: '来自北北东方向的风' },
    'NE': { name: '东北风', angle: 45, description: '来自东北方向的风' },
    'ENE': { name: '东北东风', angle: 67.5, description: '来自东北东方向的风' },
    'E': { name: '东风', angle: 90, description: '来自东方的风' },
    'ESE': { name: '东南东风', angle: 112.5, description: '来自东南东方向的风' },
    'SE': { name: '东南风', angle: 135, description: '来自东南方向的风' },
    'SSE': { name: '南南东风', angle: 157.5, description: '来自南南东方向的风' },
    'S': { name: '南风', angle: 180, description: '来自南方的风' },
    'SSW': { name: '南南西风', angle: 202.5, description: '来自南南西方向的风' },
    'SW': { name: '西南风', angle: 225, description: '来自西南方向的风' },
    'WSW': { name: '西南西风', angle: 247.5, description: '来自西南西方向的风' },
    'W': { name: '西风', angle: 270, description: '来自西方的风' },
    'WNW': { name: '西北西风', angle: 292.5, description: '来自西北西方向的风' },
    'NW': { name: '西北风', angle: 315, description: '来自西北方向的风' },
    'NNW': { name: '北北西风', angle: 337.5, description: '来自北北西方向的风' }
  },

  // 生活指数类型
  LIFE_INDICES: {
    ultraviolet: { name: '紫外线指数', unit: '级', range: [1, 15], description: '紫外线辐射强度' },
    carWashing: { name: '洗车指数', unit: '级', range: [1, 5], description: '洗车适宜程度' },
    dressing: { name: '穿衣指数', unit: '级', range: [1, 8], description: '着装建议指数' },
    comfort: { name: '舒适度指数', unit: '级', range: [1, 5], description: '人体舒适感受' },
    coldRisk: { name: '感冒指数', unit: '级', range: [1, 4], description: '感冒发病风险' }
  },

  // 支持的语言
  SUPPORTED_LANGUAGES: {
    'zh_CN': '简体中文',
    'zh_TW': '繁体中文', 
    'en_US': '美式英语',
    'en_GB': '英式英语',
    'ja': '日语',
    'de': '德语',
    'fr': '法语',
    'es': '西班牙语',
    'it': '意大利语',
    'ko': '韩语',
    'ru': '俄语',
    'hi': '印地语',
    'th': '泰语',
    'vi': '越南语',
    'ar': '阿拉伯语'
  }
} as const;