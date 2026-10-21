# Cloud session

A cloud session (`CLAUDE_CODE_REMOTE=true`) runs in a fresh Linux container cloned from GitHub, on a branch the session names: the **session branch**. One session carries one pull request; the user starts a new session for the next one. `node_modules` lives in the container itself, so the bind mount from `sandbox-node-modules.md` belongs only to the local sandbox.

## Setup

1. **SessionStart hook.** Check that `.claude/settings.json` registers a `SessionStart` hook that prepares the container. When it is missing, load `session-start-hook` and create it, then tell the user it rides with this session's pull request. The hook:
    - exits at once unless `CLAUDE_CODE_REMOTE` is `true`, leaving local and sandbox runs to their own setup;
    - installs the Node and pnpm versions pinned in `devEngines` of `package.json`, Node through nvm, and puts that Node on the `PATH` of every later command;
    - runs `pnpm install --frozen-lockfile`, with `ELECTRON_SKIP_BINARY_DOWNLOAD=1` when the project depends on `electron`.

   Done when, in a fresh shell, `node --version` and `pnpm --version` print the pinned versions and `node_modules/.modules.yaml` exists.

## Branch and pull request

- Commit and push to the session branch, on the user's instruction as everywhere else; open a pull request when the user asks for one.
- Checks that need the host, such as end-to-end tests that launch Electron, stay unrun here: name each one in the hand-back and in the pull request, for the user to run before merging.
- A merged pull request ends the session's work. Report the merge with the next planned step, and leave that step to a new session, which starts its own branch from the latest `main`.
