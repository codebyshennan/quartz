# quartz

Personal digital garden — built on [Quartz v4](https://quartz.jzhao.xyz), deployed at [codebyshennan.github.io/quartz](https://codebyshennan.github.io/quartz).

Content is synced from the Obsidian vault at `../reference/vault`.

## Commands

```bash
npm run generate          # sync vault → content/, generate goals index + todos
npx quartz build          # build site
npm run build:full        # generate + build in one step
npx quartz build --serve  # local dev server
```

## Content

Content lives in `content/` and is mostly generated — don't edit generated files directly, edit the vault source.

| Path | Source |
|---|---|
| `content/goals/` | Synced from `vault/goals/2026/` by `generate-content.mjs` |
| `content/todos.md` | Auto-generated from open tasks across active goals |
| `content/references/` | Manual |
| `content/index.md` | Manual |

## Auth

Goals and todos are password-gated. The gate uses a SHA-256 hash stored as an env var.

```bash
# Get the hash for a password
node -e "import('node:crypto').then(({createHash})=>console.log(createHash('sha256').update('yourpassword').digest('hex')))"
```

Set it locally in `.env.local` (gitignored):

```
QUARTZ_PASSWORD_HASH=<hash>
```

Then build with auth active:

```bash
source .env.local && npx quartz build
```

The same variable is set as a GitHub Actions secret (`QUARTZ_PASSWORD_HASH`) for CI builds.

## Vault Sync

`scripts/generate-content.mjs` reads `vault/goals/2026/` and:
- Copies each goal file to `content/goals/2026/`, stripping Dataview blocks
- Generates `content/goals/2026/index.md` — a static dashboard with progress bars by area and priority
- Generates `content/todos.md` — all incomplete tasks aggregated across active goals

Override the vault path with `VAULT_PATH=/path/to/vault npm run generate`.
