NODE_VERSION=24.21.0
PNPM_VERSION=12.10.1
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] || git clone --depth 1 https://github.com/nvm-sh/nvm.git "$NVM_DIR"
. "$NVM_DIR/nvm.sh"
nvm install "$NODE_VERSION"
NODE_BIN="$(dirname "$(nvm which "$NODE_VERSION")")"
"$NODE_BIN/npm" install --global "pnpm@$PNPM_VERSION"
mkdir -p "$HOME/.local/bin"
for b in node npm npx corepack pnpm pnpx; do
  [ -e "$NODE_BIN/$b" ] && ln -sf "$NODE_BIN/$b" "$HOME/.local/bin/$b"
done
