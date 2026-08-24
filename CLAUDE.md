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

### Attack sheets — Command pattern

This is the most involved part of the codebase. The attack flow (roll to hit → confirm hit/miss → roll damage → results) is modeled as an explicit state machine driven by a command pattern, not ad hoc `useState` calls.

**The flow is character-agnostic and lives in `src/attackSheet/`.** The Gloom Stalker is migrated onto it; the Paladin is not yet (it still has its own copy under `src/pages/paladin/AttackSheet/`, described at the bottom of this section). Migrating the Paladin is the intended next step.

- `AttackSheetTypes.tsx` defines `AttackStep`, `AttackSheetState<TCharacterState>` (which owns **only** `attackStep`; everything else lives under `characterState`, the in-progress state of the attack under that character's rules), `IAttackSheetCommand<TCharacterState>`, and `ICharacterAttackModel<TCharacterState>`.
- `ICharacterAttackModel` is the callback surface the shared flow calls into: `createInitialCharacterState`, `rollForAttack`, `setIsHit`, `rollForDamage`, `onStepReverted`. Its `steps: AttackStep[]` array is the single source of truth for step ordering — a character that omits a step (the Paladin has no `PostDamageRoll`) just leaves it out, and advancing/going back adapt automatically. Never hard-code a transition in a command; go through `GetNextStep`/`GetPreviousStep`/`GetFinalStep` in `AttackSheetStateFunctions.tsx`.
- `AttackSheetStateReducer.tsx` exports `CreateAttackSheetReducer(model)`, binding the model once so Step components can dispatch bare commands: `command.apply(state, model)`.
- `Commands/` holds the flow commands (`GoBack`, `Reset`, `AttackAgain`, `RollForAttack`, `ConfirmIsHit`/`Miss`, `RollForDamage`, `ConfirmDamage`, `Null`) plus `CharacterStateCommand`, the base for commands that only touch character state.
- `Steps/` holds the step **shell**: `AttackSheetStep` renders the header (title + description), the body grid and the footer, taking `title`/`description`/`actions`/`children`. A character's step supplies only its body and its footer buttons — never its own `SheetHeader`/`SheetFooter` markup. `GoBackButton` and `AttackAgainButton` live here too and dispatch `GoBackCommand`/`AttackAgainCommand` themselves, since stepping back and starting over are flow actions rather than character rules.

Per-character code then lives under `src/pages/<character>/AttackSheet/`:

- `<Character>Types.tsx` defines the character's own state slice (composed from `PreAttackRollInfo` / `PostAttackRollInfo` / `PreDamageRollInfo` / `PostDamageRollInfo`-style interfaces) and re-exports `AttackStep` from the shared module.
- `<Character>AttackModel.tsx` implements `ICharacterAttackModel` — this is where that character's rules live (how many d20s advantage rolls, which damage pools exist, what a Back clears).
- `Commands/` holds only the commands that encode actual game rules (`SetAdvantageCommand`, `ToggleFavoredEnemyCommand`, `RerollWorstDamageDieCommand`, …), each extending `CharacterStateCommand` and operating on `characterState` alone. `Commands/AttackSheetCommands.tsx` is the barrel: it re-exports the shared flow commands bound to this character's state (via TypeScript instantiation expressions) alongside the local ones, so Step components import everything from one place.
- `AttackSheetStateFunctions.tsx` holds that character's pure helpers (dice pool builders, derived-value selectors) — all typed against the character state, not the sheet state.
- `Steps/*Step.tsx` renders one step, wrapping its body in the shared `AttackSheetStep` and passing its footer buttons via `actions`.
- `<Character>AttackSheet.tsx` memoizes a model from the character's info, builds a reducer from it, and renders one `Steps/*Step.tsx` per `AttackStep`.
- When `AttackStep` reaches the final step, an effect in `<Character>AttackSheet.tsx` converts state into a `HistoryRecord` and calls `addToHistory`/`addToRollHistory`, which is what actually persists it (via the page's `useEffect` → `SaveLocal*Storage`).

**`HistoryRecord` is deliberately flat**, not nested like the sheet state — `CreateHistoryRecordFromState` spreads `characterState` and `attackStep` up to the top level. That's what lets records persisted before the refactor keep deserializing without a `storageVersion` bump. Don't "fix" the inconsistency without bumping the version and accepting the history loss.

The Paladin's not-yet-migrated copy follows the original shape: a local `AttackSheetStateReducer.tsx` (`command.apply(state)`), one `IPalAttackSheetCommand` implementation per action in `Commands/`, and a flat `PaladinAttackSheetState`. The two characters' rules genuinely differ (2d20 vs 3d20 advantage, Divine Smite vs three typed damage pools, no reroll) — don't assume identical mechanics, just identical structure.

### Testing (`npm run test`)

Vitest + jsdom, configured inline in `vite.config.ts` (`test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] }`). Tests are co-located as `*.test.tsx` next to the source file, one per command/state-function/reducer module — see `AttackSheet/Commands/*.test.tsx` and `AttackSheet/AttackSheetStateFunctions.test.tsx` in either character page for the convention.

Coverage is mostly pure logic (commands, selectors, reducers, character models). The one set of render tests is `src/attackSheet/Steps/AttackSheetStep.test.tsx`, covering the shared step shell and its two flow buttons. Vitest globals are **off** here, so Testing Library can't auto-register its cleanup — `src/test/setup.ts` calls `afterEach(cleanup)` for it. Without that, rendered trees pile up in `document.body` and queries start matching elements from earlier tests. `@testing-library/user-event` isn't a dependency; use `fireEvent`.

Each `AttackSheet/test/fixtures.ts` exports a fixed `*Info` fixture plus `buildTestState(overrides)` / `buildTestCharacterState(overrides)` / `buildTestModel(info)` helpers built on top of the real default-state factory — use them instead of constructing state objects by hand. `buildTestState` takes *flat* overrides and splits them into the two slices for you. Nondeterminism (dice rolls, timestamps) is handled by constructor/parameter-injected `rng`/`now` functions defaulting to `Math.random`/`Date.now`, never by mocking globals — pass `() => 0` for the lowest die face, `() => 0.999` for the highest.

`src/attackSheet/test/fixtures.tsx` provides a synthetic character model for testing the shared flow in isolation — including `stepsWithoutPostDamageRoll`, which pre-tests the Paladin's step shape. Keep Gloom Stalker specifics out of the shared tests.

Unit tests cover commands, selectors and the model; `src/pages/gloomstalker/AttackSheet/AttackSheetIntegration.test.tsx` covers the seam between them by driving whole flows through the real reducer, model and command barrel. Add to it when changing how the shared flow and a character model interact.

### UI components

`src/components/ui/` are shadcn/ui components (Radix primitives + `class-variance-authority` + `tailwind-merge`, style "new-york"). Prefer reusing/extending these over adding new UI primitives; use `npx shadcn add <component>` conventions if adding more (uses `components.json` config, base color `neutral`).

## Style notes

- Indentation is tabs, not spaces (see `.vscode/settings.json`: `insertSpaces: false`, `tabSize: 4`).
- Semicolons are inserted (formatOnSave enabled).
