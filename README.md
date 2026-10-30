# date-ask

Ask someone out with a link where "no" simply isn't an option.

You create an invitation with her name and a few date ideas, then send her the link.
She sees **"Hej, Basia. Umówimy się?"** with two buttons. The "no" button runs away
from the mouse on desktop and from her finger on mobile, while "yes" keeps growing.
After saying yes she picks one of your ideas, can change her mind, and confirms to a
burst of fireworks. You follow everything on your own status page.

## Styles

The sender picks one of five styles with live previews, and can try the full
invitation in demo mode (`/podglad`) before creating it:

| Style      | Mood                                             |
| ---------- | ------------------------------------------------ |
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
- [Drizzle ORM](https://orm.drizzle.team) on **SQLite / libSQL**: a local file in development,
  [Turso](https://turso.tech) in production
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

The project uses `adapter-auto`, so it deploys to Vercel or Netlify without extra config.
Create a database on Turso and set these environment variables:

```
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=...
```

Then run `npm run db:push` once with the same variables to create the tables.

## Project structure

```
src/
├── lib/
│   ├── components/
│   │   ├── InvitationFlow.svelte         question → pick → review → fireworks
│   │   ├── InvitationPreview.svelte      static preview of a style
│   │   ├── RunawayButton.svelte          the button that can't be pressed
│   │   └── ThemePicker.svelte
│   ├── themes.ts / themes.css            the five styles
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
