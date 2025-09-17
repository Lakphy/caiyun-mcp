/**
 * 基础工具配置和接口定义
 */

// WeatherToolParams is used in createInputSchema function signature in comments
// import type { WeatherToolParams } from "../types.js";

export type JsonSchema = Record<string, unknown>;

export interface ToolOptions {
  lang?: boolean;
  unit?: boolean;
  hourlysteps?: boolean;
  dailysteps?: boolean;
  alert?: boolean;
}

export interface ToolConfig {
  endpoint: Endpoint;
  description: string;
  schema: JsonSchema;
  options: ToolOptions;
}

export type Endpoint =
  | "realtime"
  | "minutely"
  | "hourly"
  | "daily"
  | "alert"
  | "weather";

export type ToolName =
  | "get_realtime_weather"
  | "get_minutely_precipitation"
  | "get_hourly_forecast"
  | "get_daily_forecast"
  | "get_weather_alerts"
  | "get_comprehensive_weather";

// 默认值常量
export const DEFAULT_LANG = "zh_CN";
export const DEFAULT_UNIT = "metric:v2";
export const DEFAULT_HOURLY_STEPS = 48;
export const DEFAULT_DAILY_STEPS = 5;
export const DEFAULT_ALERT = true;

// 基础位置属性
export const baseLocationProperties = {
  longitude: {
    type: "number",
    description: "经度坐标 (-180° 到 180°)。使用WGS84坐标系，东经为正，西经为负。例如：北京116.3176，上海121.4737，广州113.2644。需要精确到小数点后4位以获得最佳精度。",
    minimum: -180,
    maximum: 180,
  },
  latitude: {
    type: "number",
    description: "纬度坐标 (-90° 到 90°)。使用WGS84坐标系，北纬为正，南纬为负。例如：北京39.9760，上海31.2304，广州23.1291。建议使用高精度GPS坐标以获得准确的天气数据。",
    minimum: -90,
    maximum: 90,
  },
} satisfies Record<string, JsonSchema>;

/**
 * 创建输入参数 Schema
 */
export function createInputSchema(options: ToolOptions): JsonSchema {
  const properties: Record<string, JsonSchema> = {
    ...baseLocationProperties,
  };

  if (options.lang) {
    properties.lang = {
      type: "string",
      description: "语言代码。支持语言：zh_CN(简体中文,默认), zh_TW(繁体中文), en_US(美式英语), en_GB(英式英语), ja(日语), de(德语), fr(法语), es(西班牙语), it(意大利语), ko(韩语), ru(俄语), hi(印地语), th(泰语), vi(越南语), ar(阿拉伯语)。该参数影响天气描述、地名、预警信息等的语言。",
      default: DEFAULT_LANG,
      enum: ["zh_CN", "zh_TW", "en_US", "en_GB", "ja", "de", "fr", "es", "it", "ko", "ru", "hi", "th", "vi", "ar"],
    };
  }

  if (options.unit) {
    properties.unit = {
      type: "string",
      description: "单位制。metric:v2(公制单位,默认): 温度°C, 速度km/h, 距离km, 气压Pa, 降水mm/h。imperial(英制单位): 温度°F, 速度mph, 距离mile, 气压inHg, 降水in/h。metric(旧版公制): 部分单位与metric:v2不同。建议使用metric:v2以获得最新的单位制支持。",
      default: DEFAULT_UNIT,
      enum: ["metric:v2", "imperial", "metric"],
    };
  }

  if (options.hourlysteps) {
    properties.hourlysteps = {
      type: "integer",
      description: "小时级预报步数(1-360小时,默认48小时)。设置预报时长：24=1天, 48=2天, 72=3天, 120=5天, 240=10天, 360=15天(最大值)。较小值适合短期精准预报，较大值适合长期趋势分析。数值越大，返回数据量越多。",
      minimum: 1,
      maximum: 360,
      default: DEFAULT_HOURLY_STEPS,
    };
  }

  if (options.dailysteps) {
    properties.dailysteps = {
      type: "integer",
      description: "天级预报步数(1-15天,默认5天)。设置预报天数：1=今天, 3=未来3天, 5=未来5天, 7=未来1周, 10=未来10天, 15=未来15天(最大值)。包含每日最高/最低/平均值、白天夜间天气、生活指数等。预报时间越长，不确定性越大。",
      minimum: 1,
      maximum: 15,
      default: DEFAULT_DAILY_STEPS,
    };
  }

  if (options.alert) {
    properties.alert = {
      type: "boolean",
      description: "是否包含官方天气预警信息(默认true)。true=返回当前生效的所有预警，包括台风、暴雨、暴雪、寒潮、大风、沙尘、高温、干旱等灾害性天气预警。false=不返回预警信息。预警数据来源于中国气象局官方发布。",
      default: DEFAULT_ALERT,
    };
  }

  return {
    type: "object",
    properties,
    required: ["longitude", "latitude"],
    additionalProperties: false,
  } satisfies JsonSchema;
}