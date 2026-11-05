# shadcn/ui

- Components come from the shadcn CLI, never hand-written. Add or update them with `pnpm shadcn add <components>`, with `--overwrite` for updates, naming any local edits it discards, since formatting makes `--diff` useless. Who runs it depends on the environment:
    - Cloud session → run it yourself. It prompts for each existing file it would also write; answer `n` to keep the local version.
    - Local sandbox → give the user the command and wait until they have run it. Read-only CLI calls (`docs`, `search`, `view`, `--dry-run`) run here.
- Then format the files and stage them by explicit path.
