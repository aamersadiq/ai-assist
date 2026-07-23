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

Reverse order — application and service are just terminal processes; the datastore is a
container that keeps running (and keeps its data) until you stop it explicitly:

```bash
# Ctrl+C in the bank-harness-fe terminal (customer application)
# Ctrl+C in the bank-harness terminal (banking service)

cd ../bank-harness
docker compose down            # stop MongoDB; add -v to also delete its data volume
```
