# shadcn/ui

- Never write component code yourself; to add or update components, give the user the `pnpm shadcn add <components>` command (with `--overwrite` for updates, naming any local edits it discards, since formatting makes `--diff` useless) and wait until they have run it. Then format the files and stage them by explicit path. Read-only CLI calls (`docs`, `search`, `view`, `--dry-run`) are fine.
