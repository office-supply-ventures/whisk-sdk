# @whisk/steakhouse

## 0.1.0

### Minor Changes

- c5a77e4: feat(steakhouse): add @whisk/steakhouse package with subpath exports

  - New `@whisk/steakhouse` package with SteakhouseClient, getVaults query
  - New `@whisk/steakhouse/react` subpath with SteakhouseProvider, useVaults hook
  - New `@whisk/steakhouse/metadata` subpath with chain/vault configs

  BREAKING CHANGE: `@whisk/client` simplified to core only

  - Removed `getVaultSummaries` action (moved to @whisk/steakhouse)
  - Removed `WhiskActionFn` type (now SteakhouseQueryFn in @whisk/steakhouse)
  - Deleted `@whisk/react` package (use @whisk/steakhouse/react instead)

  Migration:

  ```ts
  // Before
  import { WhiskClient, getVaultSummaries } from "@whisk/client";
  import { WhiskProvider, useVaultSummaries } from "@whisk/react";

  // After
  import { SteakhouseClient, getVaults } from "@whisk/steakhouse";
  import { SteakhouseProvider, useVaults } from "@whisk/steakhouse/react";
  ```

### Patch Changes

- Updated dependencies [c5a77e4]
  - @whisk/client@1.0.0
