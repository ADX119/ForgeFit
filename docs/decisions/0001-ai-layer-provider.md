# 0001 — AI layer provider

- **Status:** Open — not decided. Ask Aditya before writing any AI-layer code.
- **Recorded:** 29 October 2026
- **Area:** AI diet recommendations (runs on Cloudflare, must fit the existing grocery and order-a-dish features)

## Context

ForgeFit will add an AI layer that recommends diet plans from the user's preference (vegan, vegetarian, eggetarian, non-vegetarian), goal, and exclusions. Early on there will be few users, so the layer should cost nothing until there is a paying audience, and switching to a paid provider later must be a small change.

The free DeepSeek V4.1 Flash offer in OpenCode is for OpenCode's coding agent only. It is not a production API and must not power this feature.

## Default candidate (proposed, not chosen)

**Groq free tier as the main provider, Cloudflare Workers AI as the fallback.**

- **Groq:** no credit card, OpenAI-compatible API. Published free limits for `openai/gpt-oss-120b` were 30 requests/minute, 1,000 requests/day and 200,000 tokens/day (October 2026). A diet plan uses roughly 1–2K tokens, so about 100+ plans a day.
- **Workers AI:** 10,000 free neurons a day on every Cloudflare account, called from the Worker through the `AI` binding with no API key. One measurement put that at about 80 answers a day on Llama 3.3 70B.
- **Guards:** a per-user daily cap stored in KV (for example 3 plans a day), and generated plans saved and reused instead of regenerated on every view.
- **One seam:** all calls go through a single `getAIResponse()` function so the provider can be swapped (for example to the paid DeepSeek API) without touching the rest of the app.

## Options still to compare

| Option                          | Cost now                    | Notes                                                                                       |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------- |
| Groq + Workers AI fallback      | Free                        | Default candidate above                                                                     |
| Workers AI only                 | Free                        | Simplest on Cloudflare; smaller daily allowance; neuron cost per request is hard to predict |
| OpenRouter `:free` models       | Free                        | 50 requests/day until $10 of credits is bought once (then 1,000); free models rotate out    |
| DeepSeek API (`deepseek-flash`) | Paid, prepaid pay-as-you-go | Very cheap; likely the first paid upgrade                                                   |
| Gemini API free tier            | Free                        | **Avoid for user data:** free-tier prompts may be used for training and read by reviewers   |

Free-tier limits change often. Check each provider's current limits page before deciding.

## Privacy

Diet, weight and goal data is personal. Send the model only what it needs, and state in the privacy policy that this data goes to a third-party AI provider.

## Decision

_Pending._ When Aditya chooses, record the choice and the reason here and change the status to **Accepted**.
