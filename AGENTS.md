# AGENTS.md

- Format: `bun run format`
- UI: SolidJS via `@opentui/solid` (terminal TUI) and `@opentui/core`.
- Docs: update `README.md` when user-facing behavior changes.

AWS/API Access
- Prefer helpers in `src/api/*`.
- Use AWS CLI via `src/api/aws.ts:1`


File Layout
- Routes: `src/route/*`
- Shared UI: `src/ui/*` such as `src/ui/list.tsx`, `src/ui/notif.tsx`
- AWS/API: `src/api/*`
- State/router: `src/store.ts`, `src/router.tsx`
- Utils: `src/util/*`
