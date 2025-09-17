/**
 * 实时天气查询工具
 * 获取指定位置的实时天气信息
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const realtimeWeatherTool: ToolConfig = {
  endpoint: "realtime",
  description: 
    "获取指定位置的实时天气信息。返回详细的当前天气状况，包括：温度(°C)、湿度(%)、云量、天气现象(skycon)、能见度(km)、风速风向、气压(Pa)、体感温度、降水信息、空气质量指数(AQI)、生活指数等。支持中国和美国AQI标准，提供多种语言和单位制选择。数据来源：彩云天气API v2.6实时接口。",
  options: { lang: true, unit: true },
  schema: createInputSchema({ lang: true, unit: true }),
};