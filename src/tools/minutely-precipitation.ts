/**
 * 分钟级降水预报工具  
 * 获取指定位置未来2小时的分钟级降水预报
 */

import { createInputSchema, type ToolConfig } from "./base.js";

export const minutelyPrecipitationTool: ToolConfig = {
  endpoint: "minutely",
  description:
    "获取指定位置未来2小时的分钟级降水预报。提供120分钟精确降水预测，包括：每分钟降水强度(mm/h)、降水概率、降水描述、数据源信息。特别适用于短期出行规划、户外活动决策。覆盖中国大陆地区，基于雷达回波和数值预报。数据来源：彩云天气API v2.6分钟级降水接口。",
  options: { lang: true },
  schema: createInputSchema({ lang: true }),
};