#!/usr/bin/env node
/**
 * Syncs vault goals/projects into Quartz content and generates:
 * - content/goals/2026/index.md  (static dashboard replacing DataviewJS goals.md)
 * - content/todos.md             (aggregated incomplete tasks across all goals)
 *
 * Usage:
 *   node scripts/generate-content.mjs
 *   VAULT_PATH=/path/to/vault node scripts/generate-content.mjs
 *
 * To get the SHA-256 hash for a password (set as QUARTZ_PASSWORD_HASH env var):
 *   node -e "import('node:crypto').then(({createHash})=>console.log(createHash('sha256').update('yourpassword').digest('hex')))"
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, cpSync } from "fs"
import { join, dirname, basename, relative } from "path"
import { fileURLToPath } from "url"
import { load } from "js-yaml"

const __dirname = dirname(fileURLToPath(import.meta.url))
const QUARTZ_ROOT = join(__dirname, "..")
const VAULT_PATH =
  process.env.VAULT_PATH ?? join(QUARTZ_ROOT, "../reference/vault")
const CONTENT_PATH = join(QUARTZ_ROOT, "content")
const GOALS_VAULT = join(VAULT_PATH, "goals", "2026")
const GOALS_CONTENT = join(CONTENT_PATH, "goals", "2026")

const AREA_COLORS = {
  fitness: "#e06c75",
  language: "#61afef",
  lifestyle: "#98c379",
  work: "#e5c07b",
  finances: "#c678dd",
  health: "#56b6c2",
  meta: "#abb2bf",
}

const PRIORITY_ORDER = ["non-negotiable", "high", "medium", "nice-to-have"]

// ─── Parsing ──────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: content }
  try {
    return { data: load(match[1]) || {}, body: match[2] }
  } catch {
    return { data: {}, body: content }
  }
}

function extractTasks(body) {
  const tasks = []
  for (const line of body.split("\n")) {
    const m = line.match(/^\s*-\s*\[([ xX])\]\s*(.+)/)
    if (m) tasks.push({ completed: m[1].toLowerCase() === "x", text: m[2].trim() })
  }
  return tasks
}

function stripDataview(body) {
  return body
    .replace(/```dataviewjs[\s\S]*?```/g, "")
    .replace(/```dataview[\s\S]*?```/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

// ─── Goal loading ─────────────────────────────────────────────────────────────

function loadGoals() {
  const goals = []

  function walk(dir, area = null) {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        walk(fullPath, entry)
      } else if (entry.endsWith(".md") && entry !== "goals.md") {
        const raw = readFileSync(fullPath, "utf8")
        const { data, body } = parseFrontmatter(raw)
        if (data.type !== "goal") continue
        const tasks = extractTasks(body)
        goals.push({
          filePath: fullPath,
          relPath: relative(GOALS_VAULT, fullPath), // e.g. fitness/hyrox.md
          slug: basename(entry, ".md"),
          title: data.title || basename(entry, ".md").replace(/-/g, " "),
          area: data.area || area || "other",
          priority: data.priority || "medium",
          status: data.status || "active",
          targetDate: data["target-date"] ? String(data["target-date"]) : null,
          tasks,
          body: stripDataview(body),
          data,
        })
      }
    }
  }

  walk(GOALS_VAULT)
  return goals
}

// ─── Copy goal files to content ───────────────────────────────────────────────

function copyGoalFiles(goals) {
  for (const goal of goals) {
    const dest = join(GOALS_CONTENT, goal.relPath)
    mkdirSync(dirname(dest), { recursive: true })
    // Rebuild file with stripped dataview body
    const fm = goal.data
    const frontmatter = Object.entries(fm)
      .map(([k, v]) => {
        if (Array.isArray(v)) return `${k}: [${v.map(String).join(", ")}]`
        if (v === null || v === undefined) return null
        return `${k}: ${JSON.stringify(v)}`
      })
      .filter(Boolean)
      .join("\n")
    const out = `---\n${frontmatter}\n---\n\n${goal.body}\n`
    writeFileSync(dest, out)
  }
  console.log(`✓ Copied ${goals.length} goal files`)
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function fmtDate(dateStr) {
  if (!dateStr) return "ongoing"
  const d = new Date(dateStr)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

function progressBar(pct, color) {
  return `<div style="height:5px;border-radius:3px;background:var(--lightgray);margin-top:3px"><div style="height:100%;width:${pct}%;border-radius:3px;background:${color}"></div></div>`
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str
}

// ─── Generate goals/2026/index.md ─────────────────────────────────────────────

function generateGoalsIndex(goals) {
  const active = goals.filter((g) => g.status === "active")

  // ── Area overview table ──
  const areas = [...new Set(active.map((g) => g.area))].sort()
  let areaRows = ""
  for (const area of areas) {
    const areaGoals = active.filter((g) => g.area === area)
    let totalTasks = 0, doneTasks = 0
    for (const g of areaGoals) {
      totalTasks += g.tasks.length
      doneTasks += g.tasks.filter((t) => t.completed).length
    }
    const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
    const color = AREA_COLORS[area] || "#abb2bf"
    areaRows += `| ${capitalize(area)} | ${areaGoals.length} | ${doneTasks}/${totalTasks} | ${progressBar(pct, color)} |\n`
  }

  const overviewTable = `| Area | Goals | Tasks | Progress |\n|------|-------|-------|----------|\n${areaRows}`

  // ── Priority sections ──
  let prioritySections = ""
  for (const priority of PRIORITY_ORDER) {
    const pGoals = active.filter((g) => g.priority === priority).sort((a, b) => {
      if (!a.targetDate && !b.targetDate) return 0
      if (!a.targetDate) return 1
      if (!b.targetDate) return -1
      return a.targetDate.localeCompare(b.targetDate)
    })
    if (pGoals.length === 0) continue

    const label = {
      "non-negotiable": "Non-negotiable",
      high: "High priority",
      medium: "Medium",
      "nice-to-have": "Nice to have",
    }[priority] || capitalize(priority)

    prioritySections += `\n## ${label}\n\n`
    for (const g of pGoals) {
      const done = g.tasks.filter((t) => t.completed).length
      const total = g.tasks.length
      const pct = total > 0 ? Math.round((done / total) * 100) : 0
      const color = AREA_COLORS[g.area] || "#abb2bf"
      const link = `[[${g.relPath.replace(".md", "")}|${capitalize(g.title)}]]`
      const meta = `${capitalize(g.area)} · ${fmtDate(g.targetDate)}`
      const taskInfo = total > 0 ? `${done}/${total}` : "no tasks"
      prioritySections += `**${link}** <span style="font-size:12px;color:var(--gray)">${meta} · ${taskInfo}</span>\n${progressBar(pct, color)}\n\n`
    }
  }

  // ── Completed ──
  const completed = goals.filter((g) => g.status === "completed")
  let completedSection = ""
  if (completed.length > 0) {
    completedSection = "\n## Completed\n\n"
    for (const g of completed) {
      completedSection += `- [[${g.relPath.replace(".md", "")}|${capitalize(g.title)}]] — ${capitalize(g.area)}\n`
    }
  }

  const today = new Date().toISOString().split("T")[0]
  const content = `---
title: Goals 2026
tags: [goals, moc]
---

_Updated: ${today}_

${overviewTable}
${prioritySections}${completedSection}`

  const dest = join(GOALS_CONTENT, "index.md")
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, content)
  console.log("✓ Generated goals/2026/index.md")
}

// ─── Generate content/todos.md ────────────────────────────────────────────────

function generateTodos(goals) {
  const active = goals.filter((g) => g.status === "active")
  const areas = [...new Set(active.map((g) => g.area))].sort()

  const today = new Date().toISOString().split("T")[0]
  let md = `---
title: Open Tasks
tags: [todos]
---

_Updated: ${today} · Tasks aggregated from active goals_

`

  let totalOpen = 0

  for (const area of areas) {
    const areaGoals = active.filter((g) => g.area === area)
    const openTasks = []

    for (const g of areaGoals) {
      for (const task of g.tasks) {
        if (!task.completed) {
          openTasks.push({
            text: task.text,
            goalTitle: capitalize(g.title),
            goalSlug: `goals/2026/${g.relPath.replace(".md", "")}`,
          })
        }
      }
    }

    if (openTasks.length === 0) continue

    md += `## ${capitalize(area)}\n\n`
    for (const t of openTasks) {
      md += `- [ ] ${t.text} — [[${t.goalSlug}|${t.goalTitle}]]\n`
    }
    md += "\n"
    totalOpen += openTasks.length
  }

  if (totalOpen === 0) {
    md += "_No open tasks — everything is done!_ 🎉\n"
  }

  writeFileSync(join(CONTENT_PATH, "todos.md"), md)
  console.log(`✓ Generated todos.md (${totalOpen} open tasks)`)
}

// ─── Generate goals/index.md (root) ──────────────────────────────────────────

function generateGoalsRoot() {
  const content = `---
title: Goals
tags: [goals]
---

- [[goals/2026/index|2026 Goals]]
`
  const dest = join(CONTENT_PATH, "goals", "index.md")
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, content)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(`Vault path: ${VAULT_PATH}`)

const goals = loadGoals()
console.log(`Found ${goals.length} goal files`)

copyGoalFiles(goals)
generateGoalsRoot()
generateGoalsIndex(goals)
generateTodos(goals)

console.log("\nDone. Run `npm run build` to build the site.\n")
