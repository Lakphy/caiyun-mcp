/**
 * 综合天气信息工具
 * 获取指定位置的一站式综合天气信息
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const comprehensiveWeatherTool: ToolConfig = {
  endpoint: "weather",
  description:
    "获取指定位置的一站式综合天气信息。整合实时天气、小时级预报、天级预报、分钟级降水、预警信息于一次调用。包含完整的天气数据：当前状况、短中长期预报、降水预测、生活指数、空气质量、官方预警等。可自定义预报时长、语言、单位制。最适合需要全面天气信息的应用场景，减少API调用次数。数据来源：彩云天气API v2.6综合天气接口。",
  options: {
    lang: true,
    unit: true,
    hourlysteps: true,
    dailysteps: true,
    alert: true,
  },
  schema: createInputSchema({
    lang: true,
    unit: true,
    hourlysteps: true,
    dailysteps: true,
    alert: true,
  }),
};