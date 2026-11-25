# Operação Tesouraria na Black Friday

A three-hour, Brazilian Portuguese classroom simulation for the Senac Paraná Technical Administration course, UC 14. Teams decide how to pay for stock, receive a sale, cover a shortfall, and invest surplus cash.

[Open the lesson on GitHub Pages](https://profmv.github.io/senac-uc14-tesouraria-black-friday/)

## Classroom use

1. Before class, review or print the [teacher guide](guia-professor.html) and the [lesson plan](plano-de-aula.html). Set up a projector, a board, paper, and calculators. A phone calculator is sufficient.
2. At 19:00, open the [hub](index.html) and select **Iniciar apresentação**. Use the opening vote to check whether students recognize a change in the percentage base.
3. Open **Placar** and name four to six teams. Each round starts with the question. Start a five-, ten-, or fifteen-minute countdown, collect the choices and reasoning, then reveal the worked answer and enter points.
4. During round three, reveal the solution and vary the chart horizon from one to twelve months. The four-month decision and six-month revolving-credit example stay fixed in the answer.
5. At 21:20, compare the timing and size of cash movements. Close at 22:00 with individual explanations and introduce the 02/12 Excel lesson.

## Controls and storage

| Action | Control |
| --- | --- |
| Next or previous slide | Right or left arrow. Space also advances when focus is on the slide. |
| Toggle fullscreen | F |
| Toggle teacher notes | P |
| Reveal or hide the answer | R |
| Close a panel | Escape |

The teacher drawer appears on the projected screen when mirroring a display. The separate teacher guide can stay open on a phone. The scoreboard, guide checkboxes, and theme persist in the browser where they were set. The hub calculators update as inputs change and accept decimal commas.

## Run and publish

Open the downloaded project's index.html directly, keeping assets alongside it. The charts, fonts, and illustration ship with the site. No build or account is required to teach from a local copy.

GitHub Pages serves the root of main. The empty .nojekyll file enables direct static delivery. Charts use Chart.js 4.4.7. Font and chart licenses accompany the files in assets/fonts and assets/vendor.

## Verification

From the repository root, run `python artifacts/verify_lesson.py` with Python, html5lib, beautifulsoup4, and Node.js installed. Browser verification also requires Playwright for Python and Chrome, an HTTP server serving this directory, and its URL as the argument to `python artifacts/check_browser.py`.
