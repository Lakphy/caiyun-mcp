/**
 * 天级天气预报工具
 * 获取指定位置的天级天气预报
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const dailyForecastTool: ToolConfig = {
  endpoint: "daily",
  description:
    "获取指定位置的天级天气预报(最多15天)。提供每日天气概况：最高/最低/平均温度、湿度、云量、白天/夜间天气现象、降水量、风速风向、气压、能见度、太阳辐射、空气质量、生活指数(紫外线/洗车/穿衣/舒适度/感冒指数)等。支持1-15天预报步数，默认5天。适用于中长期规划、旅游出行、生活决策。数据来源：彩云天气API v2.6天级预报接口。",
  options: { lang: true, unit: true, dailysteps: true },
  schema: createInputSchema({ lang: true, unit: true, dailysteps: true }),
};