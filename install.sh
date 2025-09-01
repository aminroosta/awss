#!/bin/bash

set -euo pipefail

REPO="aminroosta/awss"
APP_NAME="awss"
INSTALL_DIR="${HOME}/.local/bin"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Detect OS and architecture
detect_platform() {
    local os arch
    
    case "$(uname -s)" in
        Darwin*) os="macos" ;;
        Linux*) os="linux" ;;
        *) error "Unsupported operating system: $(uname -s)" ;;
    esac
    
    case "$(uname -m)" in
        x86_64) arch="x64" ;;
        arm64|aarch64) arch="arm64" ;;
        *) error "Unsupported architecture: $(uname -m)" ;;
    esac
    
    echo "${os}-${arch}"
}

# Get latest release version
get_latest_version() {
    curl -s "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/'
}

# Download and install
install_awss() {
    local version="${1:-$(get_latest_version)}"
    local platform="$(detect_platform)"
    local filename="${APP_NAME}-${version}-${platform}.tar.gz"
    local url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    
    log "Installing ${APP_NAME} ${version} for ${platform}..."
    
    # Create install directory
    mkdir -p "${INSTALL_DIR}"
    
    # Download and extract
    local temp_dir=$(mktemp -d)
    log "Downloading from ${url}..."
    
    if ! curl -sL "${url}" -o "${temp_dir}/${filename}"; then
        error "Failed to download ${filename}"
    fi
    
    log "Extracting ${filename}..."
    if ! tar -xzf "${temp_dir}/${filename}" -C "${temp_dir}"; then
        error "Failed to extract ${filename}"
    fi
    
    # Install binary
    if ! cp "${temp_dir}/${APP_NAME}" "${INSTALL_DIR}/${APP_NAME}"; then
        error "Failed to install binary to ${INSTALL_DIR}"
    fi
    
    chmod +x "${INSTALL_DIR}/${APP_NAME}"
    
    # Cleanup
    rm -rf "${temp_dir}"
    
    log "Successfully installed ${APP_NAME} to ${INSTALL_DIR}/${APP_NAME}"
    
    # Check if install directory is in PATH
    if [[ ":$PATH:" != *":${INSTALL_DIR}:"* ]]; then
        warn "Warning: ${INSTALL_DIR} is not in your PATH"
        warn "Add this to your shell profile: export PATH=\"${INSTALL_DIR}:\$PATH\""
    fi
    
    log "Installation complete! Run '${APP_NAME}' to get started."
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [version]"
        echo ""
        echo "Install ${APP_NAME} from GitHub releases"
        echo ""
        echo "Arguments:"
        echo "  version    Specific version to install (default: latest)"
        echo ""
        echo "Examples:"
        echo "  $0            # Install latest version"
        echo "  $0 v1.0.0     # Install specific version"
        exit 0
        ;;
    *)
        install_awss "$@"
        ;;
esac
