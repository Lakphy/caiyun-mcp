#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import type { ErrorResponse, WeatherToolParams } from "./types.js";

// 导入工具配置
import {
  TOOL_CONFIGS,
  getToolConfig,
  hasToolConfig,
  type ToolName,
  type ToolConfig,
  DEFAULT_LANG,
  DEFAULT_UNIT,
  DEFAULT_HOURLY_STEPS,
  DEFAULT_DAILY_STEPS,
  DEFAULT_ALERT,
} from "./tools/index.js";

// 导入prompt系统
import { weatherPromptManager } from "./prompts/index.js";

// 重新导出供测试使用
export { TOOL_CONFIGS } from "./tools/index.js";
export { weatherPromptManager } from "./prompts/index.js";

export class CaiyunWeatherServer {
  private readonly server: Server;
  private readonly apiToken: string;
  private readonly baseUrl = "https://api.caiyunapp.com/v2.6";
  private readonly fetchImpl: typeof fetch;
  private readonly requestTimeoutMs: number;

  constructor(options?: {
    token?: string;
    fetchImpl?: typeof fetch;
    requestTimeoutMs?: number;
  }) {
    this.server = new Server(
      {
        name: "caiyun-weather",
        version: "1.0.0",
        description:
          "彩云天气API v2.6 MCP服务器。提供中国大陆地区高精度天气数据，包括实时天气、分钟级降水预报、小时级预报、天级预报、官方气象预警等功能。基于专业气象数据源，支持多语言和单位制，适用于各类天气相关应用场景。",
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
        },
      }
    );

    const fetchImplementation = options?.fetchImpl ?? globalThis.fetch;
    if (!fetchImplementation) {
      throw new Error("当前运行环境未提供 fetch API");
    }

    this.fetchImpl = fetchImplementation;
    this.requestTimeoutMs = options?.requestTimeoutMs ?? 15000;
    this.apiToken = (
      options?.token ??
      process.env.CAIYUN_API_TOKEN ??
      ""
    ).trim();

    if (!this.apiToken) {
      throw new Error("错误: 请设置 CAIYUN_API_TOKEN 环境变量");
    }

    this.setupToolHandlers();
    this.setupPromptHandlers();
    this.setupErrorHandling();
  }

  private normalizeParams(
    rawParams: unknown,
    config: ToolConfig
  ): WeatherToolParams {
    if (typeof rawParams !== "object" || rawParams === null) {
      throw new McpError(ErrorCode.InvalidParams, "请求参数必须是对象");
    }

    const params = rawParams as Record<string, unknown>;

    const longitude = this.parseCoordinate(params.longitude, "经度", -180, 180);
    const latitude = this.parseCoordinate(params.latitude, "纬度", -90, 90);

    const normalized: WeatherToolParams = {
      longitude,
      latitude,
    };

    if (config.options.lang) {
      normalized.lang = this.parseString(params.lang, "语言", DEFAULT_LANG);
    }

    if (config.options.unit) {
      normalized.unit = this.parseString(params.unit, "单位制", DEFAULT_UNIT);
    }

    if (config.options.hourlysteps) {
      normalized.hourlysteps = this.parseInteger(
        params.hourlysteps,
        "小时级预报步数",
        DEFAULT_HOURLY_STEPS,
        1,
        360
      );
    }

    if (config.options.dailysteps) {
      normalized.dailysteps = this.parseInteger(
        params.dailysteps,
        "天级预报步数",
        DEFAULT_DAILY_STEPS,
        1,
        15
      );
    }

    if (config.options.alert) {
      normalized.alert = this.parseBoolean(
        params.alert,
        "预警开关",
        DEFAULT_ALERT
      );
    }

    return normalized;
  }

  private parseCoordinate(
    value: unknown,
    label: string,
    min: number,
    max: number
  ): number {
    const numericValue = this.parseNumber(value, label);

    if (numericValue < min || numericValue > max) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `${label}必须在 ${min} 到 ${max} 之间`
      );
    }

    return numericValue;
  }

  private parseNumber(value: unknown, label: string): number {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    throw new McpError(ErrorCode.InvalidParams, `${label}必须是有效的数字`);
  }

  private parseInteger(
    value: unknown,
    label: string,
    defaultValue: number,
    min: number,
    max: number
  ): number {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    const numericValue = this.parseNumber(value, label);

    if (!Number.isInteger(numericValue)) {
      throw new McpError(ErrorCode.InvalidParams, `${label}必须是整数`);
    }

    if (numericValue < min || numericValue > max) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `${label}必须在 ${min} 到 ${max} 之间`
      );
    }

    return numericValue;
  }

  private parseString(
    value: unknown,
    label: string,
    defaultValue: string
  ): string {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }

    throw new McpError(ErrorCode.InvalidParams, `${label}必须是非空字符串`);
  }

  private parseBoolean(
    value: unknown,
    label: string,
    defaultValue: boolean
  ): boolean {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const lowered = value.trim().toLowerCase();
      if (lowered === "true") {
        return true;
      }
      if (lowered === "false") {
        return false;
      }
    }

    throw new McpError(ErrorCode.InvalidParams, `${label}必须是布尔值`);
  }

  private async makeApiRequest(
    config: ToolConfig,
    params: WeatherToolParams
  ): Promise<unknown> {
    const url = new URL(
      `${this.baseUrl}/${this.apiToken}/${params.longitude},${params.latitude}/${config.endpoint}`
    );

    if (config.options.lang && params.lang) {
      url.searchParams.set("lang", params.lang);
    }

    if (config.options.unit && params.unit) {
      url.searchParams.set("unit", params.unit);
    }

    if (config.options.hourlysteps && params.hourlysteps !== undefined) {
      url.searchParams.set("hourlysteps", params.hourlysteps.toString());
    }

    if (config.options.dailysteps && params.dailysteps !== undefined) {
      url.searchParams.set("dailysteps", params.dailysteps.toString());
    }

    if (config.options.alert && params.alert !== undefined) {
      url.searchParams.set("alert", String(params.alert));
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
      const response = await this.fetchImpl(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      const responseText = await response.text();
      let data: unknown;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new McpError(
            ErrorCode.InternalError,
            `彩云天气响应解析失败: ${(parseError as Error).message}`
          );
        }
      }

      if (!response.ok) {
        const message = this.formatApiError(
          data,
          response.status,
          response.statusText
        );
        throw new McpError(ErrorCode.InternalError, message);
      }

      if (
        !data ||
        typeof data !== "object" ||
        (data as Record<string, unknown>).status !== "ok"
      ) {
        const message = this.formatApiError(data, "未知", "API状态异常");
        throw new McpError(ErrorCode.InternalError, message);
      }

      return data;
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new McpError(ErrorCode.RequestTimeout, "请求彩云天气API超时");
      }

      if (error instanceof TypeError) {
        throw new McpError(
          ErrorCode.InternalError,
          `网络请求失败: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InternalError,
        `请求失败: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private formatApiError(
    payload: unknown,
    status: number | string,
    fallbackMessage: string
  ): string {
    if (!payload || typeof payload !== "object") {
      return `彩云天气API错误: ${fallbackMessage} (状态: ${status})`;
    }

    const {
      error,
      error_code: errorCode,
      status: apiStatus,
    } = payload as Partial<ErrorResponse>;

    const messageParts = [
      error ?? fallbackMessage,
      errorCode !== undefined ? `错误码: ${errorCode}` : undefined,
      `状态: ${apiStatus ?? status}`,
    ].filter(Boolean);

    return `彩云天气API错误: ${messageParts.join(" | ")}`;
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = (
        Object.entries(TOOL_CONFIGS) as [ToolName, ToolConfig][]
      ).map(([name, config]) => ({
        name,
        description: config.description,
        inputSchema: config.schema,
      }));

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!hasToolConfig(name)) {
        throw new McpError(ErrorCode.MethodNotFound, `未知的工具: ${name}`);
      }

      const config = getToolConfig(name)!;

      try {
        const params = this.normalizeParams(args ?? {}, config);
        const result = await this.makeApiRequest(config, params);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        throw new McpError(
          ErrorCode.InternalError,
          `工具 ${name} 执行失败: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    });
  }

  private setupPromptHandlers() {
    // 设置 prompt 处理器
    weatherPromptManager.setupPromptHandlers(this.server);
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP错误]", error);
    };

    const shutdown = async () => {
      await this.server.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // 获取 prompt 统计信息
    const promptStats = weatherPromptManager.getPromptStats();
    console.error(
      `彩云天气 MCP Server 已启动 - API v2.6 | ${
        Object.keys(TOOL_CONFIGS).length
      } Tools | ${promptStats.total} Prompts | 专业气象知识服务`
    );
    console.error(
      `Prompt 分类: ${Object.keys(promptStats.categories).join(
        ", "
      )} | 知识领域: ${Object.keys(promptStats.domains).join(", ")}`
    );
  }
}

export async function run() {
  const server = new CaiyunWeatherServer();
  await server.run();
}
