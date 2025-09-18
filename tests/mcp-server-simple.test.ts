import { describe, expect, it, vi, beforeEach } from "vitest";
import { CaiyunWeatherServer, TOOL_CONFIGS } from "../src/index.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

describe("MCP Server Simple Tests", () => {
  let server: CaiyunWeatherServer;
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    server = new CaiyunWeatherServer({
      token: "test-token",
      fetchImpl: fetchMock
    });
  });

  describe("Server Initialization", () => {
    it("should create server instance", () => {
      expect(server).toBeDefined();
      expect(server).toBeInstanceOf(CaiyunWeatherServer);
    });

    it("should throw error without token", () => {
      // 保存原始环境变量
      const originalToken = process.env.CAIYUN_API_TOKEN;
      // 临时清除环境变量
      delete process.env.CAIYUN_API_TOKEN;

      expect(() => {
        new CaiyunWeatherServer({
          fetchImpl: fetchMock
        });
      }).toThrow("请设置 CAIYUN_API_TOKEN 环境变量");

      // 恢复环境变量
      if (originalToken) {
        process.env.CAIYUN_API_TOKEN = originalToken;
      }
    });

    it("should have all tool configs", () => {
      expect(TOOL_CONFIGS).toBeDefined();
      expect(TOOL_CONFIGS.get_realtime_weather).toBeDefined();
      expect(TOOL_CONFIGS.get_minutely_precipitation).toBeDefined();
      expect(TOOL_CONFIGS.get_hourly_forecast).toBeDefined();
      expect(TOOL_CONFIGS.get_daily_forecast).toBeDefined();
      expect(TOOL_CONFIGS.get_weather_alerts).toBeDefined();
      expect(TOOL_CONFIGS.get_comprehensive_weather).toBeDefined();
    });
  });

  describe("Tool Configurations", () => {
    it("should have correct endpoints", () => {
      expect(TOOL_CONFIGS.get_realtime_weather.endpoint).toBe("realtime");
      expect(TOOL_CONFIGS.get_minutely_precipitation.endpoint).toBe("minutely");
      expect(TOOL_CONFIGS.get_hourly_forecast.endpoint).toBe("hourly");
      expect(TOOL_CONFIGS.get_daily_forecast.endpoint).toBe("daily");
      expect(TOOL_CONFIGS.get_weather_alerts.endpoint).toBe("alert");
      expect(TOOL_CONFIGS.get_comprehensive_weather.endpoint).toBe("weather");
    });

    it("should have correct options", () => {
      // Realtime weather
      expect(TOOL_CONFIGS.get_realtime_weather.options.lang).toBe(true);
      expect(TOOL_CONFIGS.get_realtime_weather.options.unit).toBe(true);

      // Minutely precipitation
      expect(TOOL_CONFIGS.get_minutely_precipitation.options.lang).toBe(true);
      expect(TOOL_CONFIGS.get_minutely_precipitation.options.unit).toBe(true);

      // Hourly forecast
      expect(TOOL_CONFIGS.get_hourly_forecast.options.hourlysteps).toBe(true);

      // Daily forecast
      expect(TOOL_CONFIGS.get_daily_forecast.options.dailysteps).toBe(true);

      // Comprehensive weather
      expect(TOOL_CONFIGS.get_comprehensive_weather.options.alert).toBe(true);
    });

    it("should have schemas with required fields", () => {
      for (const toolName in TOOL_CONFIGS) {
        const config = TOOL_CONFIGS[toolName];
        expect(config.schema).toBeDefined();
        expect(config.schema.type).toBe("object");
        expect(config.schema.properties).toBeDefined();
        expect(config.schema.required).toContain("longitude");
        expect(config.schema.required).toContain("latitude");
      }
    });
  });

  describe("Parameter Normalization", () => {
    it("should normalize string coordinates", () => {
      const normalized = (server as any).normalizeParams(
        {
          longitude: "120.5",
          latitude: "30.5"
        },
        TOOL_CONFIGS.get_realtime_weather
      );

      expect(normalized.longitude).toBe(120.5);
      expect(normalized.latitude).toBe(30.5);
    });

    it("should apply default values", () => {
      const normalized = (server as any).normalizeParams(
        {
          longitude: 120,
          latitude: 30
        },
        TOOL_CONFIGS.get_realtime_weather
      );

      expect(normalized.lang).toBe("zh_CN");
      expect(normalized.unit).toBe("metric:v2");
    });

    it("should validate coordinate ranges", () => {
      expect(() => {
        (server as any).normalizeParams(
          {
            longitude: 181,
            latitude: 30
          },
          TOOL_CONFIGS.get_realtime_weather
        );
      }).toThrow(McpError);

      expect(() => {
        (server as any).normalizeParams(
          {
            longitude: 120,
            latitude: -91
          },
          TOOL_CONFIGS.get_realtime_weather
        );
      }).toThrow(McpError);
    });

    it("should handle optional parameters", () => {
      const normalized = (server as any).normalizeParams(
        {
          longitude: 120,
          latitude: 30,
          lang: "en_US",
          unit: "imperial"
        },
        TOOL_CONFIGS.get_realtime_weather
      );

      expect(normalized.lang).toBe("en_US");
      expect(normalized.unit).toBe("imperial");
    });
  });

  describe("API Request Building", () => {
    it("should build correct URL for realtime weather", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ status: "ok", result: {} })
      });

      await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_realtime_weather,
        {
          longitude: 116.3176,
          latitude: 39.9760,
          lang: "zh_CN",
          unit: "metric:v2"
        }
      );

      expect(fetchMock).toHaveBeenCalled();
      const url = fetchMock.mock.calls[0][0];
      expect(url).toContain("/test-token/116.3176,39.976/realtime");
      expect(url).toContain("lang=zh_CN");
      expect(url).toContain("unit=metric%3Av2"); // URL encoded
    });

    it("should build correct URL for comprehensive weather", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ status: "ok", result: {} })
      });

      await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_comprehensive_weather,
        {
          longitude: 120,
          latitude: 30,
          hourlysteps: 72,
          dailysteps: 10,
          alert: false
        }
      );

      const url = fetchMock.mock.calls[0][0];
      expect(url).toContain("/test-token/120,30/weather");
      expect(url).toContain("hourlysteps=72");
      expect(url).toContain("dailysteps=10");
      expect(url).toContain("alert=false");
    });
  });

  describe("Error Handling", () => {
    it("should handle API error responses", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({
          status: "failed",
          error: "Invalid token",
          error_code: 400
        })
      });

      await expect(
        (server as any).makeApiRequest(
          TOOL_CONFIGS.get_realtime_weather,
          { longitude: 120, latitude: 30 }
        )
      ).rejects.toThrow(McpError);
    });

    it("should handle network errors", async () => {
      fetchMock.mockRejectedValue(new TypeError("Network error"));

      await expect(
        (server as any).makeApiRequest(
          TOOL_CONFIGS.get_realtime_weather,
          { longitude: 120, latitude: 30 }
        )
      ).rejects.toThrow(McpError);
    });

    it("should handle invalid JSON response", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => "not valid json"
      });

      await expect(
        (server as any).makeApiRequest(
          TOOL_CONFIGS.get_realtime_weather,
          { longitude: 120, latitude: 30 }
        )
      ).rejects.toThrowError(/解析失败/);
    });

    it("should handle timeout", async () => {
      const abortError = new DOMException("Aborted", "AbortError");
      fetchMock.mockRejectedValue(abortError);

      await expect(
        (server as any).makeApiRequest(
          TOOL_CONFIGS.get_realtime_weather,
          { longitude: 120, latitude: 30 }
        )
      ).rejects.toThrowError(/超时/);
    });
  });

  describe("Response Validation", () => {
    it("should validate response status", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({
          status: "failed",
          error: "Some error"
        })
      });

      await expect(
        (server as any).makeApiRequest(
          TOOL_CONFIGS.get_realtime_weather,
          { longitude: 120, latitude: 30 }
        )
      ).rejects.toThrowError(/彩云天气API错误/);
    });

    it("should accept valid response", async () => {
      const validResponse = {
        status: "ok",
        result: {
          realtime: {
            temperature: 25,
            humidity: 0.6
          }
        }
      };

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(validResponse)
      });

      const result = await (server as any).makeApiRequest(
        TOOL_CONFIGS.get_realtime_weather,
        { longitude: 120, latitude: 30 }
      );

      expect(result).toEqual(validResponse);
    });
  });
});