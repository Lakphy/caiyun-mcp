/**
 * 动态 Prompt 生成系统
 * 基于实时天气数据和用户需求,动态生成个性化的 prompt 内容
 */

import {
  CAIYUN_CONSTANTS,
  type PromptTemplate
} from './base.js';

// 导入所有天气数据类型
import type { 
  RealtimeWeather, 
  MinutelyPrecipitation,
  DailyItem,
  AlertItem 
} from '../types.js';

/**
 * 智能天气分析师 - 基于实时数据的动态分析
 */
export class IntelligentWeatherAnalyst {
  /**
   * 生成基于实时数据的分析prompt
   */
  static generateRealtimeAnalysis(data: RealtimeWeather, location?: string): PromptTemplate {
    const skyconInfo = CAIYUN_CONSTANTS.SKYCON_CODES[data.skycon];
    const aqiLevel = this.getAQILevel(data.air_quality.aqi.chn);
    const comfortLevel = this.getComfortLevel(data.temperature, data.humidity, data.wind.speed);
    const windDirectionKey = this.getWindDirection(data.wind.direction);
    const windDirection = CAIYUN_CONSTANTS.WIND_DIRECTIONS[windDirectionKey as keyof typeof CAIYUN_CONSTANTS.WIND_DIRECTIONS];

    return {
      system: `你是一位专业的天气分析师,正在为${location || '当前位置'}提供实时天气分析。

## 当前天气状况详细分析

### 基本气象要素
- **天气现象**: ${skyconInfo.icon} ${skyconInfo.name} - ${skyconInfo.description}
- **温度信息**: 
  * 实际温度: ${data.temperature}°C
  * 体感温度: ${data.apparent_temperature}°C
  * 温差分析: ${Math.abs(data.temperature - data.apparent_temperature).toFixed(1)}°C${data.apparent_temperature > data.temperature ? '偏热' : '偏凉'}
- **湿度状况**: ${(data.humidity * 100).toFixed(0)}% - ${this.getHumidityDescription(data.humidity)}
- **风力情况**: ${windDirection?.name || '未知风向'} ${data.wind.speed.toFixed(1)}m/s - ${this.getWindDescription(data.wind.speed)}
- **气压状况**: ${data.pressure.toFixed(0)}Pa - ${this.getPressureDescription(data.pressure)}
- **能见度**: ${data.visibility}km - ${this.getVisibilityDescription(data.visibility)}

### 空气质量评估
- **AQI指数**: ${data.air_quality.aqi.chn} (${aqiLevel.name}) ${aqiLevel.color}
- **健康建议**: ${aqiLevel.advice}
- **主要污染物**: PM2.5: ${data.air_quality.pm25}μg/m³, PM10: ${data.air_quality.pm10}μg/m³
- **其他污染物**: O3: ${data.air_quality.o3}μg/m³, SO2: ${data.air_quality.so2}μg/m³, NO2: ${data.air_quality.no2}μg/m³, CO: ${data.air_quality.co}mg/m³

### 舒适度评估
- **综合舒适度**: ${comfortLevel.level} (${comfortLevel.score}/5)
- **影响因素**: ${comfortLevel.factors.join(', ')}
- **改善建议**: ${comfortLevel.suggestions.join('; ')}

### 生活指数分析
- **紫外线指数**: ${data.life_index.ultraviolet.index}级 - ${data.life_index.ultraviolet.desc}
- **舒适度指数**: ${data.life_index.comfort.index}级 - ${data.life_index.comfort.desc}

## 专业分析任务
请基于以上数据提供:
1. **天气成因分析**: 解释当前天气形成的气象学原理
2. **趋势预判**: 基于当前条件判断短期天气变化趋势
3. **健康影响评估**: 对不同人群的健康影响分析
4. **生活建议**: 具体的穿衣、出行、运动建议
5. **风险提醒**: 需要注意的天气相关风险

分析时请结合专业气象知识,使用科学术语但保持通俗易懂。`
    };
  }

  /**
   * 生成降水预警分析
   */
  static generatePrecipitationAlert(data: MinutelyPrecipitation, location?: string): PromptTemplate {
    const maxIntensity = Math.max(...data.precipitation_2h);
    const maxProbability = Math.max(...data.probability);
    const precipType = this.analyzePrecipType(data.precipitation_2h);
    
    return {
      system: `你是专业的降水预报分析师,正在为${location || '当前位置'}提供精准的降水分析。

## 分钟级降水分析报告

### 降水概况
- **预报时效**: 未来120分钟分钟级精准预报
- **数据来源**: ${data.datasource} - 基于多普勒雷达回波外推
- **预报状态**: ${data.status}
- **总体描述**: ${data.description}

### 强度分析
- **最大强度**: ${maxIntensity.toFixed(1)}mm/h - ${this.getRainIntensityLevel(maxIntensity)}
- **降水类型**: ${precipType.type} - ${precipType.description}
- **持续时间**: ${this.calculateDuration(data.precipitation_2h)}分钟
- **累积降水量**: ${this.calculateAccumulation(data.precipitation_2h).toFixed(1)}mm

### 概率分析
- **最高概率**: ${maxProbability.toFixed(0)}%
- **确定性评估**: ${this.getCertaintyLevel(maxProbability)}
- **时间分布**: ${this.analyzeProbabilityDistribution(data.probability)}

### 影响评估
${this.generatePrecipitationImpacts(maxIntensity, data.precipitation_2h)}

## 专业分析任务
请基于雷达数据提供:
1. **降水机制分析**: 解释降水形成的物理过程
2. **精确时间预报**: 具体到分钟级的降水时间窗口
3. **强度变化趋势**: 降水强度的时间演变分析
4. **局地影响评估**: 对交通、生产生活的具体影响
5. **应对建议**: 基于不同强度的具体应对措施

请提供专业而实用的分析,重点关注时效性和准确性。`
    };
  }

  /**
   * 生成极端天气预警
   */
  static generateExtremeWeatherAlert(alerts: AlertItem[], location?: string): PromptTemplate {
    if (!alerts || alerts.length === 0) {
      return {
        system: `${location || '当前位置'}暂无官方天气预警信息。天气状况相对稳定,但请持续关注天气变化。`
      };
    }

    const alertSummary = alerts.map(alert => ({
      type: this.getAlertType(alert.code),
      level: this.getAlertLevel(alert.code),
      area: `${alert.province}${alert.city}${alert.county}`,
      time: alert.issuetime,
      description: alert.description.slice(0, 100) + '...'
    }));

    return {
      system: `你是专业的气象灾害预警分析师,正在分析${location || '当前位置'}的天气预警信息。

## 天气预警分析报告

### 预警概况
当前生效预警 ${alerts.length} 项:
${alertSummary.map((alert, index) => 
  `**${index + 1}. ${alert.type.icon} ${alert.type.name}${alert.level.name}预警**
   - 发布区域: ${alert.area}
   - 发布时间: ${alert.time}
   - 预警等级: ${alert.level.color} ${alert.level.name}级
   - 危害程度: ${alert.level.impact}`
).join('\n')}

### 详细预警内容
${alerts.map((alert, index) => 
  `#### 预警 ${index + 1}: ${alert.title}
  **预警代码**: ${alert.code}
  **发布单位**: ${alert.source}
  **预警区域**: ${alert.province} > ${alert.city} > ${alert.county}
  **发布时间**: ${alert.issuetime}
  **更新时间**: ${alert.latestUpdateTime}
  
  **详细内容**:
  ${alert.description}
  
  **影响分析**:
  ${this.analyzeAlertImpact(alert)}`
).join('\n\n')}

## 专业分析任务
请基于官方预警信息提供:
1. **灾害成因分析**: 解释预警天气的形成机制和发展趋势
2. **风险等级评估**: 量化分析灾害的危害程度和影响范围
3. **时空分布预测**: 预警天气的时间演变和空间分布
4. **防护措施指导**: 分人群、分行业的具体防护建议
5. **应急响应建议**: 政府和公众的应急响应策略

分析时请:
- 结合预警等级制定相应的应对策略
- 关注脆弱性人群和关键基础设施的保护
- 提供可操作的具体建议
- 评估预警的紧迫性和持续时间`
    };
  }

  /**
   * 生成季节性天气指导
   */
  static generateSeasonalGuidance(dailyData: DailyItem[], season: string): PromptTemplate {
    const temperatureTrend = this.analyzeTemperatureTrend(dailyData);
    const weatherPattern = this.analyzeWeatherPattern(dailyData);
    const lifeIndices = this.analyzeLifeIndices(dailyData);

    return {
      system: `你是专业的季节性天气顾问,专门为${season}季节提供生活和健康指导。

## ${season}季节天气分析

### 温度特征分析
${temperatureTrend.analysis}
- **平均气温**: ${temperatureTrend.average.toFixed(1)}°C
- **温度范围**: ${temperatureTrend.min.toFixed(1)}°C - ${temperatureTrend.max.toFixed(1)}°C
- **日较差**: 平均${temperatureTrend.dailyRange.toFixed(1)}°C
- **变化趋势**: ${temperatureTrend.trend}

### 天气模式分析
${weatherPattern.description}
- **主导天气**: ${weatherPattern.dominant}
- **天气变化**: ${weatherPattern.variability}
- **降水特征**: ${weatherPattern.precipitation}

### 生活指数趋势
${lifeIndices.map(index => 
  `- **${index.name}**: ${index.trend} (${index.description})`
).join('\n')}

### 季节性健康提醒
${this.getSeasonalHealthAdvice(season, temperatureTrend, weatherPattern)}

### ${season}季节生活指导原则
${this.getSeasonalLifeGuidance(season)}

## 专业咨询任务
请基于${season}季节特点提供:
1. **健康养生建议**: 基于气候特征的健康保健指导
2. **穿衣搭配方案**: 适应温度变化的着装建议
3. **饮食营养指导**: 符合季节特点的饮食建议
4. **运动健身计划**: 适合${season}季节的运动方式和时间安排
5. **生活作息调整**: 顺应自然节律的作息建议

请结合中医养生理念和现代健康科学,提供全面而实用的季节性生活指导。`
    };
  }

  // 辅助方法
  private static getAQILevel(aqi: number) {
    for (const [, info] of Object.entries(CAIYUN_CONSTANTS.AQI_LEVELS)) {
      if (aqi >= info.range[0] && aqi <= info.range[1]) {
        return { name: info.name, color: info.color, advice: info.advice };
      }
    }
    return { name: '未知', color: '#666666', advice: '数据异常,请重新查询' };
  }

  private static getComfortLevel(temp: number, humidity: number, windSpeed: number) {
    let score = 5;
    const factors = [];
    const suggestions = [];

    // 温度舒适性评估
    if (temp < 10 || temp > 32) {
      score -= 2;
      factors.push(temp < 10 ? '温度偏低' : '温度偏高');
      suggestions.push(temp < 10 ? '注意保暖' : '注意防暑');
    } else if (temp < 18 || temp > 26) {
      score -= 1;
      factors.push(temp < 18 ? '温度稍低' : '温度稍高');
    }

    // 湿度舒适性评估
    if (humidity < 0.3 || humidity > 0.7) {
      score -= 1;
      factors.push(humidity < 0.3 ? '空气干燥' : '湿度偏高');
      suggestions.push(humidity < 0.3 ? '注意补水保湿' : '注意通风除湿');
    }

    // 风速舒适性评估
    if (windSpeed > 8) {
      score -= 1;
      factors.push('风力较大');
      suggestions.push('外出注意防风');
    }

    const levels = ['很不舒适', '不舒适', '一般', '舒适', '很舒适'];
    return {
      level: levels[Math.max(0, score - 1)],
      score: Math.max(1, score),
      factors,
      suggestions
    };
  }

  private static getWindDirection(degree: number): string {
    const directions = Object.keys(CAIYUN_CONSTANTS.WIND_DIRECTIONS) as (keyof typeof CAIYUN_CONSTANTS.WIND_DIRECTIONS)[];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index] || 'N';
  }

  private static getHumidityDescription(humidity: number): string {
    if (humidity < 0.3) return '干燥';
    if (humidity < 0.6) return '适宜';
    if (humidity < 0.8) return '偏高';
    return '很潮湿';
  }

  private static getWindDescription(speed: number): string {
    if (speed < 2) return '无风或微风';
    if (speed < 5) return '轻风';
    if (speed < 8) return '和风';
    if (speed < 12) return '清风';
    return '强风';
  }

  private static getPressureDescription(pressure: number): string {
    if (pressure < 100000) return '低压';
    if (pressure < 102000) return '正常';
    return '高压';
  }

  private static getVisibilityDescription(visibility: number): string {
    if (visibility < 1) return '很差';
    if (visibility < 3) return '差';
    if (visibility < 10) return '一般';
    return '良好';
  }

  private static analyzePrecipType(precipitation: number[]) {
    const maxIntensity = Math.max(...precipitation);
    if (maxIntensity < 0.1) return { type: '无降水', description: '基本无降水' };
    if (maxIntensity < 2.5) return { type: '小雨', description: '降水强度较小,对出行影响不大' };
    if (maxIntensity < 8) return { type: '中雨', description: '中等强度降水,需要雨具' };
    if (maxIntensity < 16) return { type: '大雨', description: '降水强度较大,出行需谨慎' };
    return { type: '暴雨', description: '强降水,可能影响交通和安全' };
  }

  private static getRainIntensityLevel(intensity: number): string {
    if (intensity < 0.1) return '无降水';
    if (intensity < 2.5) return '小雨';
    if (intensity < 8) return '中雨';
    if (intensity < 16) return '大雨';
    return '暴雨';
  }

  private static calculateDuration(precipitation: number[]): number {
    return precipitation.filter(p => p > 0.1).length;
  }

  private static calculateAccumulation(precipitation: number[]): number {
    return precipitation.reduce((sum, p) => sum + p, 0) / 60; // 转换为mm
  }

  private static getCertaintyLevel(probability: number): string {
    if (probability > 80) return '很可能';
    if (probability > 60) return '较可能';
    if (probability > 40) return '可能';
    return '不确定';
  }

  private static analyzeProbabilityDistribution(probabilities: number[]): string {
    const avgProb = probabilities.reduce((sum, p) => sum + p, 0) / probabilities.length;
    const maxProb = Math.max(...probabilities);
    const maxIndex = probabilities.indexOf(maxProb);
    
    return `平均概率${avgProb.toFixed(0)}%,第${maxIndex + 1}分钟概率最高(${maxProb.toFixed(0)}%)`;
  }

  private static generatePrecipitationImpacts(maxIntensity: number, precipitation: number[]): string {
    const impacts = [];
    
    if (maxIntensity > 16) {
      impacts.push('⚠️ 可能造成城市内涝,低洼地区积水');
      impacts.push('🚗 严重影响交通,建议减速慢行');
      impacts.push('✈️ 可能影响航班起降');
    } else if (maxIntensity > 8) {
      impacts.push('🌧️ 对交通有一定影响,需要雨具');
      impacts.push('🚶 行人外出需携带雨伞');
    } else if (maxIntensity > 2.5) {
      impacts.push('☔ 轻微影响户外活动');
    }
    
    return impacts.join('\n');
  }

  private static getAlertType(code: string) {
    // 简化的预警类型识别
    const typeMap: Record<string, { name: string, icon: string }> = {
      '01': { name: '台风', icon: '🌀' },
      '02': { name: '暴雨', icon: '🌧️' },
      '03': { name: '暴雪', icon: '❄️' },
      '04': { name: '寒潮', icon: '🥶' },
      '05': { name: '大风', icon: '💨' },
      '06': { name: '沙尘暴', icon: '🌪️' },
      '07': { name: '高温', icon: '🔥' },
      '08': { name: '干旱', icon: '🌵' }
    };
    
    const typeCode = code.slice(0, 2);
    return typeMap[typeCode] || { name: '天气预警', icon: '⚠️' };
  }

  private static getAlertLevel(code: string) {
    const levelMap = {
      '04': { name: '蓝色', color: '🔵', impact: '一般' },
      '03': { name: '黄色', color: '🟡', impact: '较重' },
      '02': { name: '橙色', color: '🟠', impact: '严重' },
      '01': { name: '红色', color: '🔴', impact: '特别严重' }
    };
    
    const levelCode = code.slice(-2);
    return levelMap[levelCode as keyof typeof levelMap] || { name: '未知', color: '⚪', impact: '未知' };
  }

  private static analyzeAlertImpact(alert: AlertItem): string {
    // 基于预警描述生成影响分析
    return `基于预警内容分析,该${alert.title}可能对当地生产生活造成影响,请关注官方最新信息并做好相应防护准备。`;
  }

  private static analyzeTemperatureTrend(dailyData: DailyItem[]) {
    const temperatures = dailyData.map(d => d.temperature.avg);
    const average = temperatures.reduce((sum, t) => sum + t, 0) / temperatures.length;
    const min = Math.min(...temperatures);
    const max = Math.max(...temperatures);
    const dailyRange = dailyData.reduce((sum, d) => sum + (d.temperature.max - d.temperature.min), 0) / dailyData.length;
    
    return {
      average,
      min,
      max,
      dailyRange,
      trend: temperatures[temperatures.length - 1] > temperatures[0] ? '上升趋势' : '下降趋势',
      analysis: `未来${dailyData.length}天平均气温${average.toFixed(1)}°C,日较差${dailyRange.toFixed(1)}°C`
    };
  }

  private static analyzeWeatherPattern(dailyData: DailyItem[]) {
    const skycons = dailyData.map(d => d.skycon);
    const dominant = this.getMostFrequent(skycons);
    
    return {
      dominant: CAIYUN_CONSTANTS.SKYCON_CODES[dominant]?.name || '未知',
      description: `未来${dailyData.length}天天气以${CAIYUN_CONSTANTS.SKYCON_CODES[dominant]?.name}为主`,
      variability: '天气变化适中',
      precipitation: '降水分布不均'
    };
  }

  private static analyzeLifeIndices(dailyData: DailyItem[]) {
    // 简化的生活指数分析
    return [
      { name: '紫外线指数', trend: '中等变化', description: '注意防晒' },
      { name: '穿衣指数', trend: '随温度调整', description: '适时增减衣物' },
      { name: '洗车指数', trend: '视降水情况', description: '选择合适时机' }
    ];
  }

  private static getMostFrequent<T>(arr: T[]): T {
    const counts: Record<string, number> = {};
    arr.forEach(item => {
      const key = String(item);
      counts[key] = (counts[key] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) as T;
  }

  private static getSeasonalHealthAdvice(season: string, tempTrend: any, weather: any): string {
    const advice: Record<string, string> = {
      spring: '春季养肝,注意防风邪,适当春捂,预防过敏',
      summer: '夏季养心,注意防暑降温,适当运动,补充水分',
      autumn: '秋季养肺,注意防燥,适当进补,预防感冒',
      winter: '冬季养肾,注意保暖,适当进补,减少外出'
    };
    
    return advice[season] || '注意身体健康,适应天气变化';
  }

  private static getSeasonalLifeGuidance(season: string): string {
    const guidance: Record<string, string> = {
      spring: '春季万物复苏,适宜户外活动,但需防范过敏和气温变化',
      summer: '夏季阳光充足,适合游泳等水上运动,注意防晒和补水',
      autumn: '秋季秋高气爽,适宜登高赏景,注意早晚温差',
      winter: '冬季寒冷干燥,适合室内活动,注意保暖和通风'
    };
    
    return guidance[season] || '根据天气情况调整生活方式';
  }
}