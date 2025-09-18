/**
 * 天级天气预报工具
 * 获取指定位置的天级天气预报
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const dailyForecastTool: ToolConfig = {
  endpoint: "daily",
  description:
    "获取指定位置的天级天气预报(最多15天)。\n\n" +
    "【输入参数】经纬度(必需)、语言(可选)、单位制(可选)、dailysteps(可选,1-15天,默认5)\n" +
    "【输出字段】每个字段为数组，包含{max,min,avg,date}结构\n" +
    "- 温度：temperature(最高/最低/平均温度°C)\n" +
    "- 环境：humidity/cloudrate/pressure/visibility/dswrf(最大/最小/平均值)\n" +
    "- 天气：skycon(主要天气)、skycon_08h_20h(白天)、skycon_20h_32h(夜间)\n" +
    "- 降水：precipitation(量:mm,概率:0-1)，分白天/夜间统计\n" +
    "- 风力：wind(最大/最小/平均风速风向)\n" +
    "- 空气质量：aqi/pm25(最大/最小/平均值)\n" +
    "- 生活指数：\n" +
    "  · ultraviolet(紫外线1-5级:最弱/弱/中等/强/很强)\n" +
    "  · carWashing(洗车1-4级:适宜/较适宜/较不适宜/不适宜)\n" +
    "  · dressing(穿衣0-8级:极热到极冷)\n" +
    "  · comfort(舒适度0-13级:闷热到干冷)\n" +
    "  · coldRisk(感冒风险1-4级:少发/较易发/易发/极易发)\n" +
    "- 天文：astro(日出日落时间)\n" +
    "【数据更新】每天更新3次(08:00,11:00,18:00)\n" +
    "【适用场景】旅游出行规划、周末活动安排、穿衣指南、健康提醒\n" +
    "数据来源：彩云天气API v2.6天级预报接口",
  options: { lang: true, unit: true, dailysteps: true },
  schema: createInputSchema({ lang: true, unit: true, dailysteps: true }),
};