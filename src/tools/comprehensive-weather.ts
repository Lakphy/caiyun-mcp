/**
 * 综合天气信息工具
 * 获取指定位置的一站式综合天气信息
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const comprehensiveWeatherTool: ToolConfig = {
  endpoint: "weather",
  description:
    "获取指定位置的一站式综合天气信息。\n\n" +
    "【输入参数】\n" +
    "- 必需：经纬度\n" +
    "- 可选：语言、单位制、hourlysteps(1-360)、dailysteps(1-15)、alert(是否含预警)\n" +
    "【输出结构】一次调用返回所有数据\n" +
    "{\n" +
    "  status: 'ok',\n" +
    "  api_version: 'v2.6',\n" +
    "  lang: '语言',\n" +
    "  unit: '单位制',\n" +
    "  timezone: '时区',\n" +
    "  server_time: Unix时间戳,\n" +
    "  location: [经度, 纬度],\n" +
    "  result: {\n" +
    "    alert: {...},      // 天气预警(可选)\n" +
    "    realtime: {...},   // 实时天气\n" +
    "    minutely: {...},   // 分钟级降水(2小时)\n" +
    "    hourly: {...},     // 小时级预报\n" +
    "    daily: {...},      // 天级预报\n" +
    "    forecast_keypoint: '关键描述'\n" +
    "  }\n" +
    "}\n" +
    "【包含数据】\n" +
    "- 实时：当前温度、天气、湿度、风力、AQI、生活指数等\n" +
    "- 预报：分钟/小时/天级完整预报\n" +
    "- 预警：所有生效的官方预警\n" +
    "- 描述：自然语言的天气描述\n" +
    "【优势】一次调用获取全部数据，减少网络请求，提高效率\n" +
    "【适用场景】天气APP首页、综合天气展示、智能助手、决策系统\n" +
    "数据来源：彩云天气API v2.6综合接口",
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