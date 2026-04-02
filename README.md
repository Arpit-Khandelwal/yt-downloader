# Adaptive Downloader Control Center

A production-oriented YouTube downloader built on Next.js with an explicit three-stage flow:

1. `Analyze`: validate URL and normalize format metadata.
2. `Plan`: decide best delivery path from a deterministic strategy engine.
3. `Execute`: run direct download, client-side merge, or guarded server fallback.

The app is configured for **strict policy mode**: only public, accessible content is supported.

## Architecture

### Frontend (`/app`)
- `app/components/DownloaderApp.tsx`: stage-based product shell (policy, analyze, strategy context).
- `app/components/DownloadButtons.tsx`: adaptive execution controls and custom format matrix.
- `app/components/Downloading.tsx`: `ffmpeg.wasm` merge panel running in a dedicated worker.
- `app/lib/client-api.ts`: typed request layer with timeout-aware API errors.
- `app/lib/capability.ts`: browser capability telemetry (`WebAssembly`, memory, CPU, storage, isolation).
- `app/workers/ffmpeg.worker.ts`: worker runtime for audio/video muxing.

### API (`/pages/api`)
- `GET /api/info?url=...`
  - Validates request + resolves extractor metadata + returns curated formats.
- `POST /api/strategy/decide`
  - Deterministic mode selection from capability profile + selected formats.
- `POST /api/fallback/jobs`
  - Creates a fallback job (size-limited + quota-limited).
- `GET /api/fallback/jobs/:jobId`
  - Polls fallback job state and progress.
- `GET /api/health`
  - Runtime health and feature-flag state.

### Fallback Worker Contract
The Next API expects an external worker at `FALLBACK_WORKER_URL` exposing:

- `POST /jobs`
  - Request body: `{ url, audioItag?, videoItag?, output, estimatedSizeBytes?, clientJobId? }`
  - Response: `{ jobId, status, progressPct?, downloadUrl?, errorCode? }`
- `GET /jobs/:jobId`
  - Response: `{ status, progressPct, downloadUrl?, errorCode? }`

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```bash
# Strict policy mode is always enabled in this repo.

# Enable or disable fallback API flow
ENABLE_FALLBACK=false

# External fallback worker base URL (required when ENABLE_FALLBACK=true)
FALLBACK_WORKER_URL=

# Quotas and limits
FALLBACK_MAX_JOBS_PER_IP_PER_DAY=5
FALLBACK_MAX_ESTIMATED_SIZE_MB=350
FALLBACK_JOB_TTL_MINUTES=30
FALLBACK_POLL_TIMEOUT_MS=4500

# Optional: only enable if you fully support COEP/COOP requirements
ENABLE_COOP_COEP=false
```

## Verification

```bash
npm run lint
npm run build
```

## Deployment profile (free-tier first)

- Frontend + light APIs: Vercel Hobby
- Heavy fallback worker: Cloud Run (with strict quotas)
- Keep fallback disabled by default in public demos unless worker quotas are configured.

## Notes

- Legacy `/api/download` is deprecated.
- Legacy `index.js` Express runtime is deprecated.
- For robust production fallback, run a dedicated worker service with lifecycle cleanup and short-lived download URLs.
