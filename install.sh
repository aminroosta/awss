#!/usr/bin/env bash
set -euo pipefail

APP_NAME="awss"
OWNER_REPO="${OWNER_REPO:-aminroosta/awss}"
PREFIX="${PREFIX:-/usr/local}"
BIN_DIR="${BIN_DIR:-$PREFIX/bin}"
VERSION="${VERSION:-latest}"
TMPDIR="${TMPDIR:-$(mktemp -d)}"

cleanup() { rm -rf "$TMPDIR"; }
trap cleanup EXIT

log() { printf "[%s] %s\n" "$APP_NAME" "$*" >&2; }
err() { printf "[%s:ERROR] %s\n" "$APP_NAME" "$*" >&2; }

need_cmd() { command -v "$1" >/dev/null 2>&1 || { err "Required command '$1' not found"; exit 1; }; }

need_cmd curl
need_cmd tar
need_cmd shasum

uname_os() {
  case "$(uname -s)" in
    Linux) echo linux ;;
    Darwin) echo macos ;;
    *) err "Unsupported OS: $(uname -s)"; exit 1 ;;
  esac
}

uname_arch() {
  case "$(uname -m)" in
    x86_64|amd64) echo x64 ;;
    aarch64|arm64) echo arm64 ;;
    *) err "Unsupported arch: $(uname -m)"; exit 1 ;;
  esac
}

best_suffix() {
  os=$(uname_os)
  arch=$(uname_arch)
  if [ "$os" = "linux" ]; then
    # Prefer GNU glibc builds; optionally allow MUSL via MUSL=1
    if [ "${MUSL:-}" = "1" ]; then echo "linux-musl-$arch"; else echo "linux-$arch"; fi
  else
    echo "macos-$arch"
  fi
}

latest_tag() {
  curl -fsSL "https://api.github.com/repos/$OWNER_REPO/releases/latest" | sed -n 's/.*"tag_name" *: *"\([^"]*\)".*/\1/p'
}

resolve_version() {
  if [ "$VERSION" = "latest" ]; then latest_tag; else echo "$VERSION"; fi
}

install() {
  local ver suffix file base url sumfile
  ver=$(resolve_version)
  suffix=$(best_suffix)
  base="$APP_NAME-$ver-$suffix"
  file="$base.tar.gz"
  url="https://github.com/$OWNER_REPO/releases/download/$ver/$file"
  sumurl="https://github.com/$OWNER_REPO/releases/download/$ver/SHA256SUMS.txt"

  log "Version: $ver"
  log "Downloading: $url"
  curl -fL "$url" -o "$TMPDIR/$file"

  log "Fetching checksums: $sumurl"
  curl -fL "$sumurl" -o "$TMPDIR/SHA256SUMS.txt"

  log "Verifying checksum"
  (cd "$TMPDIR" && shasum -a 256 -c <(grep " $file$" SHA256SUMS.txt))

  mkdir -p "$TMPDIR/extract" "$BIN_DIR"
  tar -C "$TMPDIR/extract" -xzf "$TMPDIR/$file"
  install -m 0755 "$TMPDIR/extract/$APP_NAME" "$BIN_DIR/$APP_NAME"
  log "Installed to $BIN_DIR/$APP_NAME"
}

install
