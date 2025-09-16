# awss

AWS CLI, but as a fast TUI. Powered by [opentui](https://github.com/sst/opentui).
Works on macOS and Linux. Recommended terminals: Ghostty, iTerm2.

## Features

- EC2: list instances, view YAML, open console logs, quick AWS Console link
- VPCs/Subnets: list, inspect, view YAML, open in Console
- Security Groups: unified inbound/outbound rule view, view YAML, open in Console
- CloudFormation: stacks, resources, events, parameters, template YAML, Console links
- ECR: repositories and images
- ECS: clusters, services, tasks
- IAM: users
- S3: browse buckets and objects, search within a prefix, open objects in neovim (tmux popup)
- Fast command palette and search; convenient copy to clipboard for selected text
PRs are welcome for more features 🚀

## Requirements

- AWS CLI v2 installed and on PATH; configured credentials/profile
- macOS or Linux terminal with truecolor support
- Optional for extras:
  - tmux (v3+) and neovim for “open in neovim” popups
  - Clipboard tool: `pbcopy` (macOS) or `xclip` (Linux)

## Install (macOS/Linux)

- Latest release:

```bash
curl -fsSL https://raw.githubusercontent.com/aminroosta/awss/HEAD/install.sh | bash
```

The script installs the binary to `~/.local/bin/awss`. Ensure `~/.local/bin` is on your PATH.

## Local Dev

```bash
bun install
bun run src/index.tsx
```

## Usage

Global navigation

- j/k or arrow keys: move selection
- r: refresh
- /: search current list (Enter to apply, Esc to clear)
- : (colon): command palette (Tab completes)
- ctrl+p / ctrl+n: go back / forward
- Mouse selection: copies selected text to clipboard

Command palette

- Type an alias and press Enter. Aliases include:
  - s3|buckets, ec2|instances, stacks, users, clusters, repos|repositories,
  - vpcs, subnets, sgs|securitygroups

Common per‑route keys

- return: open
- a: open current resource in AWS Console
- y: view/copy YAML
- n: open in neovim (where available)
- e: stack events (CloudFormation)
- p: stack parameters (CloudFormation)
- l: EC2 instance console log
- t: ECS tasks
