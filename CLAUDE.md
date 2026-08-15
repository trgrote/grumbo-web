# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The web front end for "The Grumbros" — a fun/personal site hosting D&D character tools (attack sheets/calculators for a Paladin and a Gloom-Stalker Ranger character). React + TypeScript + Vite, styled with Tailwind v4 and shadcn/ui (Radix) components.

## Commands

- `npm run dev` — start the Vite dev server (test locally)
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run ESLint over the repo
- `npm run preview` — preview the production build locally
- `npm run test` — run the Vitest suite once
- `npm run test:coverage` — run the suite with coverage

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
- **Shared dice/formatting utils** (`src/utils/Dice.tsx`, `src/utils/Formatting.tsx`): `RollDie`/`RollDice` (RNG-injectable, default to `Math.random`) and `RollArrayToString`/`JoinWithElement` are used by both character pages' command/state-function modules — put character-agnostic helpers here rather than duplicating them per page.

### Attack sheets — Command pattern (`src/pages/gloomstalker/AttackSheet/`, `src/pages/paladin/AttackSheet/`)

This is the most involved part of the codebase, and both character pages now follow the same shape. The attack flow (roll to hit → confirm hit/miss → roll damage → results) is modeled as an explicit state machine driven by a command pattern, not ad hoc `useState` calls:

- `GloomStalkerTypes.tsx` / `PaladinTypes.tsx` define the full sheet state (composed from `PreHitRollInfo` / `PostHitRollInfo` / `PreDamageRollInfo` / `PostDamageRollInfo`-style interfaces) and an `AttackStep` enum tracking which step of the flow is active.
- `*AttackSheet.tsx` holds a `useReducer(AttackSheetStateReducer, ...)` and renders one `Steps/*Step.tsx` component per `AttackStep` value, passing down `state` and `dispatch`.
- `AttackSheet/AttackSheetStateReducer.tsx` is a trivial reducer: `command.apply(state)` — all actual logic lives in the command classes.
- `AttackSheet/Commands/` contains one class per action (e.g. `RollForAttackCommand`, `ConfirmIsHitCommand`, `SetAdvantageCommand`), each implementing an `I*AttackSheetCommand.apply(prevState) => newState` interface. `dispatch(new SomeCommand(...))` is how Step components trigger transitions. `Commands/AttackSheetCommands.tsx` is the barrel file re-exporting all commands — add new commands there too.
- `AttackSheet/AttackSheetStateFunctions.tsx` holds shared pure helpers used by commands (dice pool builders, derived-value selectors, building a `HistoryRecord` from final state via an injectable clock).
- When the sheet's `AttackStep` reaches `Results`, an effect in `*AttackSheet.tsx` converts the state into a `HistoryRecord` and calls `addToHistory`/`addToRollHistory`, which is what actually persists it (via the page's `useEffect` → `SaveLocal*Storage`).

The two pages' commands/state functions/types are separate (not shared through a common interface) since the underlying game rules genuinely differ — don't assume identical mechanics, just identical structure.

### Testing (`npm run test`)

Vitest + jsdom, configured inline in `vite.config.ts` (`test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] }`). Tests are co-located as `*.test.tsx` next to the source file, one per command/state-function/reducer module — see `AttackSheet/Commands/*.test.tsx` and `AttackSheet/AttackSheetStateFunctions.test.tsx` in either character page for the convention. Coverage is currently pure-logic only (commands, selectors, reducers); no React Testing Library render tests exist yet even though the dependency is installed.

Each `AttackSheet/test/fixtures.ts` exports a fixed `*Info` fixture plus a `buildTestState(overrides)` helper built on top of the real default-state factory — use it instead of constructing state objects by hand. Nondeterminism (dice rolls, timestamps) is handled by constructor/parameter-injected `rng`/`now` functions defaulting to `Math.random`/`Date.now`, never by mocking globals — pass `() => 0` for the lowest die face, `() => 0.999` for the highest.

### UI components

`src/components/ui/` are shadcn/ui components (Radix primitives + `class-variance-authority` + `tailwind-merge`, style "new-york"). Prefer reusing/extending these over adding new UI primitives; use `npx shadcn add <component>` conventions if adding more (uses `components.json` config, base color `neutral`).

## Style notes

- Indentation is tabs, not spaces (see `.vscode/settings.json`: `insertSpaces: false`, `tabSize: 4`).
- Semicolons are inserted (formatOnSave enabled).
