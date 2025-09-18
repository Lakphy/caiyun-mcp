# 彩云天气MCP服务器使用示例

## 工具使用示例

### 1. 获取实时天气

```javascript
// 基本查询 - 北京天气
const result = await callTool("get_realtime_weather", {
  longitude: 116.3176,
  latitude: 39.9760
});

// 返回数据示例
{
  "status": "ok",
  "result": {
    "realtime": {
      "temperature": 15,          // 温度 15°C
      "humidity": 0.45,           // 湿度 45%
      "skycon": "PARTLY_CLOUDY_DAY",  // 多云
      "wind": {
        "speed": 8.5,             // 风速 8.5 km/h
        "direction": 135          // 东南风
      },
      "pressure": 101500,         // 气压
      "visibility": 12.5,         // 能见度 12.5km
      "apparent_temperature": 13, // 体感温度
      "air_quality": {
        "pm25": 45,
        "aqi": {
          "chn": 62,              // 国标AQI
          "usa": 67               // 美标AQI
        },
        "description": {
          "chn": "良",
          "usa": "Moderate"
        }
      },
      "life_index": {
        "ultraviolet": {
          "index": 3,
          "desc": "中等"
        },
        "comfort": {
          "index": 5,
          "desc": "舒适"
        }
      }
    }
  }
}
```

### 2. 获取分钟级降水预报

```javascript
// 查询未来2小时降水
const result = await callTool("get_minutely_precipitation", {
  longitude: 121.4737,
  latitude: 31.2304,
  lang: "zh_CN",
  unit: "metric:v2"
});

// 返回数据示例
{
  "status": "ok",
  "result": {
    "minutely": {
      "status": "ok",
      "datasource": "radar",
      "precipitation_2h": [0, 0, 0.1, 0.2, ...],  // 120个值
      "precipitation": [0, 0, 0.1, ...],          // 60个值
      "probability": [0.1, 0.3, 0.5, 0.2],       // 4个概率值
      "description": "未来一小时可能有小雨，建议带伞"
    },
    "forecast_keypoint": "未来一小时可能有小雨"
  }
}
```

### 3. 获取小时级预报

```javascript
// 获取未来24小时预报
const result = await callTool("get_hourly_forecast", {
  longitude: 113.2644,
  latitude: 23.1291,
  hourlysteps: 24,
  lang: "zh_CN"
});

// 返回数据示例
{
  "status": "ok",
  "result": {
    "hourly": {
      "status": "ok",
      "description": "未来24小时多云转晴",
      "temperature": [
        {"value": 28, "datetime": "2024-01-01T14:00"},
        {"value": 27, "datetime": "2024-01-01T15:00"},
        // ... 更多小时数据
      ],
      "humidity": [
        {"value": 0.65, "datetime": "2024-01-01T14:00"},
        // ...
      ],
      "precipitation": [
        {"value": 0, "probability": 0.1, "datetime": "2024-01-01T14:00"},
        // ...
      ],
      "wind": [
        {"speed": 12, "direction": 135, "datetime": "2024-01-01T14:00"},
        // ...
      ],
      "skycon": [
        {"value": "PARTLY_CLOUDY_DAY", "datetime": "2024-01-01T14:00"},
        // ...
      ]
    }
  }
}
```

### 4. 获取天级预报

```javascript
// 获取未来7天预报
const result = await callTool("get_daily_forecast", {
  longitude: 104.0665,
  latitude: 30.5728,
  dailysteps: 7
});

// 返回数据示例
{
  "status": "ok",
  "result": {
    "daily": {
      "status": "ok",
      "temperature": [
        {"max": 25, "min": 15, "avg": 20, "date": "2024-01-01"},
        {"max": 24, "min": 14, "avg": 19, "date": "2024-01-02"},
        // ... 更多天数据
      ],
      "skycon": [
        {"value": "PARTLY_CLOUDY_DAY", "date": "2024-01-01"},
        // ...
      ],
      "skycon_08h_20h": [  // 白天天气
        {"value": "CLEAR_DAY", "date": "2024-01-01"},
        // ...
      ],
      "skycon_20h_32h": [  // 夜间天气
        {"value": "CLEAR_NIGHT", "date": "2024-01-01"},
        // ...
      ],
      "life_index": {
        "ultraviolet": [
          {"index": 3, "desc": "中等", "date": "2024-01-01"},
          // ...
        ],
        "carWashing": [
          {"index": 1, "desc": "适宜", "date": "2024-01-01"},
          // ...
        ],
        "dressing": [
          {"index": 4, "desc": "温暖", "date": "2024-01-01"},
          // ...
        ],
        "comfort": [
          {"index": 5, "desc": "舒适", "date": "2024-01-01"},
          // ...
        ],
        "coldRisk": [
          {"index": 2, "desc": "较易发", "date": "2024-01-01"},
          // ...
        ]
      },
      "astro": [
        {
          "sunrise": {"time": "06:45"},
          "sunset": {"time": "18:30"},
          "date": "2024-01-01"
        },
        // ...
      ]
    }
  }
}
```

### 5. 获取天气预警

```javascript
// 查询天气预警
const result = await callTool("get_weather_alerts", {
  longitude: 116.3176,
  latitude: 39.9760,
  lang: "zh_CN"
});

// 返回数据示例（有预警时）
{
  "status": "ok",
  "result": {
    "alert": {
      "status": "ok",
      "content": [
        {
          "pubtimestamp": 1609459200,
          "alertId": "weatheralert-210101-1101000000-0502",
          "status": "预警中",
          "adcode": "110100",
          "location": "北京市",
          "province": "北京市",
          "city": "北京市",
          "county": "",
          "code": "0502",  // 05=大风, 02=黄色
          "source": "国家预警信息发布中心",
          "title": "北京市气象台发布大风黄色预警[III级/较重]",
          "description": "北京市气象台2024年1月1日10时00分发布大风黄色预警信号：预计今天下午到夜间，本市大部分地区将出现5级左右偏北风，阵风可达7、8级，请注意防范。",
          "regionId": "101010100"
        }
      ]
    }
  }
}

// 返回数据示例（无预警时）
{
  "status": "ok",
  "result": {
    "alert": {
      "status": "ok",
      "content": []  // 空数组表示无预警
    }
  }
}
```

### 6. 获取综合天气信息

```javascript
// 一次获取所有天气数据
const result = await callTool("get_comprehensive_weather", {
  longitude: 114.0579,
  latitude: 22.5431,
  lang: "zh_CN",
  unit: "metric:v2",
  hourlysteps: 48,
  dailysteps: 7,
  alert: true
});

// 返回数据示例
{
  "status": "ok",
  "api_version": "v2.6",
  "api_status": "active",
  "lang": "zh_CN",
  "unit": "metric:v2",
  "timezone": "Asia/Shanghai",
  "tzshift": 28800,
  "server_time": 1609459200,
  "location": [114.0579, 22.5431],
  "result": {
    "realtime": {
      // ... 实时天气数据
    },
    "minutely": {
      // ... 分钟级降水数据
    },
    "hourly": {
      // ... 小时级预报数据
    },
    "daily": {
      // ... 天级预报数据
    },
    "alert": {
      // ... 预警信息
    },
    "primary": 0,
    "forecast_keypoint": "未来两小时不会下雨，今天多云转晴"
  }
}
```

## 参数说明

### 通用参数

| 参数名 | 类型 | 必需 | 说明 | 示例 |
|--------|------|------|------|------|
| longitude | number | ✅ | 经度 (-180~180) | 116.3176 |
| latitude | number | ✅ | 纬度 (-90~90) | 39.9760 |
| lang | string | ❌ | 语言 | "zh_CN", "en_US", "ja" |
| unit | string | ❌ | 单位制 | "metric:v2", "imperial" |

### 特定工具参数

| 工具 | 参数名 | 类型 | 范围 | 默认值 | 说明 |
|------|--------|------|------|--------|------|
| get_hourly_forecast | hourlysteps | integer | 1-360 | 48 | 预报小时数 |
| get_daily_forecast | dailysteps | integer | 1-15 | 5 | 预报天数 |
| get_comprehensive_weather | alert | boolean | - | true | 是否包含预警 |

## 实际应用场景

### 场景1: 出行提醒

```javascript
// 检查是否需要带伞
async function needUmbrella(lon, lat) {
  const weather = await callTool("get_minutely_precipitation", {
    longitude: lon,
    latitude: lat
  });

  const probability = weather.result.minutely.probability;
  const maxProb = Math.max(...probability);

  if (maxProb > 0.3) {
    return "建议带伞，降水概率" + (maxProb * 100) + "%";
  }
  return "不需要带伞";
}
```

### 场景2: 穿衣建议

```javascript
// 获取穿衣建议
async function getDressingAdvice(lon, lat) {
  const weather = await callTool("get_daily_forecast", {
    longitude: lon,
    latitude: lat,
    dailysteps: 1
  });

  const today = weather.result.daily;
  const maxTemp = today.temperature[0].max;
  const minTemp = today.temperature[0].min;
  const dressing = today.life_index.dressing[0];

  return `今日温度 ${minTemp}~${maxTemp}°C，${dressing.desc}，建议${getDressingDetail(dressing.index)}`;
}

function getDressingDetail(index) {
  const suggestions = {
    0: "穿短袖短裤",
    1: "穿薄型T恤",
    2: "穿棉麻衬衫",
    3: "穿单层长袖",
    4: "穿薄毛衣",
    5: "穿夹克外套",
    6: "穿厚外套",
    7: "穿棉衣羽绒服",
    8: "穿厚棉衣"
  };
  return suggestions[index] || "根据体感调整";
}
```

### 场景3: 空气质量监测

```javascript
// 监测空气质量
async function checkAirQuality(lon, lat) {
  const weather = await callTool("get_realtime_weather", {
    longitude: lon,
    latitude: lat
  });

  const aqi = weather.result.realtime.air_quality.aqi.chn;
  const pm25 = weather.result.realtime.air_quality.pm25;
  const desc = weather.result.realtime.air_quality.description.chn;

  let advice = "";
  if (aqi > 100) {
    advice = "空气质量不佳，建议减少户外活动";
  } else if (aqi > 50) {
    advice = "空气质量良好，适合户外活动";
  } else {
    advice = "空气质量优秀，非常适合户外活动";
  }

  return {
    level: desc,
    aqi: aqi,
    pm25: pm25,
    advice: advice
  };
}
```

### 场景4: 灾害预警通知

```javascript
// 检查灾害预警
async function checkWeatherAlerts(lon, lat) {
  const alerts = await callTool("get_weather_alerts", {
    longitude: lon,
    latitude: lat
  });

  const alertContent = alerts.result.alert.content;

  if (alertContent.length === 0) {
    return { hasAlert: false, message: "当前无天气预警" };
  }

  const severeAlerts = alertContent.filter(alert => {
    const level = alert.code.substring(2);
    return level >= "03"; // 橙色及以上预警
  });

  return {
    hasAlert: true,
    total: alertContent.length,
    severe: severeAlerts.length,
    alerts: alertContent.map(a => ({
      title: a.title,
      description: a.description
    }))
  };
}
```

## 错误处理

```javascript
// 统一错误处理
async function safeCallTool(toolName, params) {
  try {
    const result = await callTool(toolName, params);

    if (result.status !== "ok") {
      console.error(`API返回错误状态: ${result.error}`);
      return null;
    }

    return result;
  } catch (error) {
    if (error.code === -32602) {
      console.error("参数错误:", error.message);
    } else if (error.code === -32603) {
      console.error("内部错误:", error.message);
    } else if (error.code === -32001) {
      console.error("请求超时");
    } else {
      console.error("未知错误:", error);
    }
    return null;
  }
}
```

## 注意事项

1. **坐标系统**: 使用WGS84坐标系（GPS坐标）
2. **更新频率**:
   - 实时数据: 每10分钟
   - 分钟级: 每10分钟
   - 小时级: 每小时
   - 天级: 每天3次
3. **配额限制**: 根据套餐有不同限制
4. **缓存建议**: 相同位置建议缓存5-10分钟
5. **分钟级降水**: 可能需要企业套餐