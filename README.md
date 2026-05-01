# Grumbo Web Front End
This is the web front end for The Grumbros website where we try our dumb stuff, just for fun.

# TODO
- [ ] Add input validation to only allow integers for modifier fields
- [ ] Implement Gloom Stalker Attack Page (https://www.dndbeyond.com/characters/75379398)

## Gloom Stalker Questions
- For Dread Amubusher, if you don't attack your first turn of combat, does that mean you lose out on that additonal attack? I.e. It's not your first attack of combat, it's only your attack on the first round.
- I think, if you are attacking with a bow and have advantage, you basically get super advantage where you can roll with 3 dice. Elven Accuracy: "Whenever you have advantage on an attack roll ..., you can reroll one of the dice once." Assuming you always re-roll the highest die, that's effectivlty rolling 3 dice and taking the highest.
- Piercer: Reroll Damage (Special)
Once per turn, when you hit a creature with an attack that deals piercing damage, you can reroll one of the attack’s damage dice, and you must use the new roll.
	- The rule doesn't specify you must re-roll a damage die of the piercing damage. For example, if you also deal an additonal d6 damage, you could technically re-roll that value. Although, with the condition, the spirit of the rule seems like it ought to be one of the piercing damage's die.
- Laura's version of the Dragon's Wrath Longbow _also_ does fire damage, but damage can only be one type, so which damage die counts for which type?
- Piercer - Critical hit
	- That extra d8 is applied _after_ the other dice are doubled (https://www.reddit.com/r/dndnext/comments/nmbiqa/piercer_feat_double_dice/).

# Test Locally
`npm run dev`

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
