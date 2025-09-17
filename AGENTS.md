# Repository Guidelines

## Project Structure & Module Organization
TypeScript sources live in `src/`, with `index.ts` wiring the MCP server, `tools/` housing individual Caiyun API integrations, `prompts/` defining reusable conversation prompts, and `types.ts` centralizing shared interfaces. Runtime bundles land in `dist/` after builds; never edit them directly. Vitest suites sit in `tests/`, mirroring source modules and focusing on server behavior and prompt logic. Docs such as `README.md` and `ARCHITECTURE.md` provide domain context for new contributors.

## Build, Test, and Development Commands
Use `pnpm install` to sync dependencies (lockfile is pnpm-based). `pnpm build` compiles TypeScript via tsdown into `dist/`. `pnpm dev` runs tsdown in watch mode for iterative work. `pnpm start` executes the built MCP server; ensure the token is configured first. Run `pnpm test` for the Vitest suite, and `pnpm typecheck` to validate types without emitting files.

## Coding Style & Naming Conventions
Follow the existing two-space indentation, TypeScript `strict` defaults, and ES module syntax (`type: "module"`). Prefer named exports and keep shared types in `src/types.ts`. Use `camelCase` for functions, `PascalCase` for classes, and align tool identifiers with their endpoint purpose (e.g., `get_realtime_weather`). Keep literals in double quotes to match the codebase. When extending tools, reuse helper parsers and respect default option constants from `src/tools/index.ts`.

## Testing Guidelines
Place new tests under `tests/` with filenames ending in `.test.ts`. Mirror the source structure so each tool and prompt has focused coverage. Leverage Vitest's `describe/it` style and spies (`vi.fn()`) for network behavior. Run `pnpm test -- --coverage` before submitting substantial changes; keep coverage steady by exercising happy-path and error handling branches.

## Commit & Pull Request Guidelines
The workspace ships without git history; default to Conventional Commits (e.g., `feat: add hourly forecast validation`) for clarity. Scope commits around one logical change and mention affected tools or prompts in the body. Pull requests should link any tracking issues, describe testing performed (`pnpm test`, manual prompt validation), and include screenshots or JSON samples when showcasing new tool outputs. Highlight any configuration or token requirements so reviewers can reproduce locally.

## Configuration & Security Tips
The server requires `CAIYUN_API_TOKEN`; export it in your shell or load it via your MCP client configuration, never commit tokens. Avoid persisting secrets in example prompts or fixtures. When adding new tools, document needed environment variables and sanitize logged errors to prevent leaking API responses.
