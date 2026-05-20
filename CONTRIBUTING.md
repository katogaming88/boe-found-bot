# Contributing

Thanks for your interest in contributing to BOE Found.

---

## Branching

| Branch prefix | Purpose | Example |
|---|---|---|
| `main` | Always deployable. Direct commits are not allowed — open a PR. | — |
| `feature/<name>` | New functionality | `feature/multi-channel-routing` |
| `fix/<name>` | Bug fixes | `fix/health-endpoint-crash` |
| `hotfix/<name>` | Urgent production fixes branched directly from `main` | `hotfix/auth-bypass` |
| `chore/<name>` | Non-code changes (docs, deps, config) | `chore/update-readme` |

Branch from `main` unless the guidelines above say otherwise. Delete your branch after it merges.

---

## Versioning

This project uses [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

| Increment | When |
|---|---|
| `PATCH` (0.0.x) | Bug fixes, docs, dependency bumps — no new features |
| `MINOR` (0.x.0) | New backwards-compatible features |
| `MAJOR` (x.0.0) | Breaking changes to the API or env var contract |

While the version is `0.x.x`, minor versions may include small breaking changes. Once `1.0.0` is tagged, the full SemVer contract applies.

**Per-PR changelog rule:**
1. Every new PR adds a versioned section to `CHANGELOG.md` with today's date and bumps `package.json` to match.
2. Additional commits pushed to the **same open PR** do not need a new version — just append items to that PR's existing entry.
3. `## [Unreleased]` is a placeholder for changes not yet assigned to a version; leave it empty while a versioned entry exists below it.
4. The official public release will be `1.0.0`.

---

## Pull Requests

- Keep PRs focused — one logical change per PR.
- Fill out the PR template completely.
- Link any related issues with `Closes #N` in the PR description.
- All checks must pass before merging.
- Squash-merge preferred to keep `main` history clean.

---

## Commit Messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) style:

```
<type>: <short description>

[optional body]
```

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.

Examples:
```
feat: add multi-channel routing via channel field in POST body
fix: return 400 when content field is an empty string
chore: bump discord.js to 14.17.0
docs: add cron-pinger workaround to Render section
```

---

## Local Setup

```bash
git clone https://github.com/Katorri/boe-found.git
cd boe-found
npm install
cp .env.example .env   # fill in your values
npm start
```

See the main [README](README.md) for full setup and deployment instructions.
