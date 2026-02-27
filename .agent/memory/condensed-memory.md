# Condensed Memory — gmail-mcp-server

> Last updated: 2026-02-27

## Project Identity
- Gmail/Calendar MCP server for Claude Code, forked from `zacco16/gmail-mcp-server`
- Origin remote: `jvalenzano/gmail-mcp-server` (user's fork)
- TypeScript MCP server using googleapis, built to `dist/`, run via `start.mjs`

## Current State
- Main branch, clean working tree, up to date with origin
- Tools: listEmails, readEmail, draftEmail, sendEmail, listDrafts, readDraft, deleteDraft, updateDraft, listEvents, readEvent, createEvent, deleteEvent, listLabels, createLabel, deleteLabel, modifyMessageLabels
- Known bug pattern: MCP array parameters may arrive as JSON strings — `toStringArray()` helper added in `modify.ts` but not yet extracted to shared utility

## Key Files
- `start.mjs` — entrypoint with Node 25+ SlowBuffer polyfill, loads `dist/index.js`
- `src/tools/index.ts` — tool registry and handler map
- `src/tools/labels/modify.ts` — contains `toStringArray()` fix
- `src/config/auth.ts` — OAuth2 setup, reads from `.env`
- `src/types/gmail.ts` — all type definitions
- `get_refresh_token.mjs` — OAuth token generator utility

## Key Conventions
- MCP server config: `claude mcp add --scope user gmail -- node /path/to/start.mjs`
- MCP servers do NOT hot-reload — new Claude Code session required after config changes
- Build: `npm run build` (clean + tsc)
- Auth: OAuth2 refresh token in `.env` (not committed)

## Next Steps
1. Extract `toStringArray()` to shared utility, audit all handlers for same bug
2. Add automated tests for label tools
3. Add `.gitignore` for `.env` and auth files
4. Audit billing on remaining GCP projects
