# Word Search

Browser word search game with German words. Vanilla JS, built with Vite, deployed to GitHub Pages.

- `src/js/main.js`: all game logic (grid, word placement, selection, timer)
- `src/css/style.css`: styles
- `public/data/wordlist.json`: word list, key `words`
- `index.html`: page markup

## Run

```sh
bun install
bun run dev      # dev server
bun run build    # production build into dist/
bun run deploy   # build and push dist/ to gh-pages
```

## Check

No tests and no CI. Check a change with `bun run build` and by playing it in `bun run dev`.
`eslint.config.mjs` and `prettier.config.mjs` exist, but neither tool is a dependency.
