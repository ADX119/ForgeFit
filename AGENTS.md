# Notes for coding agents

Read `README.md` for the stack, commands and conventions.

## Open decisions — ask before coding

Some decisions are deliberately left open. Before writing code that depends on one, stop and ask Aditya which approach to take. Do not pick one yourself, even the listed default.

- **AI layer provider** (diet recommendations): see `docs/decisions/0001-ai-layer-provider.md`. Present the default candidate (Groq free tier with Cloudflare Workers AI fallback) alongside the other options in that file, ask which to use, then record the answer there.
