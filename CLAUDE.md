# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The web front end for "The Grumbros" — a fun/personal site hosting D&D character tools (attack sheets/calculators for a Paladin and a Gloom-Stalker Ranger character). React + TypeScript + Vite, styled with Tailwind v4 and shadcn/ui (Radix) components.

## Commands

- `npm run dev` — start the Vite dev server (test locally)
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run ESLint over the repo
- `npm run preview` — preview the production build locally

There is no test suite configured in this repo.

### Deploy

Production runs at `http://www.grumbo.me:3000/` via Docker. Deploy process (on the server, in `/var/www/grumbo-web`):
```
git pull
docker compose up -d --build
```
The Dockerfile builds the app and serves `dist/` with `serve` on port 3000.

## Architecture

### Routing / layout

`src/main.tsx` defines routes with `react-router` (`BrowserRouter`), all nested under `MainLayout` (`src/layouts/MainLayout.tsx`), which renders a top nav plus an `<Outlet />`. Top-level pages: `/` (Home), `/paladin`, `/gloomstalker`.

### Path aliases

`@` → `src/`, `@assets` → `src/assets/` (configured in `vite.config.ts`; `@` is also mirrored in `tsconfig.app.json`, while `@assets` is only declared in the root `tsconfig.json`). shadcn component aliases are declared in `components.json` (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`).

### Character tool pages (`src/pages/paladin`, `src/pages/gloomstalker`)

Each character page follows the same shape: a top-level `*Page.tsx` renders a `Tabs` with an "Info" tab and a "History" tab, backed by two pieces of state (`*Info` and a list of history records) that are loaded from and persisted to `localStorage` on every change.

- **Local storage** (`src/utils/LocalStorage.tsx`): generic `GetLocalStorage`/`SaveLocalStorage` helpers keyed by a `storageKey` + `storageVersion`. If the version stored in `localStorage` doesn't match the current `storageVersion`, the default item is used instead (a cheap migration strategy — bump the version string when changing the shape of persisted data, e.g. `GloomStalkerLocalStorage.tsx`'s `storageVersion`).

### Gloom-Stalker attack sheet — Command pattern (`src/pages/gloomstalker/AttackSheet/`)

This is the most involved part of the codebase. The attack flow (roll to hit → confirm hit/miss → roll damage → apply modifiers/rerolls → results) is modeled as an explicit state machine driven by a command pattern, not ad hoc `useState` calls:

- `GloomStalkerTypes.tsx` defines `GloomStalkerAttackSheetState` (the full state object, composed from `PreHitRollInfo` / `PostHitRollInfo` / `PreDamageRollInfo` / `PostDamageRollInfo`) and the `AttackStep` enum that tracks which step of the flow is active (`PreHitRoll`, `PostHitRoll`, `PreDamageRoll`, `PostDamageRoll`, `Results`).
- `GloomStalkerAttackSheet.tsx` holds a `useReducer(AttackSheetStateReducer, ...)` and renders one `Steps/*Step.tsx` component per `AttackStep` value, passing down `state` and `dispatch`.
- `AttackSheetStateReducer.tsx` is a trivial reducer: `command.apply(state)` — all actual logic lives in the command classes.
- `Commands/` contains one class per action (e.g. `RollForAttackCommand`, `ConfirmIsHitCommand`, `RerollPiercingDamageDieCommand`, `SetAdvantageCommand`), each implementing `IGSAttackSheetCommand.apply(prevState) => newState`. `dispatch(new SomeCommand(...))` is how Step components trigger transitions. `Commands/AttackSheetCommands.tsx` is the barrel file re-exporting all commands — add new commands there too.
- `AttackSheetStateFunctions.tsx` holds shared pure helpers used by commands (e.g. dice rolling, building a `HistoryRecord` from final state).
- When the sheet's `AttackStep` reaches `Results`, an effect in `GloomStalkerAttackSheet.tsx` converts the state into a `HistoryRecord` and calls `addToHistory`, which is what actually persists it (via the page's `useEffect` → `SaveLocalGloomStalkerStorage`).

The Paladin page (`src/pages/paladin/`) predates this pattern and uses plain state objects (`AttackStates/*State.tsx`) instead of the command/reducer machinery — don't assume the two character pages share conventions.

### UI components

`src/components/ui/` are shadcn/ui components (Radix primitives + `class-variance-authority` + `tailwind-merge`, style "new-york"). Prefer reusing/extending these over adding new UI primitives; use `npx shadcn add <component>` conventions if adding more (uses `components.json` config, base color `neutral`).

## Style notes

- Indentation is tabs, not spaces (see `.vscode/settings.json`: `insertSpaces: false`, `tabSize: 4`).
- Semicolons are inserted (formatOnSave enabled).
