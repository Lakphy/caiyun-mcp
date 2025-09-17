import { describe, expect, it, vi, beforeEach } from "vitest";
import { CaiyunWeatherServer, TOOL_CONFIGS } from "../src/index.js";
import { McpError } from "@modelcontextprotocol/sdk/types.js";
import type { WeatherToolParams } from "../src/types.js";

describe("CaiyunWeatherServer", () => {
  const fetchMock = vi.fn();

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
  });

  it("normalizes parameters and applies defaults", () => {
    const server = new CaiyunWeatherServer({ token: "token", fetchImpl: fetchMock });
    const normalized = (server as any).normalizeParams(
      {
        longitude: "120.12",
        latitude: "30.56",
        hourlysteps: "24",
      },
      TOOL_CONFIGS.get_hourly_forecast
    ) as WeatherToolParams;

    expect(normalized).toEqual({
      longitude: 120.12,
      latitude: 30.56,
      lang: "zh_CN",
      unit: "metric:v2",
      hourlysteps: 24,
    });
  });

  it("makes requests with expected query parameters", async () => {
    const payload = { status: "ok", result: { value: 1 } };
    fetchMock.mockResolvedValue(createOkResponse(payload));

    const server = new CaiyunWeatherServer({ token: "token", fetchImpl: fetchMock });

    const params: WeatherToolParams = {
      longitude: 120,
      latitude: 30,
      lang: "en_US",
      unit: "imperial",
      hourlysteps: 12,
      dailysteps: 3,
      alert: false,
    };

    const result = await (server as any).makeApiRequest(
      TOOL_CONFIGS.get_comprehensive_weather,
      params
    );

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestUrl).toContain("hourlysteps=12");
    expect(requestUrl).toContain("dailysteps=3");
    expect(requestUrl).toContain("alert=false");
    expect(requestUrl).toContain("lang=en_US");
    expect(requestUrl).toContain("unit=imperial");
  });

  it("wraps API errors with McpError", async () => {
    fetchMock.mockResolvedValue(
      createErrorResponse({
        status: "failed",
        error: "Invalid token",
        error_code: 1234,
      }, 403)
    );

    const server = new CaiyunWeatherServer({ token: "token", fetchImpl: fetchMock });

    await expect(
      (server as any).makeApiRequest(TOOL_CONFIGS.get_realtime_weather, {
        longitude: 120,
        latitude: 30,
        lang: "zh_CN",
        unit: "metric:v2",
      } satisfies WeatherToolParams)
    ).rejects.toThrowError(McpError);
  });
});
