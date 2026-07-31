---
title: Testing
sidebar_position: 4
---

# Testing

MistWarp inherits Scratch's test setup: [Jest](https://jestjs.io/) in scratch-gui and [tap](https://node-tap.io/) in scratch-vm. This page lists the suites and how to run them.

## scratch-gui

scratch-gui defines its test scripts in `package.json`. The full run chains linting, unit tests, a build, and integration tests:

```bash
pnpm test
```

That is rarely what you want during development. The individual pieces are more useful.

### Linting

```bash
pnpm run test:lint   # eslint . --ext .js,.jsx
```

### Unit tests

The unit tests live under `test/unit/`. They run with Jest and Enzyme (React 16). Two suites are defined:

```bash
pnpm run test:unit     # the addon test suite (test/unit/addons)
pnpm run test:collab   # the collaboration engine tests (test/unit/collaboration)
```

`pnpm run test:collab` covers the collaboration sequencer engine under `src/lib/collaboration/` and is the suite to run when working on live collaboration. You can run a single Jest file directly:

```bash
npx jest test/unit/collaboration/<file>.test.js
```

### Integration tests

Integration tests under `test/integration/` drive a headless browser (Selenium with chromedriver) against a real build. They require a build first:

```bash
pnpm run build
pnpm run test:integration
```

You can run a single integration file, and watch the browser instead of running headless:

```bash
npx jest --runInBand test/integration/backpack.test.js
USE_HEADLESS=no npx jest --runInBand test/integration/backpack.test.js
```

If chromedriver is incompatible with your installed Chrome, install a matching version with `pnpm add -D chromedriver@<version>`.

## scratch-vm

scratch-vm uses tap. From the scratch-vm checkout:

```bash
npm run tap            # unit and integration tests
npm run tap:unit       # unit tests only
npm run tap:integration
npx tap test/unit/<file>.js   # a single file
```

The VM is where blocks and the compiler live, so this is the suite to run when changing runtime behavior. When adding or changing a block, add or update a fixture under `test/` so the behavior is pinned.

## What to test

- Changing a block or the compiler: add a scratch-vm tap test.
- Changing collaboration: run `pnpm run test:collab`.
- Changing a React component or container: add a Jest unit test under `test/unit/`.
- Anything user-facing that touches the browser: consider an integration test.

## See also

- [Building and Running](/contributing/building-running)
- [Contributing](/contributing/guidelines)
