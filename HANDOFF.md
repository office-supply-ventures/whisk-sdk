# SDK Handoff Guide

This branch (`steakhouse-handoff`) has all the code changes already applied. You just need to set up npm publishing and you're ready to go.

The lower-level packages (`@whisk/graphql` and `@whisk/client`) remain published by us on npm. Your package depends on them as regular npm dependencies — no need to fork or republish those.

---

## What's Been Done on This Branch

- Renamed `@whisk/steakhouse` → `@steakhouse/sdk` (package.json, all imports, docs, example app)
- Removed `packages/graphql/` and `packages/client/` (consumed from npm instead)
- Pinned `@whisk/client@0.0.19` and `@whisk/graphql@0.0.18` as npm dependencies
- Removed `schema:sync` and `check:graphql` scripts (those were for the graphql package)
- Reset version to `0.0.0`, cleared old changesets and changelogs
- Updated all docs, example app, and CI references

## What You're Publishing

```
@steakhouse/sdk        ← you publish this
@whisk/graphql         ← stays on npm, published by us
@whisk/client          ← stays on npm, published by us
```

This package has two subpath exports:

| Import | Purpose |
|--------|---------|
| `@steakhouse/sdk` | Core: SteakhouseClient, query functions |
| `@steakhouse/sdk/metadata` | Chain/vault config and metadata |

---

## 1. npm Scope Setup

1. Create an npm organization at https://www.npmjs.com (e.g. `steakhouse`) to claim the `@steakhouse` scope
2. Link your GitHub repo to npm for publishing — the CI workflow uses GitHub's OIDC (`id-token: write`) and npm provenance to authenticate, so no npm token is needed

---

## 2. Update Repository URL

The `repository` field in `packages/steakhouse/package.json` currently points to a placeholder. Update it to your actual GitHub repo:

```diff
  "repository": {
    "type": "git",
-   "url": "https://github.com/steakhouse-financial/steakhouse-sdk.git",
+   "url": "https://github.com/YOUR_ACTUAL_ORG/YOUR_ACTUAL_REPO.git",
    "directory": "packages/steakhouse"
  },
```

---

## 3. Install and Verify

```bash
pnpm install
pnpm build
pnpm check:types
pnpm test
```

---

## 4. First Publish

```bash
pnpm changeset
# Select @steakhouse/sdk, choose "patch", write "Initial release"

git add -A && git commit -m "chore: initial changeset"
git push
```

Merge to `main` → CI creates a "Version Packages" PR → merge that → CI publishes to npm.

---

## 5. Keeping Up-to-Date with Upstream

When we release new versions of `@whisk/graphql` or `@whisk/client`:

```bash
# Update the dependency versions in packages/steakhouse/package.json
pnpm update @whisk/graphql @whisk/client

# Rebuild and test
pnpm build && pnpm check:types && pnpm test
```

We'll communicate breaking changes via semver (major bumps).

---

## 6. Day-to-Day Workflow

```bash
# Install deps
pnpm install

# Dev mode (watch + rebuild)
pnpm dev

# Run checks
pnpm check        # biome lint + format
pnpm check:types  # typecheck
pnpm test         # vitest

# Create a changeset for your changes
pnpm changeset
# Select @steakhouse/sdk, choose bump type, write summary

# Commit (including the .changeset/*.md file)
git add -A && git commit
```

### Adding vault metadata

Vault configs live in `packages/steakhouse/src/metadata/vaults/`. Add/edit markdown files there, then run `pnpm generate:vaults` to regenerate the TypeScript config. This runs automatically during `pnpm build` and `pnpm dev`.

### Publishing a release

1. Merge your PR to `main`
2. CI creates a "Version Packages" PR automatically
3. Review the version bumps and changelogs
4. Merge the "Version Packages" PR
5. CI publishes to npm automatically

---

## Checklist

- [ ] Create npm organization and `@steakhouse` scope
- [ ] Update `repository` URL in `packages/steakhouse/package.json`
- [ ] Run `pnpm install && pnpm build && pnpm check:types && pnpm test`
- [ ] Create first changeset and merge to trigger initial publish
- [ ] Update consuming apps to import from `@steakhouse/sdk` instead of `@whisk/steakhouse`
