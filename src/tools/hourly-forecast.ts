/**
 * 小时级天气预报工具
 * 获取指定位置的小时级天气预报
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const hourlyForecastTool: ToolConfig = {
  endpoint: "hourly",
  description:
    "获取指定位置的小时级天气预报(最多360小时/15天)。\n\n" +
    "【输入参数】经纬度(必需)、语言(可选)、单位制(可选)、hourlysteps(可选,1-360小时,默认48)\n" +
    "【输出字段】每个字段为数组，包含{value,datetime}对象\n" +
    "- 温度：temperature(°C)、apparent_temperature(体感温度)\n" +
    "- 环境：humidity(湿度0-1)、cloudrate(云量0-1)、visibility(能见度km)、dswrf(短波辐射W/m²)\n" +
    "- 天气：skycon(天气现象,20种类型)、description(自然语言描述)\n" +
    "- 降水：precipitation(值:mm/h,概率:0-1)，按强度分为五级\n" +
    "- 风力：wind(speed:风速,direction:风向0-360°)\n" +
    "- 气压：pressure(Pa)，大气压强标准海平面约101325Pa\n" +
    "- 空气质量：aqi(chn/usa两种标准)、pm25/pm10/o3/no2/so2/co浓度\n" +
    "【预报精度】前24小时最准，48小时内较准，超过72小时参考性降低\n" +
    "【数据更新】每小时更新\n" +
    "【适用场景】精细化天气规划、农业生产安排、交通运输调度、户外活动安排\n" +
    "数据来源：彩云天气API v2.6小时级预报接口",
  options: { lang: true, unit: true, hourlysteps: true },
  schema: createInputSchema({ lang: true, unit: true, hourlysteps: true }),
};