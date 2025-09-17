/**
 * MCP Prompt 集成系统
 * 将所有 prompt 功能集成到 MCP server 中
 */

import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  type PromptMessage,
} from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

import {
  PromptContentGenerator,
  type WeatherPrompt,
  type PromptTemplate
} from './base.js';

// 导入所有 prompt 模块
import { knowledgePrompts } from './knowledge.js';
import { analysisPrompts } from './analysis.js';
import { professionalPrompts } from './professional.js';
import { IntelligentWeatherAnalyst } from './dynamic.js';

/**
 * MCP Prompt 管理器
 */
export class WeatherPromptManager {
  private prompts: Map<string, WeatherPrompt & { 
    category: string, 
    domain: string, 
    template: PromptTemplate 
  }> = new Map();

  constructor() {
    this.initializePrompts();
  }

  /**
   * 初始化所有 prompts
   */
  private initializePrompts() {
    // 知识类 prompts
    Object.entries(knowledgePrompts).forEach(([key, prompt]) => {
      this.prompts.set(key, prompt);
    });

    // 分析类 prompts
    Object.entries(analysisPrompts).forEach(([key, prompt]) => {
      this.prompts.set(key, prompt);
    });

    // 专业应用类 prompts
    Object.entries(professionalPrompts).forEach(([key, prompt]) => {
      this.prompts.set(key, prompt);
    });

    // 动态生成类 prompts
    this.registerDynamicPrompts();
  }

  /**
   * 注册动态生成的 prompts
   */
  private registerDynamicPrompts() {
    // 实时天气分析 prompt
    this.prompts.set('realtime_weather_analysis', {
      name: 'realtime_weather_analysis',
      description: '基于实时天气数据生成专业的天气分析报告,包括成因分析、趋势预测和生活建议',
      arguments: [
        {
          name: 'weather_data',
          description: '实时天气数据(JSON格式)',
          type: 'string',
          required: true
        },
        {
          name: 'location',
          description: '位置名称,用于生成地区化的分析',
          type: 'string',
          required: false
        },
        {
          name: 'analysis_depth',
          description: '分析深度级别',
          type: 'string',
          enum: ['basic', 'detailed', 'professional'],
          default: 'detailed'
        }
      ],
      category: 'dynamic',
      domain: 'analysis',
      template: { system: '' } // 动态生成
    });

    // 降水预警分析 prompt
    this.prompts.set('precipitation_alert_analysis', {
      name: 'precipitation_alert_analysis',
      description: '基于分钟级降水数据生成精确的降水预警和影响分析',
      arguments: [
        {
          name: 'minutely_data',
          description: '分钟级降水数据(JSON格式)',
          type: 'string',
          required: true
        },
        {
          name: 'location',
          description: '位置名称',
          type: 'string',
          required: false
        }
      ],
      category: 'dynamic',
      domain: 'forecasting',
      template: { system: '' }
    });

    // 极端天气预警 prompt
    this.prompts.set('extreme_weather_alert', {
      name: 'extreme_weather_alert',
      description: '基于官方预警信息生成详细的极端天气分析和应对建议',
      arguments: [
        {
          name: 'alert_data',
          description: '预警数据(JSON格式)',
          type: 'string',
          required: true
        },
        {
          name: 'location',
          description: '位置名称',
          type: 'string',
          required: false
        }
      ],
      category: 'dynamic',
      domain: 'alerts',
      template: { system: '' }
    });

    // 季节性生活指导 prompt
    this.prompts.set('seasonal_life_guidance', {
      name: 'seasonal_life_guidance',
      description: '基于天气趋势数据生成季节性生活和健康指导',
      arguments: [
        {
          name: 'daily_forecast_data',
          description: '天级预报数据(JSON格式)',
          type: 'string',
          required: true
        },
        {
          name: 'season',
          description: '当前季节',
          type: 'string',
          enum: ['spring', 'summer', 'autumn', 'winter'],
          required: true
        }
      ],
      category: 'dynamic',
      domain: 'life_guidance',
      template: { system: '' }
    });

    // 综合天气咨询 prompt
    this.prompts.set('comprehensive_weather_consultation', {
      name: 'comprehensive_weather_consultation',
      description: '基于综合天气数据提供全面的天气咨询服务',
      arguments: [
        {
          name: 'comprehensive_data',
          description: '综合天气数据(JSON格式)',
          type: 'string',
          required: true
        },
        {
          name: 'consultation_type',
          description: '咨询类型',
          type: 'string',
          enum: ['health', 'travel', 'agriculture', 'business', 'general'],
          default: 'general'
        },
        {
          name: 'user_profile',
          description: '用户特征',
          type: 'string',
          enum: ['child', 'adult', 'elderly', 'pregnant', 'athlete', 'patient'],
          required: false
        }
      ],
      category: 'dynamic',
      domain: 'consultation',
      template: { system: '' }
    });
  }

  /**
   * 获取所有可用的 prompts
   */
  listPrompts() {
    return Array.from(this.prompts.values()).map(prompt => ({
      name: prompt.name,
      description: prompt.description,
      arguments: prompt.arguments || []
    }));
  }

  /**
   * 获取特定 prompt 的内容
   */
  async getPrompt(name: string, args: Record<string, any> = {}): Promise<PromptMessage[]> {
    const prompt = this.prompts.get(name);
    if (!prompt) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Prompt '${name}' not found`
      );
    }

    // 处理动态生成的 prompts
    if (prompt.category === 'dynamic') {
      return this.generateDynamicPrompt(name, args);
    }

    // 处理静态 prompts
    return PromptContentGenerator.generateContent(prompt.template, args);
  }

  /**
   * 生成动态 prompt 内容
   */
  private async generateDynamicPrompt(name: string, args: Record<string, any>): Promise<PromptMessage[]> {
    let template: PromptTemplate;

    try {
      switch (name) {
        case 'realtime_weather_analysis':
          if (!args.weather_data) {
            throw new Error('weather_data is required');
          }
          const realtimeData = JSON.parse(args.weather_data);
          template = IntelligentWeatherAnalyst.generateRealtimeAnalysis(
            realtimeData,
            args.location
          );
          break;

        case 'precipitation_alert_analysis':
          if (!args.minutely_data) {
            throw new Error('minutely_data is required');
          }
          const minutelyData = JSON.parse(args.minutely_data);
          template = IntelligentWeatherAnalyst.generatePrecipitationAlert(
            minutelyData,
            args.location
          );
          break;

        case 'extreme_weather_alert':
          if (!args.alert_data) {
            throw new Error('alert_data is required');
          }
          const alertData = JSON.parse(args.alert_data);
          template = IntelligentWeatherAnalyst.generateExtremeWeatherAlert(
            alertData,
            args.location
          );
          break;

        case 'seasonal_life_guidance':
          if (!args.daily_forecast_data || !args.season) {
            throw new Error('daily_forecast_data and season are required');
          }
          const dailyData = JSON.parse(args.daily_forecast_data);
          template = IntelligentWeatherAnalyst.generateSeasonalGuidance(
            dailyData,
            args.season
          );
          break;

        case 'comprehensive_weather_consultation':
          if (!args.comprehensive_data) {
            throw new Error('comprehensive_data is required');
          }
          // 这里可以根据 consultation_type 和 user_profile 生成不同的模板
          template = this.generateComprehensiveConsultationTemplate(args);
          break;

        default:
          throw new Error(`Unknown dynamic prompt: ${name}`);
      }

      return PromptContentGenerator.generateContent(template, args);
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to generate dynamic prompt: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 生成综合天气咨询模板
   */
  private generateComprehensiveConsultationTemplate(args: Record<string, any>): PromptTemplate {
    const consultationType = args.consultation_type || 'general';
    const userProfile = args.user_profile || 'adult';
    
    const consultationTemplates: Record<string, string> = {
      health: `你是专业的健康气象顾问,基于综合天气数据为${userProfile === 'adult' ? '成人' : userProfile}用户提供健康建议...`,
      travel: `你是专业的旅游天气顾问,基于天气数据为旅行者提供出行建议...`,
      agriculture: `你是农业气象专家,基于天气数据为农业生产提供指导...`,
      business: `你是商业气象顾问,基于天气数据为企业决策提供支持...`,
      general: `你是全面的天气咨询专家,基于综合天气数据提供生活指导...`
    };

    return {
      system: consultationTemplates[consultationType] || consultationTemplates.general
    };
  }

  /**
   * 设置 MCP server 的 prompt 处理器
   */
  setupPromptHandlers(server: Server) {
    // 列出所有可用的 prompts
    server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: this.listPrompts()
      };
    });

    // 获取特定 prompt 的内容
    server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        const messages = await this.getPrompt(name, args);
        
        return {
          description: this.prompts.get(name)?.description || '',
          messages
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to get prompt '${name}': ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  /**
   * 获取 prompt 统计信息
   */
  getPromptStats() {
    const categories: Record<string, number> = {};
    const domains: Record<string, number> = {};
    
    for (const prompt of this.prompts.values()) {
      categories[prompt.category] = (categories[prompt.category] || 0) + 1;
      domains[prompt.domain] = (domains[prompt.domain] || 0) + 1;
    }
    
    return {
      total: this.prompts.size,
      categories,
      domains,
      names: Array.from(this.prompts.keys())
    };
  }
}

// 创建全局 prompt 管理器实例
export const weatherPromptManager = new WeatherPromptManager();