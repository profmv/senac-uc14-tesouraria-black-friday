# Project instructions

This buildless, Portuguese-language classroom site runs from index.html. The README describes teaching, publishing, and verification.

```json
{"entry":"index.html","language":"pt-BR","runtime":"static HTML, CSS and browser JavaScript","distribution":"GitHub Pages, main at /","validation":["python artifacts/verify_lesson.py","python artifacts/check_browser.py <served-site-url>"],"governance":{"database":"docs/governance.db","tool":"%GIT_REPO_LOCATION%/antigravity-workspace/scripts/gov.py","environment":{"GOV_DB_PATH":"docs/governance.db"},"handoffs":"docs/handoff/","evidence":"docs/verification.md"}}
```

Preserve the four scenarios, their assumptions, the indicated time blocks and the published relative URLs. Apply changes to related slides, teacher guidance and verification together. Keep check scripts and transient evidence in artifacts.
