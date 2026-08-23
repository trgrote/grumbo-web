# Grumbo Web Front End
This is the web front end for The Grumbros website where we try our dumb stuff, just for fun.

# TODO
- The "can't confirm a Hit on a natural 1" rule lives only in the step component's `disabled` props. `ConfirmIsHitCommand` would still produce the contradictory state if dispatched directly, and any history record saved *before* PR #34 in that state renders as "Critical Hit" retroactively. Both characters share this; only changing `GetHitStatusText` would fix the stored records, at the cost of the two sheets no longer matching.
- Neither character's `AttackHistoryDetails` has render tests — coverage is still pure-logic only (commands, selectors, reducers), even though React Testing Library is already installed.
- Minor wording: the Paladin damage note reads "Level 4+ Spell Slot added 5d8 Radiant". "Level 4 or Higher Spell Slot" reads better. Kept as-is because `4` is a bucket, not an exact level — a bare "Level 4" would claim precision the app never captures.
- `GetHighestAttackRoll` / `GetHighestHitRoll` both do `Math.max(...attackRolls)`, which is `-Infinity` on an empty array. Unreachable from any path that produces a history record today, but it's a shared sharp edge in both characters' state functions.

# Test Locally
`npm run dev`

# Run Unit Tests
- `npm run test` — run the Vitest suite once
- `npm run test:coverage` — run the suite with coverage

# Deploy
- site location: http://www.grumbo.me:3000/
- In `/var/www/grumbo-web`: 
	- `git pull` 
	- `docker compose up -d --build`

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
