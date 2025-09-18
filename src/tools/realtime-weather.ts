/**
 * 实时天气查询工具
 * 获取指定位置的实时天气信息
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const realtimeWeatherTool: ToolConfig = {
  endpoint: "realtime",
  description:
    "获取指定位置的实时天气信息。\n\n" +
    "【输入参数】经纬度(必需)、语言(可选,默认zh_CN)、单位制(可选,默认metric:v2)\n" +
    "【输出字段】\n" +
    "- 基本信息：温度(-50~50°C)、湿度(0-1)、体感温度、天气现象(20种skycon代码)、云量(0-1)、气压(Pa)、能见度(0-50km)、短波辐射(W/m²)\n" +
    "- 风力信息：风速(km/h或m/s)、风向(0-360°,16方位)\n" +
    "- 降水信息：本地降水强度(mm/h)、最近降水距离(km)、数据源(radar/forecast)\n" +
    "- 空气质量：PM2.5/PM10/O3/NO2/SO2/CO浓度、国标AQI(0-500)、美标AQI、空气质量描述(优/良/轻度污染等)\n" +
    "- 生活指数：紫外线指数(0-11+,很弱到极强)、舒适度指数(0-13,闷热到极冷)\n" +
    "【数据更新】每10分钟更新\n" +
    "【覆盖范围】全球，中国大陆地区精度最高\n" +
    "数据来源：彩云天气API v2.6实时接口",
  options: { lang: true, unit: true },
  schema: createInputSchema({ lang: true, unit: true }),
};