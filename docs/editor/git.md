---
title: Git version control
sidebar_position: 22
---

MistWarp has a full Git version-control system built into the editor. It tracks the history of your project so you can commit snapshots, look back through changes, work on branches, and push to a hosted repository. The whole repository, including its history, lives **inside the project file**, so it travels with the `.sb3`.

Version control suits larger or longer-lived projects, and it is the foundation for collaborating through pull requests rather than live editing.

## Opening version control

Open the **Tools** menu and choose **Git**, which opens the **Version Control** window. A sidebar down the left switches between Changes, History, Branches, Diff, Remote, Rotur Git, and Readme.

If the project is not under version control yet, you are offered **Initialize repository** to start one, or a field to **clone** an existing project by URL.

## Committing changes

The **Changes** view lists every file that has changed since your last commit, each tagged with a status: modified, added, or deleted. Write a message describing the change and click **Commit**. **Undo last commit** reverses the most recent one. Clicking a changed file opens its diff.

You can also have MistWarp commit for you on every save: turn on **Commit automatically when the project is saved** on the **Version Control** [settings](/editor/settings) page, where you also set your commit author name and email.

## History and diffs

**History** lists your commits, each with its message, short hash, and a colour-coded branch graph. Select a commit to see the files it changed, restore the project to it, or download it as an `.sb3`.

**Diff** shows a readable, line-by-line comparison of your working changes against the last commit. Because MistWarp diffs a text representation of the project rather than raw JSON, additions and removals are legible: you can actually read what changed in a script.

## Branches and merging

**Branches** lets you create, switch, and delete branches so you can develop a feature without disturbing your main line. To combine branches, pick a source branch and **Preview** the merge.

If the merge has conflicts, MistWarp lists each conflicting file and asks you to choose a side, **Ours** or **Theirs**, for each one, then **Apply merge**. For anything more involved, **Resolve in editor** opens the conflicting files in the code editor with the usual conflict markers so you can resolve them by hand.

## Remotes and hosting

**Remote** manages generic Git remotes (for example a GitHub repository): add a remote with its URL and an access token, then push a branch to it.

**Rotur Git** is the built-in hosted backend, running on git.rotur.dev. When you are signed in with your [Rotur account](/getting-started/introduction), you can create repositories, push your project straight from the editor, and clone any Rotur repository, all without setting up a separate access token. Repositories can be public or private. There is no separate step to configure credentials: your Rotur sign-in is used.

**Readme** edits the project's README, which is stored in the repository and travels inside the `.sb3` with everything else.

## See also

- [Live collaboration](/editor/collaboration) for real-time co-editing
- [Project management](/editor/project-management)
- [Restore points](/editor/restore-points) for a simpler local safety net
