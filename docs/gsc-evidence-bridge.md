# GSC Evidence Bridge

The GSC Evidence Bridge is a credential-free handoff between fresh Google Search Console Search Analytics evidence and the YardCompute laptop agent.

## Why this exists

The laptop agent has the GSC normalization layer, but the laptop runtime cannot directly use the ChatGPT-side GSC Wizard connector. This bridge lets fresh Search Analytics data be saved as plain JSON and normalized locally without copying Google credentials to the laptop.

## Safe workflow

1. Obtain a fresh Search Analytics result for sc-domain:yardcompute.com with query + page dimensions and clicks, impressions, CTR, and position.
2. Save only the result data as data/gsc-evidence.json.
3. Run:
   npm run gsc:evidence -- --input data/gsc-evidence.json --output data/gsc-live.json
4. The bridge creates data/gsc-live.json with status LIVE_EVIDENCE.
5. The YardCompute agent can consume that normalized file for SEO planning.

## Security

- Never paste Google passwords, OAuth refresh tokens, cookies, API keys, or service-account JSON into the evidence file.
- The bridge does not authenticate to Google and does not make Google API calls.
- data/gsc-live.json should be treated as project analytics data and should not be committed if it contains private Search Console data.
- Verify property and date range before allowing implementation decisions.

## Expected input

An object containing a rows array is preferred. Each row may use either:
- keys: ["query", "page"]
- or explicit query and page fields

along with clicks, impressions, ctr, and position.

The bridge also accepts a payload nested under data.rows or result.rows.
