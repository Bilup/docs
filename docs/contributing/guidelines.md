---
title: Contribution Guidelines
sidebar_position: 5
---

# Contributing

This page covers the practical workflow for getting a change into MistWarp: where the code lives, how the packages link together while you work, the style rules, and how to open a pull request. If you have not set up a local build yet, read [Building and Running](/contributing/building-running) first.

## Where the code lives

MistWarp is spread across several repositories under the [MistWarp organization on GitHub](https://github.com/MistWarp). The ones you are most likely to touch:

- [scratch-gui](https://github.com/MistWarp/scratch-gui) is the editor and the community site. Most UI work happens here.
- [scratch-vm](https://github.com/MistWarp/scratch-vm) runs projects and holds the block definitions and the compiler.
- [scratch-blocks](https://github.com/MistWarp/scratch-blocks), [scratch-render](https://github.com/MistWarp/scratch-render), [scratch-paint](https://github.com/MistWarp/scratch-paint), and [scratch-audio](https://github.com/MistWarp/scratch-audio) are the other engine packages.

See [Project Structure](/contributing/project-structure) for what each package does.

MistWarp is a fork of TurboWarp, which is a fork of [Scratch](https://scratch.mit.edu/). Because of that lineage, a lot of the code you read (and a lot of the fixes you make) are not MistWarp-specific. Bugs that also exist in upstream are often best reported or fixed upstream too.

## The pnpm link workflow

The engine packages are not fetched from npm during development. They are symlinked from your local sibling checkouts, so a change in, say, scratch-vm is picked up by the scratch-gui build without republishing anything. This only works if the packages are siblings in one parent directory.

From `scratch-gui`:

```bash
pnpm install
pnpm run link   # pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

If a later `pnpm install` ever resets the links, run `pnpm run link` again. `pnpm run reinstall` wipes `node_modules` and the lockfile, reinstalls, and re-links in one step.

A consequence worth remembering: because the links are by relative path, your directory layout is part of the build. Keep the checkouts named and placed as siblings.

## Style rules

Some rules are enforced by the linter, and some are project conventions you have to follow by hand.

Run the linter before you commit:

```bash
pnpm run lint   # eslint check
pnpm run fmt    # eslint --fix
```

Two conventions the linter does not catch, but which are hard project rules across every repository:

- **No code comments.** Do not add explanatory comments to code. The only comments allowed are lint-required markers such as `eslint-disable` lines. This applies to every MistWarp repository.
- **No emdashes.** Do not use emdashes anywhere: not in code, not in UI strings, not in prose. Use commas, parentheses, or "to" for ranges.

A few package-specific rules that are easy to trip over:

- scratch-gui CSS is processed with postcss-simple-vars only. There is no `lighten()` or `darken()`; use `color-mix()` instead.
- css-loader hashes and camelCases class names in scratch-gui. A bare `:global {}` block silently drops its rules; import truly global CSS with `import '!!style-loader!css-loader!./x.css'` instead.
- Community-site CSS custom properties use the `--mw-*` prefix. The editor sets bare property names such as `--text` on `documentElement`, so unprefixed names on the community side will collide. See [Theming](/internals/theming).
- Edits under scratch-blocks `core/` require a Closure recompile, and any new symbol must be exported in the `goog.global` block or Closure strips it. See [Building and Running](/contributing/building-running).

## Testing your change

Run the relevant test suite before opening a pull request. scratch-gui and scratch-vm have separate suites with separate commands, covered in [Testing](/contributing/testing). At minimum, lint must pass and the app must build.

## Opening a pull request

1. Fork the repository you are changing, or push a branch if you have access. Do not commit directly to the default branch.
2. Make your change on a topic branch with a descriptive name.
3. Run `pnpm run lint` (and the tests) and make sure the build succeeds.
4. Open a pull request against the corresponding MistWarp repository. Describe what the change does and why. If it fixes a bug, describe how to reproduce it.
5. If your change spans multiple packages (for example a VM change that the GUI depends on), note that in the description so reviewers can check out matching branches.

## Licensing

MistWarp inherits TurboWarp's and Scratch's licensing. TurboWarp's modifications to Scratch are under the GNU General Public License v3.0, and the original Scratch BSD license is retained where required. By contributing you agree your changes are released under the same terms. The bundled addons come from the [Scratch Addons](https://scratchaddons.com/) project; see [The Addons System](/internals/addons-system).

## See also

- [Building and Running](/contributing/building-running)
- [Project Structure](/contributing/project-structure)
- [Testing](/contributing/testing)
- [Deploying](/contributing/deploying)
- [Internals Overview](/internals/overview)
