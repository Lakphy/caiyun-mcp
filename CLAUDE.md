# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build and Development
- **Build**: `npm run build` - Compiles TypeScript to JavaScript using tsdown
- **Development**: `npm run dev` - Runs tsdown in watch mode for hot reloading
- **Start**: `npm start` or `node dist/index.js` - Runs the compiled MCP server
- **Test**: `npm test` - Runs tests with vitest
- **Type Check**: `npm run typecheck` - Runs TypeScript compiler for type checking without emitting files

## Architecture

This is a Model Context Protocol (MCP) server for the Caiyun Weather API (彩云天气), providing weather query tools for AI assistants.

### Core Architecture
- **MCP Server**: Built using `@modelcontextprotocol/sdk`, implements standard MCP tool protocol
- **Tool System**: Modular architecture with each weather tool as a separate module in `src/tools/`
- **API Integration**: All tools communicate with Caiyun Weather API v2.6 endpoints
- **Type Safety**: Full TypeScript implementation with strict type checking

### Key Design Patterns
1. **Tool Configuration**: Each tool has a `ToolConfig` defining its endpoint, description, options, and JSON schema
2. **Schema Generation**: `createInputSchema()` dynamically builds parameter schemas based on tool options
3. **Error Handling**: Standardized error responses following MCP protocol
4. **Modular Tools**: Each API endpoint maps to an independent tool module

### Module Organization
- `src/index.ts`: MCP server implementation, handles tool invocation and API communication
- `src/types.ts`: TypeScript type definitions for API responses and parameters
- `src/tools/`: Tool modules directory
  - `base.ts`: Common interfaces, schema generation, and default values
  - Individual tool files: Each implements a specific weather API endpoint
  - `index.ts`: Aggregates and exports all tool configurations
- `src/prompts/`: Prompt system for AI knowledge enhancement (optional feature)

### API Authentication
The server requires a `CAIYUN_API_TOKEN` environment variable for API authentication. This token is automatically appended to all API requests.

### Adding New Tools
1. Create a new file in `src/tools/` with the tool configuration
2. Export it in `src/tools/index.ts`
3. Add the tool name to the `ToolName` type in `src/tools/base.ts`
4. Update `TOOL_CONFIGS` mapping in `src/tools/index.ts`

### Tool Parameters
All tools share common optional parameters:
- `lang`: Language code for responses (default: zh_CN)
- `unit`: Unit system (metric:v2, imperial, metric)
- `hourlysteps`: Hours of forecast (1-360)
- `dailysteps`: Days of forecast (1-15)
- `alert`: Include weather alerts (boolean)

Required parameters for all tools:
- `longitude`: Location longitude (-180 to 180)
- `latitude`: Location latitude (-90 to 90)