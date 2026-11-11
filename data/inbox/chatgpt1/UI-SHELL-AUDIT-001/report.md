# AUTO LINGO — UI Shell Static Audit
Date: 2026-11-12
Mission: AI1-UI-SHELL-AUDIT-001
Scope: Static inspection of `index.html`, `app-shell.js`, `app.js`, and relevant CSS selectors. No files were modified. No live-browser/mobile-device test was performed.

## Findings

### P1 — The “How it works” section is detached from all app pages
- `app-shell.js` registers `sections.how` but does not include it in any `panes` array.
- The shell moves only nodes listed in `panes`; therefore `#how` remains inside the original `<main id="home">` outside the new `.app-shell`.
- CSS sets `body{overflow:hidden}` for the app layout and the only intended content scroller is `.app-content`. The detached section is therefore outside the navigable app and is likely inaccessible.
- Recommendation: either add `sections.how` to the home pane (if desired) or remove the obsolete section reference/markup intentionally. Do not leave it orphaned.

### P1 — URL hash is written but not restored
- `show(key)` calls `history.replaceState(..., '#'+key)`, but initialization always calls `show('home')`.
- There is no `hashchange`/initial-hash routing logic.
- Result: opening a deep link such as `/#dictionary` or refreshing while on a page returns to Home; browser Back/Forward cannot navigate between app pages.
- Recommendation: validate the hash against the five allowed page keys on startup and handle `hashchange` (or use `pushState` plus `popstate`, consistently).

### P2 — Back-to-paths button has two click handlers
- `app.js` attaches a handler to `#backPaths` that hides the detail view and scrolls to `#paths`.
- `app-shell.js` attaches another handler to the same button that calls `show('learn')`.
- Both handlers execute for one click. This creates competing navigation/scroll behavior and makes the page transition order dependent on listener registration.
- Recommendation: keep one owner for this control. Prefer a single app-shell navigation handler that also hides the detail panel.

### P2 — Mobile sidebar has no explicit outside-click/backdrop close behavior
- The sidebar opens by toggling `.sidebar-open` and closes when a `data-page` button is selected.
- No backdrop or document-level outside-click handler is present for taps elsewhere in the app.
- Recommendation: add an accessible backdrop and close on backdrop tap and Escape; ensure focus behavior is usable.

## Positive checks
- The five primary destinations are explicitly represented in the shell.
- The mobile dock contains the same five page keys as the desktop sidebar.
- The main content container is scrollable independently, consistent with an app-style layout.
- Existing section nodes are moved rather than cloned, which preserves the DOM IDs used by the legacy learning scripts.

## Verification limits
This is a static code review only. It does not establish that the current GitHub Pages deployment reproduces every issue, nor does it replace browser testing at desktop, tablet, and mobile widths. Before changing production files, reproduce the findings in a browser and test lesson modal, path detail/back navigation, placement test, dictionary search, learning lab, and localStorage progress.

## Recommended next action
Create a small isolated fix branch or PR for the two P1 findings first; then address duplicate back-button ownership and mobile sidebar dismissal. Keep this report as the audit record and do not treat the UI as browser-QA-passed.
