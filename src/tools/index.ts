/**
 * 工具汇总导出
 * 统一导出所有彩云天气API工具配置
 */

// 导出基础类型和配置
export * from "./base.js";

// 导出各个工具
export { realtimeWeatherTool } from "./realtime-weather.js";
export { minutelyPrecipitationTool } from "./minutely-precipitation.js";
export { hourlyForecastTool } from "./hourly-forecast.js";
export { dailyForecastTool } from "./daily-forecast.js";
export { weatherAlertsTool } from "./weather-alerts.js";
export { comprehensiveWeatherTool } from "./comprehensive-weather.js";

// 导入所有工具配置
import { realtimeWeatherTool } from "./realtime-weather.js";
import { minutelyPrecipitationTool } from "./minutely-precipitation.js";
import { hourlyForecastTool } from "./hourly-forecast.js";
import { dailyForecastTool } from "./daily-forecast.js";
import { weatherAlertsTool } from "./weather-alerts.js";
import { comprehensiveWeatherTool } from "./comprehensive-weather.js";
import type { ToolConfig, ToolName } from "./base.js";

/**
 * 所有工具配置的映射表
 * 用于快速查找和管理所有可用的天气查询工具
 */
export const TOOL_CONFIGS: Record<ToolName, ToolConfig> = {
  get_realtime_weather: realtimeWeatherTool,
  get_minutely_precipitation: minutelyPrecipitationTool,
  get_hourly_forecast: hourlyForecastTool,
  get_daily_forecast: dailyForecastTool,
  get_weather_alerts: weatherAlertsTool,
  get_comprehensive_weather: comprehensiveWeatherTool,
};

/**
 * 获取所有工具名称列表
 */
export const TOOL_NAMES = Object.keys(TOOL_CONFIGS) as ToolName[];

/**
 * 获取工具配置
 * @param toolName 工具名称
 * @returns 工具配置或undefined
 */
export function getToolConfig(toolName: string): ToolConfig | undefined {
  return TOOL_CONFIGS[toolName as ToolName];
}

/**
 * 检查工具是否存在
 * @param toolName 工具名称
 * @returns 是否存在
 */
export function hasToolConfig(toolName: string): boolean {
  return toolName in TOOL_CONFIGS;
}