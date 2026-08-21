# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A collection of standalone browser games for kids, published as GitHub Pages from the repo root
(https://vrana.github.io/games/). [index.html](index.html) is the menu; each game lives in its own directory and is
completely independent of the others — there is no shared library, no build step, no package manager, and no bundler.
Every game is plain HTML + CSS + ES5-era JavaScript loaded with `<script src>`.

## Running and testing

- **Any game**: open its `index.html` in a browser. `file://` works for everything except games that read
  `localStorage` or `URL.searchParams` reliably; when in doubt serve the repo root:
  ```bash
  python -m http.server 8000
  ```
- **Monopoly / Dostihy tests**: open `monopoly/dostihy_test.html`. It re-loads the same production scripts plus
  `testing.js` and `dostihy_test.js`, and prints a green/red line per test into `#tests`. There is no runner CLI and no
  single-test filter — comment out entries in the `runTests([...])` array to narrow it down. Tests are the only
  automated checks in the repo; the other games have none.
- **Prší** (the only non-static game): PHP + Ratchet WebSocket server, `php prsi/bin/server.php` (listens on 3255).
  `prsi/vendor/` is committed, so no `composer install` is needed. Note the browser client the README mentions
  (`web/index.html?server=<ip>`) is not in the repo — only the server side is.

## Monopoly / Dostihy architecture

The two board games in `monopoly/` share one engine. Everything is a global; **script order in the HTML files is the
architecture** and must be preserved when adding files:

1. Field types — `player.js`, `start.js`, `place.js`, `service.js` (Rail + Service), `tax.js`, `cards.js`
2. `state.js` — save/load/undo
3. **The board**: `monopoly.js` *or* `dostihy.js` — this is the variant switch. Each defines the global `fields` array
   and, crucially, mutates the prototypes above (`Player.prototype.money`, `Rail.prototype.amounts`, `start.earns`,
   `Place.prototype.bettable`/`multiUpgrades`, …) to reskin the same engine.
4. `game.js` — shared helpers plus a bottom IIFE that builds the whole DOM (score table, buttons, dice, one `.field`
   div per entry in `fields`). It requires `fields` to already exist.
5. `ui.js` — turn loop, key bindings, and `loadFromStorage()` at the very bottom. In the test page this is replaced by
   `testing.js` + `dostihy_test.js`.

Key contracts:

- A field is any object with `visit(player, diced)`. Optional members the engine looks for: `getEarns()`,
  `updateEarns()`, `price`, `earns`, `onclick`, plus `index`/`div` which `game.js` assigns. Plain object literals
  (`{name: 'Parkoviště'}`) are valid fields.
- The 40-field board is hard-coded: `position(i)` in `game.js` maps index → pixel coordinates for a 10×10 loop, and
  `cards.js` / tests reference absolute indexes (jail is 10 and 30). Changing the board length breaks both.
- **Questions are a stack, not a callback chain.** `ask()` pushes `{message, player, callback}` onto the global
  `questions`; Enter (`doConfirm()`) runs the top callback and pops it only if it does not return `false`; Esc
  (`cancel()`) discards a stacked follow-up question without running it, and is disabled while only one is pending. `questions[0].primary` marks the question raised by the current move, which is
  what `undo()` restores. Prompts embed raw HTML inputs (`<input class=price>`, `<select class=buyer>`) into the
  message and the callback reads them back via `last(document.getElementsByClassName('price')).value`.
- **Persistence**: `saveToStorage()` after every confirmed action writes `save()` to `localStorage[location.pathname]`
  (so Monopoly and Dostihy get separate slots) and pushes onto `undoQueue`. `undo()` deliberately does *not* write to
  storage, which makes a page reload act as redo.
- `translate('… {$var} …', {var: …})` is used for all engine strings; `translations` in `game.js` currently only holds
  plural forms. Board/field names are Czech literals, engine messages are English.
- `escape()` is applied to player names only; message text is otherwise inserted as `innerHTML`.

## Conventions

- Tabs for indentation, single quotes, ES5 in the older games (`var`, `function`, prototype methods); the newest ones
  (`namorni-bitva`) use `let`/default parameters. Match the file you are editing rather than modernizing it.
- Unfinished ideas are tracked as `// TODO:` comments in the source, and `clovece/README.md` documents that game's
  known design flaws — read it before refactoring `clovece/script.js`.
- Commit subjects are `Game: Imperative sentence.` (e.g. `Dostihy: Display stats`, `Piskvorky: Fix right column
  click`), with no prefix for repo-wide changes (`Mobile friendly`). Game names in the prefix are capitalized and
  unaccented.
