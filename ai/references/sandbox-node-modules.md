# Sandbox node_modules

## Why

The repo is the user's Windows folder, shared into this Linux sandbox VM over virtiofs. Every file-system call on it crosses to the host and costs about 100× a call on the VM's own disk, so `tsc`, ESLint and Vitest spend most of their time on lookups in the shared `node_modules`. The sandbox therefore keeps its own Linux `node_modules` on the VM disk at `~/node-modules/<repo folder name>` and bind-mounts it over the repo's `node_modules`. The mount lives only in the VM's mount table: the host's `node_modules` stays untouched underneath, and the host never sees the Linux one.

## Check

`mountpoint -q "$(git rev-parse --show-toplevel)/node_modules"` succeeding means the setup is complete. Otherwise run every setup step below; each is safe to repeat.

## Setup

The tool versions come from `devEngines` in `package.json`: `runtime.version` for Node, `packageManager.version` for pnpm. Use exactly those. When `devEngines` lacks a pin, ask the user for the version they run on the host and offer to add the pin.

1. **Node.** Install nvm, then the pinned Node, and make it the default:

   ```sh
   curl -so- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | PROFILE=/dev/null bash
   unset NPM_CONFIG_PREFIX
   export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
   nvm install <runtime.version> && nvm alias default <runtime.version>
   ```

   Append these lines to `/etc/sandbox-persistent.sh` once, so every later command loads that Node. The image sets `NPM_CONFIG_PREFIX`, which nvm refuses to work with:

   ```sh
   unset NPM_CONFIG_PREFIX
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```

   Done when `node --version` prints the pinned version.

2. **pnpm.** `npm install -g pnpm@<packageManager.version>`. Done when `pnpm --version` prints the pinned version.

3. **Mount script.** Create `~/bin/mount-sandbox-node-modules.sh`. It mounts only once a finished install is waiting (pnpm writes `.modules.yaml` last), so the worst case is the slow shared `node_modules`, never an empty one:

   ```sh
   #!/bin/sh
   repo="$1"
   target="$repo/node_modules"
   source_dir="$HOME/node-modules/$(basename "$repo")"

   if [ ! -d "$target" ] || mountpoint -q "$target" || [ ! -f "$source_dir/.modules.yaml" ]; then
     exit 0
   fi

   sudo -n mount --bind "$source_dir" "$target"
   ```

   Append to `/etc/sandbox-persistent.sh`, with the repo root filled in, so the mount comes back after every sandbox restart:

   ```sh
   sh "$HOME/bin/mount-sandbox-node-modules.sh" <repo root> >/dev/null 2>&1
   ```

   The script stays in the sandbox; it is not part of the repo.

4. **First install.** From the repo root:

   ```sh
   mkdir -p ~/node-modules/<repo folder name>
   sudo mount --bind ~/node-modules/<repo folder name> node_modules
   pnpm install --frozen-lockfile
   ```

   Done when the check above succeeds, `node_modules/.modules.yaml` exists, and `pnpm exec tsc --version` runs.

## Keeping it current

The host install owns `package.json` and `pnpm-lock.yaml`; the sandbox only follows them with `pnpm install --frozen-lockfile`, when CLAUDE.md says so. `sudo umount node_modules` reveals the host's `node_modules` again.
