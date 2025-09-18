import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { CaiyunWeatherServer, TOOL_CONFIGS } from "../src/index.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import type { WeatherToolParams } from "../src/types.js";

describe("Weather Tools Tests", () => {
  const fetchMock = vi.fn();
  let server: CaiyunWeatherServer;

  const createOkResponse = (payload: unknown) => ({
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => JSON.stringify(payload),
  });

  const createErrorResponse = (payload: unknown, status = 400) => ({
    ok: false,
    status,
    statusText: "Bad Request",
    text: async () => JSON.stringify(payload),
  });

  beforeEach(() => {
    fetchMock.mockReset();
    server = new CaiyunWeatherServer({
      token: "test-token",
      fetchImpl: fetchMock
    });
  });

  describe("Realtime Weather Tool", () => {
    const mockRealtimeResponse = {
      status: "ok",
      api_version: "v2.6",
      result: {
        realtime: {
          status: "ok",
          temperature: 25.5,
          humidity: 0.65,
          cloudrate: 0.3,
          skycon: "PARTLY_CLOUDY_DAY",
          visibility: 10,
          dswrf: 320.5,
          wind: {
            speed: 12.5,
            direction: 135
          },
          pressure: 101325,
          apparent_temperature: 27.2,
          precipitation: {
            local: {
              status: "ok",
              datasource: "radar",
              intensity: 0
            },
            nearest: {
              status: "ok",
              distance: 50,
              intensity: 0.2
            }
          },
          air_quality: {
            pm25: 35,
            pm10: 50,
            o3: 80,
            no2: 40,
            so2: 10,
            co: 0.8,
            aqi: {
              chn: 65,
              usa: 70
            },
            description: {
              chn: "良",
              usa: "Moderate"
            }
          },
          life_index: {
            ultraviolet: {
              index: 5,
              desc: "中等"
            },
            comfort: {
              index: 5,
              desc: "舒适"
            }
          }
        }
      }
    };

    it("should fetch realtime weather with default parameters", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockRealtimeResponse));

      const params: WeatherToolParams = {
        longitude: 116.3176,
        latitude: 39.9760
      };

      const result = await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_realtime_weather,
        params
      );

      expect(result).toEqual(mockRealtimeResponse);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("/116.3176,39.976/realtime");
    });

    it("should fetch realtime weather with custom language and unit", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockRealtimeResponse));

      const params: WeatherToolParams = {
        longitude: 116.3176,
        latitude: 39.9760,
        lang: "en_US",
        unit: "imperial"
      };

      await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_realtime_weather,
        params
      );

      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("lang=en_US");
      expect(requestUrl).toContain("unit=imperial");
    });

    it("should validate coordinate boundaries", () => {
      expect(() => {
        (server as any).normalizeParams(
          { longitude: 181, latitude: 40 },
          TOOL_CONFIGS.get_realtime_weather
        );
      }).toThrow(McpError);

      expect(() => {
        (server as any).normalizeParams(
          { longitude: 120, latitude: 91 },
          TOOL_CONFIGS.get_realtime_weather
        );
      }).toThrow(McpError);
    });
  });

  describe("Minutely Precipitation Tool", () => {
    const mockMinutelyResponse = {
      status: "ok",
      api_version: "v2.6",
      result: {
        minutely: {
          status: "ok",
          datasource: "radar",
          precipitation_2h: new Array(120).fill(0).map((_, i) => i < 30 ? 0.1 : 0),
          precipitation: new Array(60).fill(0).map((_, i) => i < 15 ? 0.1 : 0),
          probability: [0.2, 0.1, 0, 0],
          description: "未来两小时有小雨，一小时后雨停"
        },
        forecast_keypoint: "未来两小时有小雨，一小时后雨停"
      }
    };

    it("should fetch minutely precipitation forecast", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockMinutelyResponse));

      const params: WeatherToolParams = {
        longitude: 121.4737,
        latitude: 31.2304
      };

      const result = await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_minutely_precipitation,
        params
      );

      expect(result).toEqual(mockMinutelyResponse);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("/121.4737,31.2304/minutely");
    });

    it("should support unit parameter for minutely", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockMinutelyResponse));

      const params: WeatherToolParams = {
        longitude: 121.4737,
        latitude: 31.2304,
        unit: "metric"
      };

      await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_minutely_precipitation,
        params
      );

      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("unit=metric");
    });
  });

  describe("Hourly Forecast Tool", () => {
    const mockHourlyResponse = {
      status: "ok",
      api_version: "v2.6",
      result: {
        hourly: {
          status: "ok",
          description: "未来24小时多云转晴",
          temperature: [
            { value: 25, datetime: "2024-01-01T00:00" },
            { value: 24, datetime: "2024-01-01T01:00" },
            { value: 23, datetime: "2024-01-01T02:00" }
          ],
          humidity: [
            { value: 0.65, datetime: "2024-01-01T00:00" },
            { value: 0.68, datetime: "2024-01-01T01:00" },
            { value: 0.70, datetime: "2024-01-01T02:00" }
          ],
          skycon: [
            { value: "PARTLY_CLOUDY_DAY", datetime: "2024-01-01T00:00" },
            { value: "CLOUDY", datetime: "2024-01-01T01:00" },
            { value: "CLEAR_NIGHT", datetime: "2024-01-01T02:00" }
          ],
          wind: [
            { speed: 3.5, direction: 180, datetime: "2024-01-01T00:00" },
            { speed: 4.0, direction: 190, datetime: "2024-01-01T01:00" },
            { speed: 3.2, direction: 200, datetime: "2024-01-01T02:00" }
          ],
          precipitation: [
            { value: 0, probability: 0.1, datetime: "2024-01-01T00:00" },
            { value: 0.1, probability: 0.3, datetime: "2024-01-01T01:00" },
            { value: 0, probability: 0.05, datetime: "2024-01-01T02:00" }
          ],
          air_quality: {
            aqi: [
              { value: { chn: 50, usa: 55 }, datetime: "2024-01-01T00:00" },
              { value: { chn: 52, usa: 57 }, datetime: "2024-01-01T01:00" },
              { value: { chn: 48, usa: 53 }, datetime: "2024-01-01T02:00" }
            ],
            pm25: [
              { value: 35, datetime: "2024-01-01T00:00" },
              { value: 37, datetime: "2024-01-01T01:00" },
              { value: 33, datetime: "2024-01-01T02:00" }
            ]
          }
        }
      }
    };

    it("should fetch hourly forecast with default steps", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockHourlyResponse));

      const params: WeatherToolParams = {
        longitude: 113.2644,
        latitude: 23.1291
      };

      // Normalize params to check default values are applied
      const normalized = (server as any).normalizeParams(
        params,
        TOOL_CONFIGS.get_hourly_forecast
      );
      expect(normalized.hourlysteps).toBe(48); // default value

      const result = await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_hourly_forecast,
        params
      );

      expect(result).toEqual(mockHourlyResponse);
      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("/113.2644,23.1291/hourly");
    });

    it("should fetch hourly forecast with custom steps", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockHourlyResponse));

      const params: WeatherToolParams = {
        longitude: 113.2644,
        latitude: 23.1291,
        hourlysteps: 72
      };

      await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_hourly_forecast,
        params
      );

      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("hourlysteps=72");
    });

    it("should validate hourlysteps range", () => {
      expect(() => {
        (server as any).normalizeParams(
          { longitude: 120, latitude: 30, hourlysteps: 0 },
          TOOL_CONFIGS.get_hourly_forecast
        );
      }).toThrow(McpError);

      expect(() => {
        (server as any).normalizeParams(
          { longitude: 120, latitude: 30, hourlysteps: 361 },
          TOOL_CONFIGS.get_hourly_forecast
        );
      }).toThrow(McpError);
    });
  });

  describe("Daily Forecast Tool", () => {
    const mockDailyResponse = {
      status: "ok",
      api_version: "v2.6",
      result: {
        daily: {
          status: "ok",
          temperature: [
            { max: 30, min: 20, avg: 25, date: "2024-01-01" },
            { max: 28, min: 19, avg: 23, date: "2024-01-02" },
            { max: 26, min: 18, avg: 22, date: "2024-01-03" }
          ],
          humidity: [
            { max: 0.8, min: 0.4, avg: 0.6, date: "2024-01-01" },
            { max: 0.85, min: 0.45, avg: 0.65, date: "2024-01-02" },
            { max: 0.9, min: 0.5, avg: 0.7, date: "2024-01-03" }
          ],
          skycon: [
            { value: "PARTLY_CLOUDY_DAY", date: "2024-01-01" },
            { value: "CLOUDY", date: "2024-01-02" },
            { value: "LIGHT_RAIN", date: "2024-01-03" }
          ],
          skycon_08h_20h: [
            { value: "CLEAR_DAY", date: "2024-01-01" },
            { value: "PARTLY_CLOUDY_DAY", date: "2024-01-02" },
            { value: "CLOUDY", date: "2024-01-03" }
          ],
          skycon_20h_32h: [
            { value: "CLEAR_NIGHT", date: "2024-01-01" },
            { value: "PARTLY_CLOUDY_NIGHT", date: "2024-01-02" },
            { value: "LIGHT_RAIN", date: "2024-01-03" }
          ],
          precipitation: [
            { max: 0, min: 0, avg: 0, probability: 0.1, date: "2024-01-01" },
            { max: 1, min: 0, avg: 0.3, probability: 0.3, date: "2024-01-02" },
            { max: 5, min: 1, avg: 2.5, probability: 0.7, date: "2024-01-03" }
          ],
          wind: [
            {
              max: { speed: 10, direction: 180 },
              min: { speed: 2, direction: 90 },
              avg: { speed: 5, direction: 135 },
              date: "2024-01-01"
            }
          ],
          life_index: {
            ultraviolet: [
              { index: 3, desc: "中等", date: "2024-01-01" },
              { index: 2, desc: "弱", date: "2024-01-02" },
              { index: 1, desc: "很弱", date: "2024-01-03" }
            ],
            carWashing: [
              { index: 1, desc: "适宜", date: "2024-01-01" },
              { index: 2, desc: "较适宜", date: "2024-01-02" },
              { index: 4, desc: "不适宜", date: "2024-01-03" }
            ],
            dressing: [
              { index: 3, desc: "热", date: "2024-01-01" },
              { index: 4, desc: "温暖", date: "2024-01-02" },
              { index: 5, desc: "凉爽", date: "2024-01-03" }
            ],
            comfort: [
              { index: 5, desc: "舒适", date: "2024-01-01" },
              { index: 5, desc: "舒适", date: "2024-01-02" },
              { index: 6, desc: "凉爽", date: "2024-01-03" }
            ],
            coldRisk: [
              { index: 1, desc: "少发", date: "2024-01-01" },
              { index: 2, desc: "较易发", date: "2024-01-02" },
              { index: 3, desc: "易发", date: "2024-01-03" }
            ]
          },
          astro: [
            { sunrise: { time: "06:30" }, sunset: { time: "18:00" }, date: "2024-01-01" },
            { sunrise: { time: "06:31" }, sunset: { time: "17:59" }, date: "2024-01-02" },
            { sunrise: { time: "06:32" }, sunset: { time: "17:58" }, date: "2024-01-03" }
          ]
        }
      }
    };

    it("should fetch daily forecast with default steps", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockDailyResponse));

      const params: WeatherToolParams = {
        longitude: 106.5504,
        latitude: 29.5647
      };

      // Normalize params to check default values are applied
      const normalized = (server as any).normalizeParams(
        params,
        TOOL_CONFIGS.get_daily_forecast
      );
      expect(normalized.dailysteps).toBe(5); // default value

      const result = await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_daily_forecast,
        params
      );

      expect(result).toEqual(mockDailyResponse);
      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("/106.5504,29.5647/daily");
    });

    it("should fetch daily forecast with custom steps", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockDailyResponse));

      const params: WeatherToolParams = {
        longitude: 106.5504,
        latitude: 29.5647,
        dailysteps: 10
      };

      await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_daily_forecast,
        params
      );

      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("dailysteps=10");
    });

    it("should validate dailysteps range", () => {
      expect(() => {
        (server as any).normalizeParams(
          { longitude: 120, latitude: 30, dailysteps: 0 },
          TOOL_CONFIGS.get_daily_forecast
        );
      }).toThrow(McpError);

      expect(() => {
        (server as any).normalizeParams(
          { longitude: 120, latitude: 30, dailysteps: 16 },
          TOOL_CONFIGS.get_daily_forecast
        );
      }).toThrow(McpError);
    });
  });

  describe("Weather Alerts Tool", () => {
    const mockAlertResponse = {
      status: "ok",
      api_version: "v2.6",
      result: {
        alert: {
          status: "ok",
          content: [
            {
              pubtimestamp: 1609459200,
              alertId: "weatheralert-210101-4101840603-0502",
              status: "预警中",
              adcode: "410184",
              location: "河南省新郑市",
              province: "河南省",
              city: "郑州市",
              county: "新郑市",
              code: "0502",
              source: "国家预警信息发布中心",
              title: "新郑市气象台发布大雾黄色预警[III级/较重]",
              description: "新郑市气象台2024年1月1日06时30分发布大雾黄色预警信号：预计未来12小时内，新郑市大部分地区将出现能见度小于500米的雾，局地能见度小于200米，请注意防范。",
              regionId: "101180106",
              latlon: [34.3955, 113.7406],
              requestStatus: "ok"
            },
            {
              pubtimestamp: 1609462800,
              alertId: "weatheralert-210101-4101840603-0703",
              status: "预警中",
              adcode: "410184",
              location: "河南省新郑市",
              province: "河南省",
              city: "郑州市",
              county: "新郑市",
              code: "0703",
              source: "国家预警信息发布中心",
              title: "新郑市气象台发布高温橙色预警[III级/严重]",
              description: "新郑市气象台2024年1月1日10时00分发布高温橙色预警信号：预计今天白天，新郑市最高气温将升至37℃以上，请注意防暑降温。",
              regionId: "101180106",
              latlon: [34.3955, 113.7406],
              requestStatus: "ok"
            }
          ]
        }
      }
    };

    it("should fetch weather alerts", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockAlertResponse));

      const params: WeatherToolParams = {
        longitude: 113.7406,
        latitude: 34.3955
      };

      const result = await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_weather_alerts,
        params
      );

      expect(result).toEqual(mockAlertResponse);
      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("/113.7406,34.3955/alert");
    });

    it("should handle no alerts response", async () => {
      const noAlertsResponse = {
        status: "ok",
        api_version: "v2.6",
        result: {
          alert: {
            status: "ok",
            content: []
          }
        }
      };

      fetchMock.mockResolvedValue(createOkResponse(noAlertsResponse));

      const params: WeatherToolParams = {
        longitude: 120.1234,
        latitude: 30.5678
      };

      const result = await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_weather_alerts,
        params
      );

      expect(result.result.alert.content).toHaveLength(0);
    });
  });

  describe("Comprehensive Weather Tool", () => {
    const mockComprehensiveResponse = {
      status: "ok",
      api_version: "v2.6",
      api_status: "active",
      lang: "zh_CN",
      unit: "metric:v2",
      tzshift: 28800,
      timezone: "Asia/Shanghai",
      server_time: 1609459200,
      location: [116.3176, 39.9760],
      result: {
        alert: {
          status: "ok",
          content: []
        },
        realtime: {
          status: "ok",
          temperature: 25.5,
          humidity: 0.65,
          skycon: "PARTLY_CLOUDY_DAY",
          visibility: 10,
          wind: {
            speed: 12.5,
            direction: 135
          },
          pressure: 101325,
          apparent_temperature: 27.2,
          precipitation: {
            local: {
              status: "ok",
              datasource: "radar",
              intensity: 0
            }
          },
          air_quality: {
            aqi: {
              chn: 65,
              usa: 70
            }
          },
          life_index: {
            ultraviolet: {
              index: 5,
              desc: "中等"
            },
            comfort: {
              index: 5,
              desc: "舒适"
            }
          }
        },
        minutely: {
          status: "ok",
          datasource: "radar",
          precipitation_2h: new Array(120).fill(0),
          precipitation: new Array(60).fill(0),
          probability: [0, 0, 0, 0],
          description: "未来两小时不会下雨，放心出门"
        },
        hourly: {
          status: "ok",
          description: "未来24小时多云转晴",
          temperature: [
            { value: 25, datetime: "2024-01-01T00:00" }
          ]
        },
        daily: {
          status: "ok",
          temperature: [
            { max: 30, min: 20, avg: 25, date: "2024-01-01" }
          ],
          life_index: {
            ultraviolet: [
              { index: 3, desc: "中等", date: "2024-01-01" }
            ]
          }
        },
        primary: 0,
        forecast_keypoint: "未来两小时不会下雨，放心出门"
      }
    };

    it("should fetch comprehensive weather with all data", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockComprehensiveResponse));

      const params: WeatherToolParams = {
        longitude: 116.3176,
        latitude: 39.9760
      };

      const result = await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_comprehensive_weather,
        params
      );

      expect(result).toEqual(mockComprehensiveResponse);
      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("/116.3176,39.976/weather");
    });

    it("should fetch comprehensive weather with custom parameters", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockComprehensiveResponse));

      const params: WeatherToolParams = {
        longitude: 116.3176,
        latitude: 39.9760,
        lang: "en_US",
        unit: "imperial",
        hourlysteps: 72,
        dailysteps: 10,
        alert: false
      };

      await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_comprehensive_weather,
        params
      );

      const requestUrl = fetchMock.mock.calls[0][0] as string;
      expect(requestUrl).toContain("lang=en_US");
      expect(requestUrl).toContain("unit=imperial");
      expect(requestUrl).toContain("hourlysteps=72");
      expect(requestUrl).toContain("dailysteps=10");
      expect(requestUrl).toContain("alert=false");
    });

    it("should use default alert value as true", async () => {
      fetchMock.mockResolvedValue(createOkResponse(mockComprehensiveResponse));

      const params: WeatherToolParams = {
        longitude: 116.3176,
        latitude: 39.9760
      };

      const normalized = (server as any).normalizeParams(
        params,
        TOOL_CONFIGS.get_comprehensive_weather
      );

      expect(normalized.alert).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      fetchMock.mockRejectedValue(new TypeError("Network error"));

      await expect(
        (server as any).makeApiRequest(TOOL_CONFIGS.get_realtime_weather, {
          longitude: 120,
          latitude: 30
        })
      ).rejects.toThrow(McpError);
    });

    it("should handle timeout errors", async () => {
      const abortError = new DOMException("Aborted", "AbortError");
      fetchMock.mockRejectedValue(abortError);

      await expect(
        (server as any).makeApiRequest(TOOL_CONFIGS.get_realtime_weather, {
          longitude: 120,
          latitude: 30
        })
      ).rejects.toThrowError(/超时/);
    });

    it("should handle API error responses", async () => {
      const errorPayload = {
        status: "failed",
        error: "Token is invalid",
        error_code: 400
      };
      fetchMock.mockResolvedValue(createErrorResponse(errorPayload, 400));

      await expect(
        (server as any).makeApiRequest(TOOL_CONFIGS.get_realtime_weather, {
          longitude: 120,
          latitude: 30
        })
      ).rejects.toThrow(McpError);
    });

    it("should handle invalid JSON response", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => "invalid json"
      });

      await expect(
        (server as any).makeApiRequest(TOOL_CONFIGS.get_realtime_weather, {
          longitude: 120,
          latitude: 30
        })
      ).rejects.toThrowError(/解析失败/);
    });

    it("should handle API status not ok", async () => {
      fetchMock.mockResolvedValue(createOkResponse({
        status: "failed",
        error: "Internal error"
      }));

      await expect(
        (server as any).makeApiRequest(TOOL_CONFIGS.get_realtime_weather, {
          longitude: 120,
          latitude: 30
        })
      ).rejects.toThrowError(/彩云天气API错误/);
    });
  });

  describe("Parameter Validation", () => {
    it("should accept string coordinates and convert to numbers", () => {
      const normalized = (server as any).normalizeParams(
        {
          longitude: "120.123456",
          latitude: "-30.654321"
        },
        TOOL_CONFIGS.get_realtime_weather
      );

      expect(normalized.longitude).toBe(120.123456);
      expect(normalized.latitude).toBe(-30.654321);
    });

    it("should reject invalid coordinate strings", () => {
      expect(() => {
        (server as any).normalizeParams(
          {
            longitude: "not-a-number",
            latitude: "30"
          },
          TOOL_CONFIGS.get_realtime_weather
        );
      }).toThrow(McpError);
    });

    it("should accept boolean alert parameter", () => {
      const normalized = (server as any).normalizeParams(
        {
          longitude: 120,
          latitude: 30,
          alert: true
        },
        TOOL_CONFIGS.get_comprehensive_weather
      );

      expect(normalized.alert).toBe(true);
    });

    it("should accept string boolean for alert", () => {
      const normalized = (server as any).normalizeParams(
        {
          longitude: 120,
          latitude: 30,
          alert: "true"
        },
        TOOL_CONFIGS.get_comprehensive_weather
      );

      expect(normalized.alert).toBe(true);

      const normalizedFalse = (server as any).normalizeParams(
        {
          longitude: 120,
          latitude: 30,
          alert: "false"
        },
        TOOL_CONFIGS.get_comprehensive_weather
      );

      expect(normalizedFalse.alert).toBe(false);
    });

    it("should validate language parameter", () => {
      const supportedLangs = ["zh_CN", "zh_TW", "en_US", "en_GB", "ja"];

      for (const lang of supportedLangs) {
        const normalized = (server as any).normalizeParams(
          {
            longitude: 120,
            latitude: 30,
            lang
          },
          TOOL_CONFIGS.get_realtime_weather
        );
        expect(normalized.lang).toBe(lang);
      }
    });

    it("should validate unit parameter", () => {
      const supportedUnits = ["metric:v2", "imperial", "metric"];

      for (const unit of supportedUnits) {
        const normalized = (server as any).normalizeParams(
          {
            longitude: 120,
            latitude: 30,
            unit
          },
          TOOL_CONFIGS.get_realtime_weather
        );
        expect(normalized.unit).toBe(unit);
      }
    });
  });
});