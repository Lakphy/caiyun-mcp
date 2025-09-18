/**
 * 天气预警查询工具
 * 获取指定位置的官方天气预警信息
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const weatherAlertsTool: ToolConfig = {
  endpoint: "alert",
  description:
    "获取指定位置的官方天气预警信息。\n\n" +
    "【输入参数】经纬度(必需)、语言(可选,默认zh_CN)\n" +
    "【输出字段】content数组，每个预警包含：\n" +
    "- 基本信息：alertId(唯一ID)、status(预警状态)、pubtimestamp(发布时间戳)\n" +
    "- 地点信息：adcode(区域代码)、location/province/city/county(地点分级)、latlon(坐标)\n" +
    "- 预警内容：\n" +
    "  · code(预警代码,前2位=类型,后2位=级别)\n" +
    "  · title(预警标题,如'新郑市气象台发布大雾黄色预警[III级/较重]')\n" +
    "  · description(详细描述,包含防御指南)\n" +
    "  · source(信息来源,如'国家预警信息发布中心')\n" +
    "- 预警类型(前2位代码)：\n" +
    "  01台风 02暴雨 03暴雪 04寒潮 05大风 06沙尘暴\n" +
    "  07高温 08干旱 09雷电 10冰雹 11霜冻 12大雾\n" +
    "  13霾 14道路结冰 15森林火灾 16雷雨大风\n" +
    "- 预警级别(后2位代码)：\n" +
    "  00白色(未知) 01蓝色(一般) 02黄色(较重)\n" +
    "  03橙色(严重) 04红色(特别严重)\n" +
    "【数据更新】实时更新\n" +
    "【覆盖范围】中国大陆地区\n" +
    "【适用场景】灾害预警、应急响应、公众提醒、决策支持\n" +
    "数据来源：中国气象局官方预警/彩云天气API v2.6",
  options: { lang: true },
  schema: createInputSchema({ lang: true }),
};