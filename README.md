# date-ask

Ask someone out with a link where "no" simply isn't an option.

You create an invitation with her name and a few date ideas, then send her the link.
She sees **"Hej, Basia. Umówimy się?"** with two buttons. The "no" button runs away
from the mouse on desktop and from her finger on mobile, while "yes" keeps growing.
After saying yes she picks one of your ideas, can change her mind, and confirms to a
burst of fireworks. You follow everything on your own status page.

## Styles

The sender picks one of six styles with live previews, and can try the full
invitation in demo mode (`/podglad`) before creating it:

| Style      | Mood                                             |
| ---------- | ------------------------------------------------ |
| Romantyczny | Cherry red and butter yellow, the default       |
| Wieczór    | Midnight blue and gold with a serif, for a date  |
| Słodki     | Pastel lilac and peach, rounded and cute          |
| Ziomek     | Sky blue, chunky outlines, for friends            |
| Retro PC   | A Windows 95 dialog, for a joke invite           |
| Prosty     | Black on white, fits anything                    |

Each style is a set of CSS custom properties under `[data-theme]` in
`src/lib/themes.css`, plus its copy and fireworks colors in `src/lib/themes.ts`.

## How it works

| URL             | Who      | What                                                        |
| --------------- | -------- | ----------------------------------------------------------- |
| `/`             | you      | Create an invitation: her name and up to 6 date ideas       |
| `/dr5hg1`       | her      | The question, the runaway button, picking and confirming    |
| `/dr5hg1/status`| you      | Whether she opened it, what she chose, how often she tried "no" |
| `/podglad`      | you      | Demo of a style, nothing is saved                           |

Each invitation gets a random 6-character code (`a-z0-9`). The status page is simply the
invite link with `/status` appended, so it is easy to recover if you lose it.

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) with **Svelte 5** (runes) and TypeScript: server-side rendering,
  routing and the backend (load functions + form actions) in one app
- [Drizzle ORM](https://orm.drizzle.team) on **SQLite / libSQL**: a persistent SQLite file in production
- [Valibot](https://valibot.dev) for form validation
- [canvas-confetti](https://github.com/catdad/canvas-confetti) for the fireworks
- Plain scoped CSS, no UI framework

Forms work without JavaScript and are progressively enhanced with `use:enhance`.

## Getting started

Requires Node.js 20.19+, 22.12+ or 24+ (see `.nvmrc`; odd-numbered releases like 23 are not supported).

```bash
npm install
npm run db:push   # creates the tables in local.db
npm run dev       # http://localhost:5847
```

To open the app on your phone over the local network, run `npm run dev -- --host`.

## Scripts

| Script              | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Dev server on port 5847                      |
| `npm run build`     | Production build                             |
| `npm run preview`   | Preview the production build on port 5848    |
| `npm run check`     | Type-check Svelte and TypeScript files       |
| `npm run format`    | Format the code with Prettier                |
| `npm run db:push`   | Sync the database schema                     |
| `npm run db:studio` | Browse the database in Drizzle Studio        |

## Deployment

Production runs at https://date-ask.letscode.it using `adapter-node` and Docker.
Pushes to `main` build and check the app in GitHub Actions, transfer the image over SSH,
and start it in `/opt/apps/date-ask` with a health check. Configure GitHub secrets
`SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`, and `SERVER_KNOWN_HOSTS`.

`docker-compose.production.yml` connects the app to the server's existing `nginx-proxy`
network. Cloudflare provides public HTTPS and connects over HTTP (Flexible);
`HTTPS_METHOD=nohttps` prevents redirect loops. `ORIGIN` keeps SvelteKit form submissions
working through the proxy. No application secrets or external database are required.

SQLite lives in the named volume `date-ask_data`, mounted at `/app/data`.
Deployments never replace this volume. Each deployment saves a consistent SQLite backup
under `/app/data/backups` before applying versioned Drizzle migrations at startup.
Never use `docker compose down -v` on production: it deletes the database and backups.
Backups in this volume survive deployments, but do not protect against loss of the server.

For schema changes, run `npx drizzle-kit generate`, review and commit the generated SQL.
Production applies pending migrations automatically; do not use `db:push` there.
Local databases created with `db:push` can continue using it during development.

Manual operations from `/opt/apps/date-ask`:

```bash
export TAG=$(cat TAG)
docker compose -f docker-compose.production.yml ps
docker compose -f docker-compose.production.yml logs --tail=100 app
docker compose -f docker-compose.production.yml run --rm --no-deps app node scripts/backup.mjs
```

Failed startup restores the previous image when available. Database migrations are not
reversed automatically; keep migrations compatible with the previous release.

## Project structure

```
src/
├── lib/
│   ├── components/
│   │   ├── InvitationFlow.svelte         question → pick → review → fireworks
│   │   ├── InvitationPreview.svelte      static preview of a style
│   │   ├── RunawayButton.svelte          the button that can't be pressed
│   │   └── ThemePicker.svelte
│   ├── themes.ts / themes.css            the six styles
│   ├── server/
│   │   ├── db/schema.ts                  tables and relations
│   │   └── invitations.ts                data access
│   ├── fireworks.ts
│   └── validation.ts
├── params/code.ts                        matches 6-char invitation codes
└── routes/
    ├── +page.svelte                      invitation creator
    ├── [code=code]/
    │   ├── +page.svelte                  the invitation
    │   └── status/+page.svelte           status for the sender
    └── podglad/+page.svelte              style demo
```
