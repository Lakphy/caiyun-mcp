/**
 * 天气预警查询工具
 * 获取指定位置的官方天气预警信息
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const weatherAlertsTool: ToolConfig = {
  endpoint: "alert",
  description:
    "获取指定位置的官方天气预警信息。返回当前生效的预警：预警ID、状态、行政区划、预警代码、信息源、标题、详细描述、发布时间、更新时间、预警图片等。包括台风、暴雨、暴雪、寒潮、大风、沙尘、高温、干旱等各类气象灾害预警。基于中国气象局官方预警数据。数据来源：彩云天气API v2.6预警接口。",
  options: { lang: true },
  schema: createInputSchema({ lang: true }),
};