# Running the solution

How to bring up the whole bank-harness solution — datastore, banking service, and customer
application — in the right order, and confirm it actually works end to end. This is the doc to
follow when asked to "run the solution"; each step links to the owning repo's own README for
the authoritative detail on that piece.

Source of truth for ports/commands is the `runtime` section of
[`harness.config.json`](harness.config.json) — this doc is that section written out as an
executable walkthrough. If the two disagree, the config wins; fix this doc to match it.

## Order matters

**Datastore → service → application.** The banking service (`bank-harness`) connects to its
datastore at startup and **exits immediately if it can't reach one** — starting it before the
datastore is up just means restarting it. The customer application (`bank-harness-fe`) talks
only to the service, not the datastore, so it comes last.

## 1. Start the datastore

```bash
cd ../bank-harness
docker compose up -d          # older Docker: docker-compose up -d
```

Starts MongoDB on `localhost:27017`, plus a Mongo Express admin UI on
**http://localhost:8081**. Full detail (credentials, what's in `docker-compose.yml`): see
[`bank-harness/README.md` → "2. Start MongoDB"](../bank-harness/README.md#2-start-mongodb).

## 2. Start the banking service

```bash
cd ../bank-harness
npm install        # first run only
npm run dev
```

Runs on **http://localhost:3000**, with interactive API docs at
**http://localhost:3000/api-docs**. A `.env` with working defaults is already committed — no
setup needed. You'll know it's up when the log shows `Server running in development mode on
port 3000` and `MongoDB Connected: localhost`. Full detail: see
[`bank-harness/README.md` → "Running the API"](../bank-harness/README.md#running-the-api).

The service is fully usable on its own at this point, via Swagger — the customer application
below is optional if you only need the API.

## 3. Start the customer application

```bash
cd ../bank-harness-fe
npm install        # first run only
npm run dev
```

Runs on **http://localhost:5174**. In dev it proxies `/api` to the service on port 3000, so
there's no CORS setup and no API URL to configure. Full detail: see
[`bank-harness-fe/README.md` → "Getting started"](../bank-harness-fe/README.md#getting-started).

## 4. Verify it end to end

There's **no seed data** — a fresh datastore has no accounts, and a new account holds nothing
until it's funded. So the smallest real check is: create an account, then deposit into it.

- **Through the UI**: open http://localhost:5174, create an account, then deposit into it from
  its detail page.
- **Through the API directly** (works even without the front end running):
  ```bash
  curl -s -X POST http://localhost:3000/api/accounts \
    -H "Content-Type: application/json" \
    -d '{"name":"Alice Smith"}'
  # copy the returned "id", then:
  curl -s -X POST http://localhost:3000/api/transactions/deposit \
    -H "Content-Type: application/json" \
    -d '{"accountId":"<ACCOUNT_ID>","amount":1000,"description":"Opening deposit"}'
  ```
  A successful call returns `{"success":true,"data":{...}}`.

## Known issues (not bugs to fix — just what to expect)

- **No seed data anywhere** — always create and fund an account before expecting a withdrawal
  or transfer to do anything.
- **No authentication** — every account is visible and actionable by anyone who reaches either
  the API or the UI. Confirmed acceptable for this training harness; see
  [`bank-harness-kb/docs/constraints-and-gaps.md`](../bank-harness-kb/docs/constraints-and-gaps.md#anyone-can-do-anything-to-any-account).
- **`bank-harness-fe`'s `npm run lint` fails** — the script is defined but `eslint` isn't
  installed. Unrelated to running the app; safe to ignore.

## Stopping everything

> **"Stop the application" means stop everything** — datastore, service, and customer
> application together, not just the front end. Use this whole section, not just one step of
> it, whenever asked to stop "the application" or "the solution".

Reverse order — application and service are just processes; the datastore is a container that
keeps running (and keeps its data) until you stop it explicitly.

### Normal case: you have the terminals open

```bash
# Ctrl+C in the bank-harness-fe terminal (customer application)
# Ctrl+C in the bank-harness terminal (banking service)

cd ../bank-harness
docker compose down            # stop MongoDB; add -v to also delete its data volume
```

### If a process is orphaned (no terminal to Ctrl+C in)

This happens if whatever started `npm run dev` exited without stopping its child — the service
or application keeps running on its port with nothing left attached to stop it. Confirmed to
happen when a Claude Code session ends mid-run: the background process survives the session.
Find and stop it directly instead:

**Windows:**
```bash
netstat -ano | grep ":3000" | grep LISTENING     # find the PID in the last column — 5174 for the app
powershell -Command "Stop-Process -Id <PID> -Force"
```

**macOS/Linux:**
```bash
lsof -ti :3000 | xargs kill      # 5174 for the app
```

### Verify everything actually stopped

**Always run this after stopping — don't report it as stopped until this test confirms it.**
Ctrl+C and `docker compose down` can silently fail to kill everything (that's exactly what
happened here: the front end survived as an orphaned process bound to IPv6 only, and looked
stopped until this test was actually run). Treat this as a required last step, not an optional
check.

Don't check IPv4 loopback (`127.0.0.1`) alone — Vite (the customer application's dev server)
can end up bound to the IPv6 loopback (`::1`) only, which an IPv4-only check will silently miss
and report as free when it isn't. Use `curl`, which resolves `localhost` the way a browser
would:

```bash
for p in 3000 5174 27017 8081; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 1 "http://localhost:$p" 2>/dev/null)
  [ "$code" = "000" ] && echo "port $p: free" || echo "port $p: still in use (HTTP $code)"
done
```

A real HTTP status code (even an error page) means something is still listening; "connection
refused" means it's actually stopped. If you check with `netstat` instead, look specifically
for a `LISTENING` line — entries in `TIME_WAIT`/`FIN_WAIT_2`/`CLOSE_WAIT` are just leftover
connections closing down on their own, not a still-running server.

All four stopped = fully down. If you only Ctrl+C'd the service and application and haven't run
`docker compose down` yet, 27017/8081 still responding is expected, not a leak.
