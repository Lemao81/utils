# Cloud session

A cloud session (`CLAUDE_CODE_REMOTE=true`) runs in a fresh Linux container cloned from GitHub, on a branch the session names: the **session branch**. One session carries one pull request; the user starts a new session for the next one. `node_modules` lives in the container itself, so the bind mount from `sandbox-node-modules.md` belongs only to the local sandbox.

## Setup

The cloud environment's setup script installs the Node and pnpm versions pinned in `devEngines` of `package.json`, outside the repository.

1. **Check** in a fresh shell that `node --version` and `pnpm --version` print the pinned versions. When they differ, install the pinned versions for this session with nvm and npm, and tell the user the setup script needs updating.
2. **Install** with `pnpm install --frozen-lockfile`, prefixed with `ELECTRON_SKIP_BINARY_DOWNLOAD=1` when the project depends on `electron`.

Done when the pinned versions print, `node_modules/.modules.yaml` exists, and `git status` shows nothing from the setup.

## Branch and pull request

- Commit and push to the session branch, on the user's instruction as everywhere else; open a pull request when the user asks for one.
- Checks that need the host, such as end-to-end tests that launch Electron, stay unrun here: name each one in the hand-back and in the pull request, for the user to run before merging.
- Merge the pull request when the user asks, with the `rebase` merge method, so each commit lands on `main` as it is, without a merge commit.
- A merged pull request ends the session's work. Report the merge with the next planned step, and leave that step to a new session, which starts its own branch from the latest `main`.
