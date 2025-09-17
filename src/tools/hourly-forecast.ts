/**
 * 小时级天气预报工具
 * 获取指定位置的小时级天气预报
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const hourlyForecastTool: ToolConfig = {
  endpoint: "hourly",
  description:
    "获取指定位置的小时级天气预报(最多360小时/15天)。提供逐小时详细预报：温度、湿度、云量、天气现象、降水强度、风速风向、气压、能见度、太阳辐射、空气质量等。支持1-360小时预报步数自定义，默认48小时。适用于精细化天气规划、农业生产、交通出行等场景。数据来源：彩云天气API v2.6小时级预报接口。",
  options: { lang: true, unit: true, hourlysteps: true },
  schema: createInputSchema({ lang: true, unit: true, hourlysteps: true }),
};