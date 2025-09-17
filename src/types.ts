/**
 * 彩云天气API v2.6 TypeScript类型定义
 * 
 * 彩云天气是中国领先的天气服务提供商，API v2.6提供高精度的天气数据服务：
 * 
 * 📍 **覆盖范围**: 中国大陆地区，支持经纬度精确定位
 * 🌡️ **实时天气**: 温度、湿度、云量、气压、体感温度、能见度等
 * 🌧️ **降水预报**: 分钟级精准降水预测(未来2小时120分钟)
 * ⏰ **时效预报**: 小时级预报(最长360小时)、天级预报(最长15天)
 * 🚨 **官方预警**: 中国气象局发布的各类气象灾害预警信息
 * 🌬️ **空气质量**: PM2.5/PM10/O3/SO2/NO2/CO浓度，中美AQI标准
 * 📊 **生活指数**: 紫外线、洗车、穿衣、舒适度、感冒指数等
 * 🌍 **多语言**: 支持15种语言，包括中英日韩德法等
 * 📏 **多单位**: 公制、英制单位制自由切换
 * 
 * 数据来源：气象观测站、气象卫星、数值天气预报模型、雷达等
 * API版本：v2.6 (当前最新版本)
 * 文档地址：https://docs.caiyunapp.com/weather-api/v2/v2.6/
 * 
 * @version 2.6
 * @author 彩云科技
 */

/**
 * 天气现象代码 (Skycon) - 彩云天气标准天气现象分类
 * 
 * 基于云量、降水、能见度等气象要素综合判定的天气现象，
 * 支持白天/夜晚区分，提供精确的天气状态描述。
 * 
 * 🌤️ 晴天系列：CLEAR_DAY(白天晴), CLEAR_NIGHT(夜晚晴)
 * ☁️ 云量系列：PARTLY_CLOUDY_DAY/NIGHT(多云), CLOUDY(阴)
 * 🌧️ 降水系列：按强度分为LIGHT(小)、MODERATE(中)、HEAVY(大)、STORM(暴)
 * 🌨️ 降雪系列：同降水强度分级
 * 🌫️ 低能见度：FOG(雾)、HAZE系列(霾)、DUST(浮尘)、SAND(沙尘)
 * 💨 特殊天气：WIND(大风天气)
 */
export type SkyconCode =
  | "CLEAR_DAY" // 晴天 - 白天，云量<10%，能见度佳
  | "CLEAR_NIGHT" // 晴夜 - 夜晚，云量<10%，能见度佳  
  | "PARTLY_CLOUDY_DAY" // 多云 - 白天，云量10%-90%
  | "PARTLY_CLOUDY_NIGHT" // 多云 - 夜晚，云量10%-90%
  | "CLOUDY" // 阴天 - 云量>90%，无明显日夜差异
  | "LIGHT_HAZE" // 轻雾霾 - 能见度1-3km，PM2.5轻度污染
  | "MODERATE_HAZE" // 中雾霾 - 能见度0.5-1km，PM2.5中度污染  
  | "HEAVY_HAZE" // 重雾霾 - 能见度<0.5km，PM2.5重度污染
  | "LIGHT_RAIN" // 小雨 - 降水强度0.1-2.5mm/h
  | "MODERATE_RAIN" // 中雨 - 降水强度2.6-8mm/h
  | "HEAVY_RAIN" // 大雨 - 降水强度8.1-15.9mm/h
  | "STORM_RAIN" // 暴雨 - 降水强度≥16mm/h
  | "FOG" // 雾 - 水汽凝结，能见度<1km
  | "LIGHT_SNOW" // 小雪 - 降雪强度0.1-2.5mm/h(水当量)
  | "MODERATE_SNOW" // 中雪 - 降雪强度2.6-5mm/h
  | "HEAVY_SNOW" // 大雪 - 降雪强度5.1-10mm/h  
  | "STORM_SNOW" // 暴雪 - 降雪强度>10mm/h
  | "DUST" // 浮尘 - 远距离输送的细颗粒物
  | "SAND" // 沙尘暴 - 强风卷起大量沙尘
  | "WIND"; // 大风 - 风力显著，但无其他突出天气现象

/**
 * 空气质量等级 - 基于美国EPA AQI标准
 * 
 * 🟢 GOOD(优): AQI 0-50，空气质量令人满意
 * 🟡 MODERATE(良): AQI 51-100，可接受，敏感人群需注意
 * 🟠 UNHEALTHY_FOR_SENSITIVE(轻度污染): AQI 101-150，敏感人群有症状
 * 🔴 UNHEALTHY(中度污染): AQI 151-200，所有人群开始出现症状
 * 🟣 VERY_UNHEALTHY(重度污染): AQI 201-300，健康警告
 * 🟤 HAZARDOUS(严重污染): AQI 301+，紧急状况，所有人群受影响
 */
export type AQILevel =
  | "GOOD" // 优 - 空气质量令人满意，基本无空气污染
  | "MODERATE" // 良 - 空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响  
  | "UNHEALTHY_FOR_SENSITIVE" // 轻度污染 - 敏感人群症状有轻度加剧
  | "UNHEALTHY" // 中度污染 - 进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响
  | "VERY_UNHEALTHY" // 重度污染 - 心脏病和肺病患者症状显著加剧，运动耐受力降低
  | "HAZARDOUS"; // 严重污染 - 健康人群运动耐受力降低，有强烈症状

/**
 * 降水类型分类
 * 基于温度和降水相态判定
 */
export type PrecipType = 
  | "rain" // 雨 - 液态降水，地面温度>0°C
  | "snow" // 雪 - 固态降水，地面温度≤0°C  
  | "sleet"; // 雨夹雪 - 雨雪混合降水

/**
 * 16方位风向 - 基于360°划分
 * 每个方位对应22.5°扇形区域
 * 
 * 风向角度对照：
 * N(北): 348.75°-11.25°, NE(东北): 33.75°-56.25°
 * E(东): 78.75°-101.25°, SE(东南): 123.75°-146.25°  
 * S(南): 168.75°-191.25°, SW(西南): 213.75°-236.25°
 * W(西): 258.75°-281.25°, NW(西北): 303.75°-326.25°
 */
export type WindDirection =
  | "N" // 北风 - 0°
  | "NNE" // 北北东 - 22.5°
  | "NE" // 东北风 - 45°
  | "ENE" // 东北东 - 67.5°
  | "E" // 东风 - 90°
  | "ESE" // 东南东 - 112.5°
  | "SE" // 东南风 - 135°
  | "SSE" // 南南东 - 157.5°
  | "S" // 南风 - 180°
  | "SSW" // 南南西 - 202.5°
  | "SW" // 西南风 - 225°
  | "WSW" // 西南西 - 247.5°
  | "W" // 西风 - 270°
  | "WNW" // 西北西 - 292.5°
  | "NW" // 西北风 - 315°
  | "NNW"; // 北北西 - 337.5°

/**
 * 生活指数类型 - 基于气象条件的生活建议指数
 * 
 * 🌞 紫外线指数：防晒建议，1-15级
 * 🚗 洗车指数：洗车时机建议，考虑降水概率
 * 👔 穿衣指数：着装建议，基于体感温度
 * 😌 舒适度指数：人体舒适感，综合温湿度
 * 🤧 感冒指数：感冒发病风险，基于温差和湿度变化
 */
export type LifeIndexType =
  | "ultraviolet" // 紫外线指数 - UV强度，防晒等级建议
  | "carWashing" // 洗车指数 - 洗车适宜性，考虑天气条件
  | "dressing" // 穿衣指数 - 着装厚薄建议，基于体感温度
  | "comfort" // 舒适度指数 - 人体舒适感受，温湿度综合评估
  | "coldRisk"; // 感冒指数 - 感冒易感性，温差湿度影响评估

/**
 * 彩云天气API基础响应接口
 * 所有API端点返回数据的通用字段
 */
export interface BaseResponse {
  status: string; // API调用状态: "ok"表示成功
  api_version: string; // API版本号，当前为"v2.6"  
  api_status: string; // API服务状态，通常为"active"
  lang: string; // 响应语言代码，如"zh_CN"
  unit: string; // 使用的单位制，如"metric:v2"
  tzshift: number; // 时区偏移秒数，北京时间为28800(+8小时)
  timezone: string; // 时区名称，中国大陆为"Asia/Shanghai"
  server_time: number; // 服务器时间戳(Unix timestamp)
  location: number[]; // [纬度, 经度] 实际查询的位置坐标
}

// 实时天气数据
export interface RealtimeWeather {
  temperature: number; // 温度
  humidity: number; // 湿度 (0-1)
  cloudrate: number; // 云量 (0-1)
  skycon: SkyconCode; // 天气现象
  visibility: number; // 能见度 (km)
  dswrf: number; // 向下短波辐射通量 (W/m2)
  wind: {
    speed: number; // 风速 (km/h)
    direction: number; // 风向 (度)
  };
  pressure: number; // 气压 (Pa)
  apparent_temperature: number; // 体感温度
  precipitation: {
    local: {
      // 本地降水
      status: string; // 降水状态
      datasource: string; // 数据源
      intensity: number; // 降水强度 (mm/h)
    };
    nearest: {
      // 最近降水
      status: string;
      distance: number; // 距离 (km)
      intensity: number;
    };
  };
  air_quality: {
    pm25: number; // PM2.5浓度 (μg/m³)
    pm10: number; // PM10浓度 (μg/m³)
    o3: number; // 臭氧浓度 (μg/m³)
    so2: number; // 二氧化硫浓度 (μg/m³)
    no2: number; // 二氧化氮浓度 (μg/m³)
    co: number; // 一氧化碳浓度 (mg/m³)
    aqi: {
      chn: number; // 中国AQI
      usa: number; // 美国AQI
    };
    description: {
      chn: string; // 中文描述
      usa: string; // 英文描述
    };
  };
  life_index: {
    ultraviolet: {
      index: number; // 紫外线指数
      desc: string; // 描述
    };
    comfort: {
      index: number; // 舒适度指数
      desc: string;
    };
  };
}

// 分钟级降水预报
export interface MinutelyPrecipitation {
  status: string;
  description: string;
  probability: number[]; // 未来120分钟每分钟降水概率
  datasource: string;
  precipitation_2h: number[]; // 未来2小时每分钟降水强度 (mm/h)
  precipitation: number[]; // 未来1小时每分钟降水强度 (mm/h)
}

// 小时级预报单项
export interface HourlyItem {
  datetime: string; // 时间
  temperature: number; // 温度
  humidity: number; // 湿度
  cloudrate: number; // 云量
  skycon: SkyconCode; // 天气现象
  precipitation: number; // 降水强度
  wind: {
    speed: number;
    direction: number;
  };
  pressure: number; // 气压
  visibility: number; // 能见度
  dswrf: number; // 辐射
  air_quality: {
    aqi: {
      chn: number;
      usa: number;
    };
    pm25: number;
  };
}

// 天级预报单项
export interface DailyItem {
  date: string; // 日期
  temperature: {
    max: number; // 最高温度
    min: number; // 最低温度
    avg: number; // 平均温度
  };
  humidity: {
    max: number;
    min: number;
    avg: number;
  };
  cloudrate: {
    max: number;
    min: number;
    avg: number;
  };
  skycon: SkyconCode; // 白天天气现象
  skycon_08h_20h: SkyconCode; // 08-20时天气现象
  skycon_20h_32h: SkyconCode; // 20-次日08时天气现象
  precipitation: {
    max: number; // 最大降水强度
    min: number; // 最小降水强度
    avg: number; // 平均降水强度
  };
  wind: {
    max: {
      speed: number;
      direction: number;
    };
    min: {
      speed: number;
      direction: number;
    };
    avg: {
      speed: number;
      direction: number;
    };
  };
  pressure: {
    max: number;
    min: number;
    avg: number;
  };
  visibility: {
    max: number;
    min: number;
    avg: number;
  };
  dswrf: {
    max: number;
    min: number;
    avg: number;
  };
  air_quality: {
    aqi: {
      max: {
        chn: number;
        usa: number;
      };
      min: {
        chn: number;
        usa: number;
      };
      avg: {
        chn: number;
        usa: number;
      };
    };
    pm25: {
      max: number;
      min: number;
      avg: number;
    };
  };
  life_index: {
    ultraviolet: {
      index: number;
      desc: string;
    };
    carWashing: {
      index: number;
      desc: string;
    };
    dressing: {
      index: number;
      desc: string;
    };
    comfort: {
      index: number;
      desc: string;
    };
    coldRisk: {
      index: number;
      desc: string;
    };
  };
}

// 预警信息
export interface AlertItem {
  alertId: string; // 预警ID
  status: string; // 预警状态
  adcode: string; // 行政区划代码
  location: string; // 地点名称
  province: string; // 省份
  city: string; // 城市
  county: string; // 县区
  code: string; // 预警代码
  source: string; // 信息源
  title: string; // 预警标题
  description: string; // 预警内容
  regionId: string; // 区域ID
  requestStatus: string; // 请求状态
  issuetime: string; // 发布时间
  latestUpdateTime: string; // 最新更新时间
  images: string[]; // 图片URLs
}

// API响应类型
export interface RealtimeResponse extends BaseResponse {
  result: {
    realtime: RealtimeWeather;
  };
}

export interface MinutelyResponse extends BaseResponse {
  result: {
    minutely: MinutelyPrecipitation;
  };
}

export interface HourlyResponse extends BaseResponse {
  result: {
    hourly: {
      status: string;
      description: string;
      temperature: HourlyItem[];
      humidity: HourlyItem[];
      cloudrate: HourlyItem[];
      skycon: HourlyItem[];
      precipitation: HourlyItem[];
      wind: HourlyItem[];
      pressure: HourlyItem[];
      visibility: HourlyItem[];
      dswrf: HourlyItem[];
      air_quality: HourlyItem[];
    };
  };
}

export interface DailyResponse extends BaseResponse {
  result: {
    daily: {
      status: string;
      temperature: DailyItem[];
      humidity: DailyItem[];
      cloudrate: DailyItem[];
      skycon: DailyItem[];
      precipitation: DailyItem[];
      wind: DailyItem[];
      pressure: DailyItem[];
      visibility: DailyItem[];
      dswrf: DailyItem[];
      air_quality: DailyItem[];
      life_index: DailyItem[];
    };
  };
}

export interface AlertResponse extends BaseResponse {
  result: {
    alert: {
      status: string;
      content: AlertItem[];
    };
  };
}

export interface WeatherResponse extends BaseResponse {
  result: {
    realtime?: RealtimeWeather;
    minutely?: MinutelyPrecipitation;
    hourly?: HourlyResponse["result"]["hourly"];
    daily?: DailyResponse["result"]["daily"];
    alert?: AlertResponse["result"]["alert"];
  };
}

// 工具参数类型
export interface WeatherToolParams {
  longitude: number; // 经度
  latitude: number; // 纬度
  lang?: string; // 语言，默认zh_CN
  unit?: string; // 单位，默认metric:v2
  hourlysteps?: number; // 小时级预报步数，默认48
  dailysteps?: number; // 天级预报步数，默认5
  alert?: boolean; // 是否包含预警信息，默认true
}

// 错误响应
export interface ErrorResponse {
  status: string;
  error: string;
  api_status: string;
  error_code?: number;
  api_version: string;
}
