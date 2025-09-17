# 彩云天气 MCP Server 使用示例

本文档提供了彩云天气MCP Server的详细使用示例，展示各种API接口的调用方式和返回数据格式。

## 🚀 快速开始

### 设置API令牌

```bash
# 方法1: 环境变量设置
export CAIYUN_API_TOKEN="your_api_token_here"

# 方法2: 临时设置
CAIYUN_API_TOKEN="your_api_token_here" npm start
```

### 启动MCP Server

```bash
# 开发模式
npm run dev

# 生产模式  
npm start

# 指定端口(如果需要)
PORT=3001 npm start
```

## 📍 坐标参考

### 主要城市坐标

| 城市 | 经度 | 纬度 | 示例用途 |
|------|------|------|----------|
| 🏛️ 北京 | 116.3176 | 39.9760 | 政府办公、商务出行 |
| 🏙️ 上海 | 121.4737 | 31.2304 | 金融贸易、国际会议 |
| 🌸 广州 | 113.2644 | 23.1291 | 制造业、外贸物流 |
| 🎋 深圳 | 114.0579 | 22.5431 | 科技创新、电子产业 |
| 🥟 天津 | 117.2340 | 39.3434 | 港口物流、重工业 |
| 🍜 重庆 | 106.5516 | 29.5630 | 内陆开放、汽车工业 |
| 🌶️ 成都 | 104.0761 | 30.6720 | 休闲旅游、软件服务 |
| ⛵ 青岛 | 120.3826 | 36.0985 | 海洋经济、啤酒文化 |

### GPS坐标获取技巧

```javascript
// Web端获取GPS坐标
navigator.geolocation.getCurrentPosition(
  position => {
    const lat = position.coords.latitude.toFixed(4);
    const lon = position.coords.longitude.toFixed(4);
    console.log(`纬度: ${lat}, 经度: ${lon}`);
  }
);
```

## 🛠️ API调用示例

### 1. 实时天气查询 (`get_realtime_weather`)

```json
{
  "tool": "get_realtime_weather",
  "arguments": {
    "longitude": 116.3176,
    "latitude": 39.9760,
    "lang": "zh_CN",
    "unit": "metric:v2"
  }
}
```

**响应数据结构**:
```json
{
  "status": "ok",
  "api_version": "v2.6", 
  "result": {
    "realtime": {
      "temperature": 22.5,
      "humidity": 0.65,
      "cloudrate": 0.8,
      "skycon": "CLOUDY",
      "visibility": 8.5,
      "wind": {
        "speed": 12.3,
        "direction": 225
      },
      "pressure": 101325,
      "apparent_temperature": 24.2,
      "air_quality": {
        "pm25": 35,
        "aqi": {
          "chn": 87,
          "usa": 92
        },
        "description": {
          "chn": "良",
          "usa": "Moderate"
        }
      }
    }
  }
}
```

### 2. 分钟级降水预报 (`get_minutely_precipitation`)

```json
{
  "tool": "get_minutely_precipitation", 
  "arguments": {
    "longitude": 121.4737,
    "latitude": 31.2304,
    "lang": "zh_CN"
  }
}
```

**应用场景**: 
- 🚶 短距离出行规划
- ☂️ 是否需要带伞决策
- 🏃 户外运动时机选择
- 🚗 洗车时机判断

### 3. 小时级预报 (`get_hourly_forecast`)

```json
{
  "tool": "get_hourly_forecast",
  "arguments": {
    "longitude": 113.2644,
    "latitude": 23.1291,
    "hourlysteps": 72,
    "lang": "zh_CN",
    "unit": "metric:v2"
  }
}
```

**预报步数选择指南**:
- `24` (1天): 当日详细规划
- `48` (2天): 短期出行安排  
- `72` (3天): 周末活动计划
- `120` (5天): 工作周安排
- `168` (7天): 一周趋势分析
- `360` (15天): 长期趋势参考

### 4. 天级预报 (`get_daily_forecast`)

```json
{
  "tool": "get_daily_forecast",
  "arguments": {
    "longitude": 104.0761,
    "latitude": 30.6720,
    "dailysteps": 7,
    "lang": "zh_CN",
    "unit": "metric:v2"
  }
}
```

**生活指数解读**:
```json
{
  "life_index": {
    "ultraviolet": {
      "index": 8,
      "desc": "中等强度，建议涂抹防晒霜"
    },
    "carWashing": {
      "index": 3,
      "desc": "不适宜洗车，未来24小时可能有雨"
    },
    "dressing": {
      "index": 6,
      "desc": "建议穿长袖衬衫和薄外套"
    },
    "comfort": {
      "index": 7,
      "desc": "较舒适，适宜户外活动"
    },
    "coldRisk": {
      "index": 2,
      "desc": "感冒风险较低，注意保暖"
    }
  }
}
```

### 5. 天气预警 (`get_weather_alerts`)

```json
{
  "tool": "get_weather_alerts",
  "arguments": {
    "longitude": 120.3826,
    "latitude": 36.0985,
    "lang": "zh_CN"
  }
}
```

**预警类型说明**:
- 🌀 **台风预警**: 蓝色→黄色→橙色→红色
- 🌧️ **暴雨预警**: 蓝色→黄色→橙色→红色  
- ❄️ **暴雪预警**: 蓝色→黄色→橙色→红色
- 🌪️ **大风预警**: 蓝色→黄色→橙色→红色
- 🥶 **寒潮预警**: 蓝色→黄色→橙色→红色
- 🌫️ **大雾预警**: 黄色→橙色→红色
- 🔥 **高温预警**: 黄色→橙色→红色

### 6. 综合天气信息 (`get_comprehensive_weather`)

```json
{
  "tool": "get_comprehensive_weather",
  "arguments": {
    "longitude": 114.0579,
    "latitude": 22.5431,
    "hourlysteps": 48,
    "dailysteps": 5,
    "alert": true,
    "lang": "zh_CN",
    "unit": "metric:v2"
  }
}
```

**一站式信息优势**:
- ✅ 减少API调用次数 (1次 vs 5次)
- ⚡ 提升响应速度 (单次网络请求)
- 🔄 保证数据一致性 (同一时间点数据)
- 💰 节省API配额 (降低成本)

## 🌐 多语言示例

### 英语版本
```json
{
  "tool": "get_realtime_weather",
  "arguments": {
    "longitude": 116.3176,
    "latitude": 39.9760,
    "lang": "en_US",
    "unit": "imperial"
  }
}
```

### 日语版本
```json
{
  "tool": "get_daily_forecast", 
  "arguments": {
    "longitude": 139.6917,
    "latitude": 35.6895,
    "dailysteps": 3,
    "lang": "ja",
    "unit": "metric:v2"
  }
}
```

## 📊 数据处理示例

### JavaScript数据处理

```javascript
// 温度趋势分析
function analyzeTemperatureTrend(hourlyData) {
  const temps = hourlyData.temperature.map(item => item.value);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const avgTemp = temps.reduce((a, b) => a + b) / temps.length;
  
  return {
    max: maxTemp,
    min: minTemp, 
    average: avgTemp.toFixed(1),
    range: (maxTemp - minTemp).toFixed(1)
  };
}

// 降水概率计算
function calculateRainProbability(minutelyData) {
  const probabilities = minutelyData.probability;
  const next60min = probabilities.slice(0, 60);
  const next120min = probabilities.slice(0, 120);
  
  return {
    next1hour: Math.max(...next60min),
    next2hours: Math.max(...next120min),
    avgProbability: (probabilities.reduce((a, b) => a + b) / probabilities.length).toFixed(1)
  };
}

// 空气质量等级判断
function getAQILevel(aqi) {
  if (aqi <= 50) return { level: "优", color: "green", advice: "空气质量令人满意，适宜各类户外活动" };
  if (aqi <= 100) return { level: "良", color: "yellow", advice: "可接受，敏感人群应减少室外活动" };  
  if (aqi <= 150) return { level: "轻度污染", color: "orange", advice: "易感人群应减少户外活动" };
  if (aqi <= 200) return { level: "中度污染", color: "red", advice: "建议减少外出，外出时佩戴口罩" };
  if (aqi <= 300) return { level: "重度污染", color: "purple", advice: "避免外出，关闭门窗，开启空气净化设备" };
  return { level: "严重污染", color: "maroon", advice: "避免外出，如需外出请佩戴专业防护口罩" };
}
```

### Python数据分析

```python
import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

def analyze_weather_data(weather_response):
    """分析综合天气数据"""
    data = json.loads(weather_response)
    result = data['result']
    
    # 实时数据
    realtime = result.get('realtime', {})
    current_temp = realtime.get('temperature', 0)
    current_aqi = realtime.get('air_quality', {}).get('aqi', {}).get('chn', 0)
    
    # 小时级数据处理
    hourly = result.get('hourly', {})
    if hourly:
        hourly_temps = [item['value'] for item in hourly.get('temperature', [])]
        hourly_times = [item['datetime'] for item in hourly.get('temperature', [])]
        
        # 创建DataFrame
        df_hourly = pd.DataFrame({
            'datetime': pd.to_datetime(hourly_times),
            'temperature': hourly_temps
        })
        
        # 统计分析
        temp_stats = {
            'current': current_temp,
            'next24h_max': df_hourly.head(24)['temperature'].max(),
            'next24h_min': df_hourly.head(24)['temperature'].min(),
            'trend': 'rising' if hourly_temps[1] > hourly_temps[0] else 'falling'
        }
        
        return temp_stats
    
    return {'current': current_temp, 'aqi': current_aqi}

def plot_temperature_forecast(hourly_data):
    """绘制温度预报图"""
    plt.figure(figsize=(12, 6))
    times = [item['datetime'] for item in hourly_data['temperature']]
    temps = [item['value'] for item in hourly_data['temperature']]
    
    plt.plot(times, temps, 'b-', linewidth=2, label='温度预报')
    plt.fill_between(times, temps, alpha=0.3)
    plt.title('未来48小时温度趋势')
    plt.xlabel('时间')
    plt.ylabel('温度 (°C)')
    plt.xticks(rotation=45)
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.show()
```

## ⚡ 性能优化建议

### 缓存策略
```javascript
// Redis缓存示例
const redis = require('redis');
const client = redis.createClient();

async function getCachedWeather(longitude, latitude) {
  const key = `weather:${longitude}:${latitude}`;
  const cached = await client.get(key);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 调用彩云API
  const weatherData = await callCaiyunAPI(longitude, latitude);
  
  // 缓存5分钟
  await client.setex(key, 300, JSON.stringify(weatherData));
  
  return weatherData;
}
```

### 批量查询优化
```javascript
// 批量查询多个城市天气
async function batchWeatherQuery(locations) {
  const promises = locations.map(location => 
    getCachedWeather(location.lon, location.lat)
  );
  
  try {
    const results = await Promise.all(promises);
    return results.map((data, index) => ({
      location: locations[index].name,
      weather: data
    }));
  } catch (error) {
    console.error('批量查询失败:', error);
    return [];
  }
}
```

## 🚨 错误处理最佳实践

### 常见错误类型

```javascript
// 完整的错误处理示例
async function safeWeatherQuery(longitude, latitude) {
  try {
    // 参数验证
    if (!longitude || !latitude) {
      throw new Error('经纬度参数不能为空');
    }
    
    if (longitude < -180 || longitude > 180) {
      throw new Error('经度范围应在-180到180之间');
    }
    
    if (latitude < -90 || latitude > 90) {
      throw new Error('纬度范围应在-90到90之间');
    }
    
    // API调用
    const result = await mcpClient.callTool('get_realtime_weather', {
      longitude,
      latitude,
      lang: 'zh_CN',
      unit: 'metric:v2'
    });
    
    return result;
    
  } catch (error) {
    // 错误分类处理
    if (error.code === 'TIMEOUT') {
      console.log('请求超时，请稍后重试');
      return null;
    } else if (error.code === 'RATE_LIMIT') {
      console.log('API调用频率过高，请降低调用频率');
      return null;
    } else if (error.code === 'AUTH_ERROR') {
      console.log('API令牌无效，请检查CAIYUN_API_TOKEN环境变量');
      return null;
    } else {
      console.error('未知错误:', error.message);
      return null;
    }
  }
}
```

## 🎯 实际应用场景

### 智能穿衣建议

```javascript
function getDressingAdvice(weatherData) {
  const temp = weatherData.result.realtime.temperature;
  const apparent = weatherData.result.realtime.apparent_temperature;
  const humidity = weatherData.result.realtime.humidity;
  const windSpeed = weatherData.result.realtime.wind.speed;
  
  let advice = [];
  
  // 基础温度建议
  if (apparent < 5) {
    advice.push("建议穿厚实的冬装，如羽绒服、毛衣等");
  } else if (apparent < 15) {
    advice.push("建议穿夹克、风衣或薄毛衣");
  } else if (apparent < 25) {
    advice.push("建议穿长袖衬衫或薄外套");
  } else {
    advice.push("建议穿短袖、短裤等夏装");
  }
  
  // 特殊天气建议  
  if (windSpeed > 20) {
    advice.push("风力较大，建议选择防风服装");
  }
  
  if (humidity > 0.8) {
    advice.push("湿度较高，建议选择透气性好的衣物");
  }
  
  return advice.join('；');
}
```

### 农业灌溉决策

```javascript
function getIrrigationAdvice(hourlyForecast) {
  const next24h = hourlyForecast.result.hourly.precipitation.slice(0, 24);
  const totalPrecip = next24h.reduce((sum, hour) => sum + hour.value, 0);
  
  if (totalPrecip > 10) {
    return {
      recommendation: "暂缓灌溉",
      reason: `未来24小时预计降水${totalPrecip.toFixed(1)}mm，可满足作物水分需求`,
      nextCheck: "建议24小时后重新评估"
    };
  } else if (totalPrecip > 3) {
    return {
      recommendation: "适量补充灌溉", 
      reason: `预计降水${totalPrecip.toFixed(1)}mm，可能不足以满足需求`,
      nextCheck: "建议12小时后检查土壤墒情"
    };
  } else {
    return {
      recommendation: "建议正常灌溉",
      reason: "未来24小时基本无有效降水",
      nextCheck: "建议6小时后再次确认天气变化"
    };
  }
}
```

### 物流运输规划

```javascript
function getLogisticsAdvice(routeWeatherData) {
  const risks = [];
  const recommendations = [];
  
  routeWeatherData.forEach((cityWeather, index) => {
    const weather = cityWeather.result.realtime;
    const cityName = cityWeather.cityName;
    
    // 能见度检查
    if (weather.visibility < 1) {
      risks.push(`${cityName}: 能见度极低(${weather.visibility}km)，建议暂缓发车`);
    } else if (weather.visibility < 3) {
      risks.push(`${cityName}: 能见度较低(${weather.visibility}km)，建议减速行驶`);
    }
    
    // 降水检查
    if (weather.precipitation.local.intensity > 10) {
      risks.push(`${cityName}: 强降水(${weather.precipitation.local.intensity}mm/h)，路面湿滑`);
    }
    
    // 风速检查  
    if (weather.wind.speed > 30) {
      risks.push(`${cityName}: 大风天气(${weather.wind.speed}km/h)，注意侧风影响`);
    }
  });
  
  if (risks.length === 0) {
    recommendations.push("天气条件良好，可正常运输");
  } else {
    recommendations.push("存在不利天气条件，建议:");
    recommendations.push(...risks.map(risk => `• ${risk}`));
  }
  
  return recommendations.join('\n');
}
```

## 📈 数据可视化示例

### Chart.js集成

```html
<!DOCTYPE html>
<html>
<head>
    <title>彩云天气数据可视化</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div style="width: 80%; margin: 0 auto;">
        <canvas id="temperatureChart"></canvas>
        <canvas id="aqiChart"></canvas>
    </div>
    
    <script>
        // 温度趋势图
        function renderTemperatureChart(hourlyData) {
            const ctx = document.getElementById('temperatureChart').getContext('2d');
            const labels = hourlyData.map(item => 
                new Date(item.datetime).toLocaleString('zh-CN', {
                    month: 'short', day: 'numeric', hour: '2-digit'
                })
            );
            const temperatures = hourlyData.map(item => item.value);
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '温度 (°C)',
                        data: temperatures,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '未来48小时温度趋势'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: '温度 (°C)'
                            }
                        }
                    }
                }
            });
        }
        
        // AQI仪表盘
        function renderAQIChart(aqiValue) {
            const ctx = document.getElementById('aqiChart').getContext('2d');
            
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['当前AQI', '剩余'],
                    datasets: [{
                        data: [aqiValue, Math.max(0, 300 - aqiValue)],
                        backgroundColor: [
                            getAQIColor(aqiValue),
                            '#e0e0e0'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `空气质量指数: ${aqiValue}`
                        },
                        legend: {
                            display: false
                        }
                    },
                    cutout: '70%'
                }
            });
        }
        
        function getAQIColor(aqi) {
            if (aqi <= 50) return '#4CAF50';      // 绿色-优
            if (aqi <= 100) return '#FFEB3B';     // 黄色-良
            if (aqi <= 150) return '#FF9800';     // 橙色-轻度污染
            if (aqi <= 200) return '#F44336';     // 红色-中度污染
            if (aqi <= 300) return '#9C27B0';     // 紫色-重度污染
            return '#795548';                     // 棕色-严重污染
        }
    </script>
</body>
</html>
```

---

通过以上示例，您可以充分利用彩云天气MCP Server的强大功能，为您的应用提供专业的天气数据支持。如有任何问题，请参考项目文档或提交Issue获取帮助。

🌈 **让天气数据为您的AI应用赋能！**