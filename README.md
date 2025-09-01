# awss

[aws-cli](https://github.com/aws/aws-cli) as a TUI - Inspired by [k9s](https://github.com/derailed/k9s).

## Installation (macOS/Linux):

```bash
curl -fsSL https://raw.githubusercontent.com/aminroosta/awss/HEAD/install.sh | bash
```

Options:
- Set VERSION=v1.2.3 to pin a version
- Set PREFIX or BIN_DIR to control install path (default /usr/local/bin)
- Set MUSL=1 on Alpine to get musl builds

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.tsx
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.


## Release

To create a new release:

git tag v0.1.0
git push origin v0.1.0
