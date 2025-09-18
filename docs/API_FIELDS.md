# 彩云天气API v2.6 字段详细说明

## 通用输入参数

### 必需参数
| 参数名 | 类型 | 范围 | 描述 |
|--------|------|------|------|
| `longitude` | number | -180 ~ 180 | 经度坐标 |
| `latitude` | number | -90 ~ 90 | 纬度坐标 |

### 可选参数
| 参数名 | 类型 | 默认值 | 可选值 | 描述 |
|--------|------|--------|--------|------|
| `lang` | string | zh_CN | zh_CN, zh_TW, en_US, en_GB, ja | 返回数据的语言 |
| `unit` | string | metric | metric, metric:v2, imperial | 单位制。metric:v2 会返回降水量而非降水强度 |
| `hourlysteps` | integer | 48 | 1-360 | 小时级预报步长 |
| `dailysteps` | integer | 5 | 1-15 | 天级预报步长 |
| `alert` | boolean | false | true/false | 是否返回预警信息 |

## 1. 实时天气 (realtime)

### 输出字段

#### 基本天气信息
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.realtime.status` | string | - | 数据状态 | "ok" |
| `result.realtime.temperature` | number | ℃ | 地表2米气温 | -7 |
| `result.realtime.humidity` | number | - | 相对湿度(0-1) | 0.58 |
| `result.realtime.apparent_temperature` | number | ℃ | 体感温度 | -9.9 |
| `result.realtime.skycon` | string | - | 天气现象代码 | "CLEAR_DAY" |
| `result.realtime.cloudrate` | number | - | 云量(0-1) | 0.1 |
| `result.realtime.dswrf` | number | W/m² | 短波辐射 | 320.5 |
| `result.realtime.pressure` | number | Pa | 地面气压 | 85583.47 |
| `result.realtime.visibility` | number | km | 水平能见度 | 7.8 |

#### 风力信息
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.realtime.wind.speed` | number | km/h 或 m/s | 地表10米风速 | 1.8 |
| `result.realtime.wind.direction` | number | 度 | 地表10米风向(0-360) | 22 |

#### 降水信息
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.realtime.precipitation.local.status` | string | - | 本地降水状态 | "ok" |
| `result.realtime.precipitation.local.intensity` | number | mm/h | 本地降水强度 | 0 |
| `result.realtime.precipitation.local.datasource` | string | - | 数据源 | "radar" |
| `result.realtime.precipitation.nearest.status` | string | - | 最近降水状态 | "ok" |
| `result.realtime.precipitation.nearest.distance` | number | km | 最近降水距离 | 10000 |
| `result.realtime.precipitation.nearest.intensity` | number | mm/h | 最近降水强度 | 0 |

#### 空气质量
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.realtime.air_quality.pm25` | integer | μg/m³ | PM2.5浓度 | 40 |
| `result.realtime.air_quality.pm10` | integer | μg/m³ | PM10浓度 | 56 |
| `result.realtime.air_quality.o3` | integer | μg/m³ | 臭氧浓度 | 62 |
| `result.realtime.air_quality.no2` | integer | μg/m³ | 二氧化氮浓度 | 45 |
| `result.realtime.air_quality.so2` | integer | μg/m³ | 二氧化硫浓度 | 8 |
| `result.realtime.air_quality.co` | number | mg/m³ | 一氧化碳浓度 | 0.7 |
| `result.realtime.air_quality.aqi.chn` | integer | - | 国标AQI指数 | 63 |
| `result.realtime.air_quality.aqi.usa` | integer | - | 美标AQI指数 | 68 |
| `result.realtime.air_quality.description.chn` | string | - | 国标空气质量描述 | "良" |
| `result.realtime.air_quality.description.usa` | string | - | 美标空气质量描述 | "Moderate" |

#### 生活指数
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.realtime.life_index.ultraviolet.index` | number | - | 紫外线指数(0-11+) | 3 |
| `result.realtime.life_index.ultraviolet.desc` | string | - | 紫外线强度描述 | "弱" |
| `result.realtime.life_index.comfort.index` | integer | - | 舒适度指数(0-13) | 11 |
| `result.realtime.life_index.comfort.desc` | string | - | 舒适度描述 | "湿冷" |

## 2. 分钟级降水预报 (minutely)

### 输出字段
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.minutely.status` | string | - | 数据状态 | "ok" |
| `result.minutely.datasource` | string | - | 数据源 | "radar" |
| `result.minutely.precipitation_2h` | array | mm/h | 未来2小时逐分钟降水强度(120个值) | [0.1, 0.2, ...] |
| `result.minutely.precipitation` | array | mm/h | 未来1小时逐分钟降水强度(60个值) | [0.1, 0.2, ...] |
| `result.minutely.probability` | array | - | 未来2小时每半小时降水概率(4个值，0-1) | [0.1, 0.3, 0.5, 0.2] |
| `result.minutely.description` | string | - | 预报文字描述 | "未来两小时不会下雨" |
| `result.forecast_keypoint` | string | - | 预报关键点 | "未来两小时不会下雨" |

### 降水强度等级
| 强度等级 | 范围 (mm/h) | 描述 |
|---------|-------------|------|
| 无雨/雪 | < 0.031 | 无降水 |
| 小雨/雪 | 0.031-0.25 | 轻微降水 |
| 中雨/雪 | 0.25-0.35 | 中等降水 |
| 大雨/雪 | 0.35-0.48 | 较强降水 |
| 暴雨/雪 | ≥ 0.48 | 强降水 |

## 3. 小时级预报 (hourly)

### 输出字段
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.hourly.status` | string | - | 数据状态 | "ok" |
| `result.hourly.description` | string | - | 预报描述 | "未来24小时多云" |
| `result.hourly.temperature` | array | ℃ | 逐小时温度 | [{value: 10, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.apparent_temperature` | array | ℃ | 逐小时体感温度 | [{value: 8, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.humidity` | array | - | 逐小时湿度(0-1) | [{value: 0.65, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.cloudrate` | array | - | 逐小时云量(0-1) | [{value: 0.3, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.skycon` | array | - | 逐小时天气现象 | [{value: "CLEAR_DAY", datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.visibility` | array | km | 逐小时能见度 | [{value: 10, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.dswrf` | array | W/m² | 逐小时短波辐射 | [{value: 250, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.wind` | array | - | 逐小时风速风向 | [{speed: 3.5, direction: 180, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.pressure` | array | Pa | 逐小时气压 | [{value: 101325, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.precipitation` | array | mm/h | 逐小时降水 | [{value: 0.1, probability: 0.2, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.air_quality.aqi` | array | - | 逐小时AQI | [{value: {chn: 50, usa: 55}, datetime: "2024-01-01T00:00"}, ...] |
| `result.hourly.air_quality.pm25` | array | μg/m³ | 逐小时PM2.5 | [{value: 35, datetime: "2024-01-01T00:00"}, ...] |

## 4. 天级预报 (daily)

### 输出字段
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.daily.status` | string | - | 数据状态 | "ok" |
| `result.daily.temperature` | array | ℃ | 逐日温度 | [{max: 15, min: 5, avg: 10, date: "2024-01-01"}, ...] |
| `result.daily.humidity` | array | - | 逐日湿度 | [{max: 0.8, min: 0.3, avg: 0.55, date: "2024-01-01"}, ...] |
| `result.daily.cloudrate` | array | - | 逐日云量 | [{max: 0.9, min: 0.1, avg: 0.5, date: "2024-01-01"}, ...] |
| `result.daily.pressure` | array | Pa | 逐日气压 | [{max: 102000, min: 101000, avg: 101500, date: "2024-01-01"}, ...] |
| `result.daily.visibility` | array | km | 逐日能见度 | [{max: 20, min: 5, avg: 12, date: "2024-01-01"}, ...] |
| `result.daily.dswrf` | array | W/m² | 逐日短波辐射 | [{max: 500, min: 0, avg: 250, date: "2024-01-01"}, ...] |
| `result.daily.wind` | array | - | 逐日风速风向 | [{max: {speed: 10, direction: 180}, min: {speed: 1, direction: 90}, avg: {speed: 5, direction: 135}, date: "2024-01-01"}, ...] |
| `result.daily.skycon` | array | - | 逐日主要天气 | [{value: "PARTLY_CLOUDY_DAY", date: "2024-01-01"}, ...] |
| `result.daily.skycon_08h_20h` | array | - | 白天天气(08-20时) | [{value: "CLEAR_DAY", date: "2024-01-01"}, ...] |
| `result.daily.skycon_20h_32h` | array | - | 夜间天气(20-次日08时) | [{value: "CLEAR_NIGHT", date: "2024-01-01"}, ...] |
| `result.daily.precipitation` | array | mm | 逐日降水 | [{max: 5, min: 0, avg: 2, probability: 0.3, date: "2024-01-01"}, ...] |
| `result.daily.precipitation_08h_20h` | array | mm | 白天降水 | [{max: 3, min: 0, avg: 1, probability: 0.2, date: "2024-01-01"}, ...] |
| `result.daily.precipitation_20h_32h` | array | mm | 夜间降水 | [{max: 2, min: 0, avg: 0.5, probability: 0.1, date: "2024-01-01"}, ...] |

### 天级生活指数
| 字段路径 | 类型 | 描述 | 示例值 |
|---------|------|------|--------|
| `result.daily.life_index.ultraviolet` | array | 紫外线指数 | [{index: 3, desc: "中等", date: "2024-01-01"}, ...] |
| `result.daily.life_index.carWashing` | array | 洗车指数 | [{index: 2, desc: "较适宜", date: "2024-01-01"}, ...] |
| `result.daily.life_index.dressing` | array | 穿衣指数 | [{index: 5, desc: "凉爽", date: "2024-01-01"}, ...] |
| `result.daily.life_index.comfort` | array | 舒适度指数 | [{index: 5, desc: "舒适", date: "2024-01-01"}, ...] |
| `result.daily.life_index.coldRisk` | array | 感冒指数 | [{index: 2, desc: "较易发", date: "2024-01-01"}, ...] |

### 空气质量预报
| 字段路径 | 类型 | 单位 | 描述 | 示例值 |
|---------|------|------|------|--------|
| `result.daily.air_quality.aqi` | array | - | 逐日AQI | [{max: {chn: 100, usa: 90}, min: {chn: 30, usa: 35}, avg: {chn: 65, usa: 62}, date: "2024-01-01"}, ...] |
| `result.daily.air_quality.pm25` | array | μg/m³ | 逐日PM2.5 | [{max: 75, min: 20, avg: 47, date: "2024-01-01"}, ...] |

### 日出日落和月相
| 字段路径 | 类型 | 描述 | 示例值 |
|---------|------|------|--------|
| `result.daily.astro` | array | 天文信息 | [{sunrise: {time: "06:30"}, sunset: {time: "18:00"}, date: "2024-01-01"}, ...] |

## 5. 天气预警 (alert)

### 输出字段
| 字段路径 | 类型 | 描述 | 示例值 |
|---------|------|------|--------|
| `result.alert.status` | string | 预警状态 | "ok" |
| `result.alert.content` | array | 预警内容数组 | [...] |
| `content[].pubtimestamp` | number | 发布时间戳(Unix时间) | 1609459200 |
| `content[].alertId` | string | 预警唯一标识 | "weatheralert-210101-4101840603-5402" |
| `content[].status` | string | 预警状态 | "预警中" |
| `content[].adcode` | string | 区域代码 | "410184" |
| `content[].location` | string | 具体位置 | "河南省新郑市" |
| `content[].province` | string | 省份 | "河南省" |
| `content[].city` | string | 城市 | "郑州市" |
| `content[].county` | string | 县区 | "新郑市" |
| `content[].code` | string | 预警代码(前2位:类型,后2位:级别) | "0502" |
| `content[].source` | string | 预警来源 | "国家预警信息发布中心" |
| `content[].title` | string | 预警标题 | "新郑市气象台发布大雾黄色预警[III级/较重]" |
| `content[].description` | string | 预警详细描述 | "新郑市气象台2024年1月1日06时30分发布大雾黄色预警信号..." |
| `content[].regionId` | string | 区域ID | "101180106" |
| `content[].latlon` | array | 影响区域坐标 | [34.3955, 113.7406] |
| `content[].requestStatus` | string | 请求状态 | "ok" |

### 预警类型代码
| 代码前缀 | 预警类型 |
|---------|---------|
| 01 | 台风 |
| 02 | 暴雨 |
| 03 | 暴雪 |
| 04 | 寒潮 |
| 05 | 大风 |
| 06 | 沙尘暴 |
| 07 | 高温 |
| 08 | 干旱 |
| 09 | 雷电 |
| 10 | 冰雹 |
| 11 | 霜冻 |
| 12 | 大雾 |
| 13 | 霾 |
| 14 | 道路结冰 |
| 15 | 森林火灾 |
| 16 | 雷雨大风 |

### 预警级别代码
| 代码后缀 | 预警级别 | 颜色 | 严重程度 |
|---------|---------|------|---------|
| 00 | 白色 | 白色 | 未知 |
| 01 | 蓝色 | 蓝色 | 一般 |
| 02 | 黄色 | 黄色 | 较重 |
| 03 | 橙色 | 橙色 | 严重 |
| 04 | 红色 | 红色 | 特别严重 |

## 6. 综合天气 (weather)

综合天气接口返回所有上述接口的数据组合：

### 输出字段结构
```json
{
  "status": "ok",
  "api_version": "v2.6",
  "api_status": "active",
  "lang": "zh_CN",
  "unit": "metric",
  "tzshift": 28800,
  "timezone": "Asia/Shanghai",
  "server_time": 1609459200,
  "location": [116.4074, 39.9042],
  "result": {
    "alert": {...},      // 参见天气预警字段
    "realtime": {...},   // 参见实时天气字段
    "minutely": {...},   // 参见分钟级降水字段
    "hourly": {...},     // 参见小时级预报字段
    "daily": {...},      // 参见天级预报字段
    "primary": 0,        // 主要数据标识
    "forecast_keypoint": "未来两小时不会下雨，放心出门"
  }
}
```

## 天气现象代码 (skycon)

| 代码 | 中文描述 | 英文描述 | 说明 |
|------|---------|---------|------|
| CLEAR_DAY | 晴（白天） | Clear | 云量 < 20% |
| CLEAR_NIGHT | 晴（夜间） | Clear | 云量 < 20% |
| PARTLY_CLOUDY_DAY | 多云（白天） | Partly Cloudy | 云量 20%-80% |
| PARTLY_CLOUDY_NIGHT | 多云（夜间） | Partly Cloudy | 云量 20%-80% |
| CLOUDY | 阴 | Cloudy | 云量 > 80% |
| LIGHT_HAZE | 轻度雾霾 | Light Haze | PM2.5 100-150 |
| MODERATE_HAZE | 中度雾霾 | Moderate Haze | PM2.5 150-200 |
| HEAVY_HAZE | 重度雾霾 | Heavy Haze | PM2.5 > 200 |
| LIGHT_RAIN | 小雨 | Light Rain | 降水强度 0.031-0.25 mm/h |
| MODERATE_RAIN | 中雨 | Moderate Rain | 降水强度 0.25-0.35 mm/h |
| HEAVY_RAIN | 大雨 | Heavy Rain | 降水强度 0.35-0.48 mm/h |
| STORM_RAIN | 暴雨 | Storm Rain | 降水强度 ≥ 0.48 mm/h |
| FOG | 雾 | Fog | 能见度 < 1km |
| LIGHT_SNOW | 小雪 | Light Snow | 降雪强度 0.031-0.25 mm/h |
| MODERATE_SNOW | 中雪 | Moderate Snow | 降雪强度 0.25-0.35 mm/h |
| HEAVY_SNOW | 大雪 | Heavy Snow | 降雪强度 0.35-0.48 mm/h |
| STORM_SNOW | 暴雪 | Storm Snow | 降雪强度 ≥ 0.48 mm/h |
| DUST | 浮尘 | Dust | 沙尘天气，能见度 < 10km |
| SAND | 沙尘 | Sand | 沙尘暴，能见度 < 1km |
| WIND | 大风 | Wind | 风速 > 17.2 m/s (61.2 km/h) |

## 风速等级

| 级别 | 名称 | 风速 (m/s) | 风速 (km/h) | 陆地现象 |
|------|------|------------|-------------|---------|
| 0 | 无风 | < 0.3 | < 1 | 静，烟直上 |
| 1 | 软风 | 0.3-1.5 | 1-5 | 烟示风向 |
| 2 | 轻风 | 1.6-3.3 | 6-11 | 感觉有风 |
| 3 | 微风 | 3.4-5.4 | 12-19 | 旌旗展开 |
| 4 | 和风 | 5.5-7.9 | 20-28 | 吹起尘土 |
| 5 | 清风 | 8.0-10.7 | 29-38 | 小树摇摆 |
| 6 | 强风 | 10.8-13.8 | 39-49 | 大树摇动 |
| 7 | 劲风 | 13.9-17.1 | 50-61 | 步行困难 |
| 8 | 大风 | 17.2-20.7 | 62-74 | 折毁树枝 |
| 9 | 烈风 | 20.8-24.4 | 75-88 | 屋瓦飞走 |
| 10 | 狂风 | 24.5-28.4 | 89-102 | 拔树倒屋 |
| 11 | 暴风 | 28.5-32.6 | 103-117 | 损毁严重 |
| 12-17 | 飓风 | > 32.7 | > 118 | 摧毁性破坏 |

## 风向

| 方向 | 缩写 | 角度范围 | 中心角度 |
|------|------|---------|----------|
| 北 | N | 348.75°-11.25° | 0° |
| 北东北 | NNE | 11.25°-33.75° | 22.5° |
| 东北 | NE | 33.75°-56.25° | 45° |
| 东东北 | ENE | 56.25°-78.75° | 67.5° |
| 东 | E | 78.75°-101.25° | 90° |
| 东东南 | ESE | 101.25°-123.75° | 112.5° |
| 东南 | SE | 123.75°-146.25° | 135° |
| 南东南 | SSE | 146.25°-168.75° | 157.5° |
| 南 | S | 168.75°-191.25° | 180° |
| 南西南 | SSW | 191.25°-213.75° | 202.5° |
| 西南 | SW | 213.75°-236.25° | 225° |
| 西西南 | WSW | 236.25°-258.75° | 247.5° |
| 西 | W | 258.75°-281.25° | 270° |
| 西西北 | WNW | 281.25°-303.75° | 292.5° |
| 西北 | NW | 303.75°-326.25° | 315° |
| 北西北 | NNW | 326.25°-348.75° | 337.5° |

## AQI空气质量指数

### 中国标准 (HJ633-2012)
| AQI范围 | 级别 | 类别 | 颜色 | 健康影响 |
|---------|------|------|------|---------|
| 0-50 | 一级 | 优 | 绿色 | 空气质量令人满意，基本无空气污染 |
| 51-100 | 二级 | 良 | 黄色 | 空气质量可接受，某些污染物对极少数人可能有影响 |
| 101-150 | 三级 | 轻度污染 | 橙色 | 易感人群出现症状，健康人群出现刺激症状 |
| 151-200 | 四级 | 中度污染 | 红色 | 进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响 |
| 201-300 | 五级 | 重度污染 | 紫色 | 心脏病和肺病患者症状显著加剧，运动耐受力降低 |
| >300 | 六级 | 严重污染 | 褐红色 | 健康人群运动耐受力降低，有明显强烈症状 |

### 美国标准 (EPA 454/B-18-007)
| AQI范围 | 类别 | 颜色 | 健康影响 |
|---------|------|------|---------|
| 0-50 | Good | 绿色 | 空气质量满意 |
| 51-100 | Moderate | 黄色 | 空气质量可接受 |
| 101-150 | Unhealthy for Sensitive Groups | 橙色 | 敏感人群可能受影响 |
| 151-200 | Unhealthy | 红色 | 所有人可能受影响 |
| 201-300 | Very Unhealthy | 紫色 | 健康警告 |
| >300 | Hazardous | 褐红色 | 紧急状况警告 |

## 生活指数说明

### 紫外线指数
| 指数值 | 强度 | 建议 |
|--------|------|------|
| 0-2 | 很弱 | 可以不采取防护措施 |
| 3-4 | 弱 | 建议涂擦SPF15防晒霜 |
| 5-6 | 中等 | 建议涂擦SPF20防晒霜，戴帽子 |
| 7-9 | 强 | 必须涂擦SPF30+防晒霜，戴帽子和太阳镜 |
| 10-11 | 很强 | 避免在10-14时外出，必须采取全面防护 |
| 11+ | 极强 | 尽量避免外出，必须采取全面防护措施 |

### 穿衣指数
| 指数值 | 类型 | 建议穿着 |
|--------|------|---------|
| 0-1 | 极热 | 短衣、短裤、短裙、薄型T恤衫 |
| 2 | 很热 | 棉麻面料的衬衫、薄长裙、薄T恤 |
| 3 | 热 | 单层棉麻面料的短套装、T恤衫、薄牛仔衫裤 |
| 4 | 温暖 | 单层棉麻制品的长袖衣裤、薄毛衣 |
| 5 | 凉爽 | 套装、夹衣、风衣、夹克衫、西装、薄毛衣 |
| 6 | 冷 | 厚外套、毛衣、毛套装、西装、防寒服 |
| 7 | 很冷 | 棉衣、羽绒服、冬大衣、皮夹克、毛衣再加外套 |
| 8 | 极冷 | 厚棉衣、厚羽绒服、厚皮夹克、毛皮大衣 |

### 洗车指数
| 指数值 | 等级 | 建议 |
|--------|------|------|
| 1 | 适宜 | 适宜洗车，未来持续多日无雨 |
| 2 | 较适宜 | 较适宜洗车，未来一天无雨 |
| 3 | 较不适宜 | 较不适宜洗车，未来一到两天有雨 |
| 4 | 不适宜 | 不适宜洗车，未来24小时内有雨 |

### 感冒指数
| 指数值 | 等级 | 说明 |
|--------|------|------|
| 1 | 少发 | 感冒机率较低 |
| 2 | 较易发 | 温差较大，较易感冒 |
| 3 | 易发 | 昼夜温差大，易感冒 |
| 4 | 极易发 | 温度变化大，极易感冒 |

## 错误代码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | 请求成功 | 正常返回数据 |
| 400 | Token不存在 | 请检查API密钥是否正确 |
| 401 | Token无权限 | 请检查API密钥权限 |
| 422 | 参数错误 | 请检查请求参数格式和范围 |
| 429 | Token配额耗尽 | API调用次数超限 |
| 500 | 服务器错误 | 服务器内部错误，请稍后重试 |

## 注意事项

1. **坐标系统**: 使用WGS84坐标系（GPS坐标）
2. **时区处理**: API返回的时间均为目标位置的本地时间
3. **数据更新频率**:
   - 实时数据：每10分钟更新
   - 分钟级预报：每10分钟更新
   - 小时级预报：每小时更新
   - 天级预报：每天更新3次（08:00、11:00、18:00）
4. **数据覆盖范围**: 主要覆盖中国大陆地区，部分数据支持全球
5. **配额限制**: 根据套餐不同有不同的调用次数限制
6. **缓存建议**: 建议对相同位置的请求进行适当缓存，减少API调用