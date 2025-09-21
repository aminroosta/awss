# awss

AWS CLI, but as a fast TUI. Powered by [opentui](https://github.com/sst/opentui).

## Install (macOS/Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/aminroosta/awss/HEAD/install.sh | bash
```
The script installs the binary to `~/.local/bin/awss`. Ensure `~/.local/bin` is on your PATH.

## Requirements

- AWS CLI v2 installed and on PATH; configured credentials/profile
- macOS or Linux terminal with truecolor support
  - Recommended terminals: Ghostty, iTerm2.
- Optional for extras:
  - tmux (v3+) and neovim for “open in nvim” popups
  - Clipboard tool: `pbcopy` (macOS) or `xclip` (Linux)

## Usage

Global navigation

- `j/k` or arrow keys: move selection
- `r`: refresh
- `/`: search current list (Enter to apply, Esc to clear)
- `:`:(colon): command palette (Tab completes)
- `ctrl+p` / `ctrl+n`: go back / forward
- Mouse selection: copies selected text to clipboard

Command palette

- Type an alias and press Enter. Aliases include:
  - `s3|buckets`, `ec2|instances`, `stacks`, `users`, `clusters`, `repos|repositories`,
  - `vpcs`, `subnets`, `sgs|securitygroups`

Common per‑route keys

- `enter`: open
- `a`: open current resource in AWS Console
- `y`: view/copy YAML
- `n`: open in neovim (where available)
- `e`: stack events (CloudFormation)
- `p`: stack parameters (CloudFormation)
- `l`: EC2 instance console log
- `t`: ECS tasks

## Local Dev

```bash
bun install
bun run src/index.tsx
```

