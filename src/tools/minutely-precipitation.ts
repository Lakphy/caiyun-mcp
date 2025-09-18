/**
 * 分钟级降水预报工具  
 * 获取指定位置未来2小时的分钟级降水预报
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const minutelyPrecipitationTool: ToolConfig = {
  endpoint: "minutely",
  description:
    "获取指定位置未来2小时的分钟级降水预报。\n\n" +
    "【输入参数】经纬度(必需)、语言(可选,默认zh_CN)、单位制(可选,默认metric:v2)\n" +
    "【输出字段】\n" +
    "- 降水数组：precipitation_2h(未来2小时120个值)、precipitation(1小时60个值)，单位 mm/h\n" +
    "- 降水强度分级：无雨(<0.031)、小雨(0.031-0.25)、中雨(0.25-0.35)、大雨(0.35-0.48)、暴雨(≥0.48)\n" +
    "- 降水概率：probability数组(4个值)，每半小时降水概率(0-1)\n" +
    "- 描述信息：description(预报文字描述，如'未来两小时不会下雨')、forecast_keypoint(关键点描述)\n" +
    "- 数据源：datasource(radar=雷达数据,forecast=预报数据)\n" +
    "【数据更新】每10分钟更新\n" +
    "【覆盖范围】中国大陆地区(增值服务，企业套餐可用)\n" +
    "【适用场景】短期出行规划、户外活动决策、支付宝'下雨提醒'类功能\n" +
    "数据来源：彩云天气API v2.6分钟级降水接口",
  options: { lang: true, unit: true },
  schema: createInputSchema({ lang: true, unit: true }),
};