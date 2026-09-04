# Releasing Gablura Client

How to cut a release. The backend repo (`Gablura-backend`) uses the same steps —
**keep both repos on the same version**.

## Versioning

- SemVer: `MAJOR.MINOR.PATCH`
  - `MAJOR` — breaking changes (routes, data shape, auth)
  - `MINOR` — new features (backward compatible) — most of our releases
  - `PATCH` — bug fixes only
- **Keep the version identical across both repos.** The product ships as one;
  divergent versions make deploys and rollbacks confusing.
- Pre-releases before a final tag: `v1.1.0-beta.1`, `v1.1.0-rc.1` (as GitHub
  pre-releases).
- Tag history: `v1.0.0-beta`, `v1.0.0-stable`, `v1.1.0`. The `package.json`
  version must match the tag (it was stale at `0.1.0` before v1.1.0 — don't let
  that drift again).

## Tag format

- Annotated tags only: `v1.1.0` (never lightweight tags).
- Tag the `chore(release)` commit created by `npm version` — never tag an
  arbitrary commit.

## Release steps

```bash
# 0. Pre-flight
git checkout main && git pull
git status                    # must be clean

# 1. Local sanity checks (CI runs the full suite on push)
npm run lint
npm run test

# 2. Bump + tag (creates a commit AND an annotated tag)
npm version 1.1.0 -m "chore(release): frontend v1.1.0"

# 3. Verify
git tag -l                    # v1.1.0 present
git cat-file -t v1.1.0        # prints "tag" (annotated)

# 4. Ship — Vercel auto-deploys main
git push origin main --tags

# 5. GitHub Release — title `v1.1.0`, notes from:
git log --oneline --no-merges v1.0.0-stable..HEAD
```

## Deployment & rollback

- Vercel auto-deploys on push to `main`; the build command is
  `prisma generate && next build`.
- After deploy, verify the public pages (`/`, `/pricing`, `/cookies`) and a
  login → dashboard round trip.
- Rollback: Vercel → pin the previous deployment.
