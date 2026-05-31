import { ComponentChildren, JSX } from "preact"
import { Element, ElementContent, Root } from "hast"
import { toString } from "hast-util-to-string"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/openTasks.scss"
// @ts-ignore
import script from "../scripts/openTasks.inline"

type TodoBucket = "now" | "soon" | "later"

type TodoTask = {
  text: string
  searchText: string
  bucket: TodoBucket
  deadlineLabel: string | null
  contentNodes: ElementContent[]
}

type TodoSection = {
  titleNode: Element
  bodyNodes: ElementContent[]
}

type TodoSectionData = {
  title: string
  key: string
  accent: string
  tasks: TodoTask[]
}

const AREA_ACCENTS: Record<string, string> = {
  finances: "oklch(58% 0.09 40)",
  fitness: "oklch(62% 0.12 25)",
  health: "oklch(63% 0.09 155)",
  language: "oklch(63% 0.09 255)",
  lifestyle: "oklch(68% 0.08 85)",
  work: "oklch(60% 0.08 210)",
}

const BUCKET_LABELS: Record<TodoBucket, string> = {
  now: "Now",
  soon: "Soon",
  later: "Later",
}

const BUCKET_ORDER: TodoBucket[] = ["now", "soon", "later"]
const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

function isElement(node: ElementContent, tagName?: string): node is Element {
  return node.type === "element" && (tagName === undefined || node.tagName === tagName)
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

function collectTodoSections(tree: Root) {
  const introNodes: ElementContent[] = []
  const sections: TodoSection[] = []
  let current: TodoSection | null = null

  for (const child of tree.children) {
    if (isElement(child, "h2")) {
      if (current) sections.push(current)
      current = { titleNode: child, bodyNodes: [] }
      continue
    }

    if (current) {
      current.bodyNodes.push(child)
    } else {
      introNodes.push(child)
    }
  }

  if (current) sections.push(current)

  return { introNodes, sections }
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function daysUntil(target: Date, today: Date) {
  const ms = startOfDay(target).getTime() - startOfDay(today).getTime()
  return Math.round(ms / 86400000)
}

function inferDeadline(text: string, today: Date) {
  const normalized = normalizeText(text)

  if (/\btoday\b/i.test(normalized)) {
    return { label: "Today", bucket: "now" as TodoBucket }
  }

  if (/\bthis week\b/i.test(normalized) || /\bweekly\b/i.test(normalized)) {
    return {
      label: /\bthis week\b/i.test(normalized) ? "This week" : "Weekly",
      bucket: "now" as TodoBucket,
    }
  }

  if (/\bdaily\b/i.test(normalized)) {
    return { label: "Daily", bucket: "now" as TodoBucket }
  }

  if (/\bmonthly\b/i.test(normalized)) {
    return { label: "Monthly", bucket: "soon" as TodoBucket }
  }

  const quarterMatch = normalized.match(/\bQ([1-4])\b(?:\s*\(([^)]+)\))?/i)
  if (quarterMatch) {
    const quarter = Number(quarterMatch[1])
    const yearMatch = normalized.match(/\b(20\d{2})\b/)
    const year = yearMatch ? Number(yearMatch[1]) : today.getFullYear()
    const deadline = new Date(year, quarter * 3, 0)
    return {
      label: quarterMatch[2] ? "Q" + quarter + " (" + quarterMatch[2] + ")" : "Q" + quarter,
      date: deadline,
    }
  }

  const monthMatch = normalized.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+(\d{1,2}))?(?:,?\s+(20\d{2}))?/i)
  if (monthMatch) {
    const monthKey = monthMatch[1].toLowerCase()
    const month = MONTH_INDEX[monthKey]
    const explicitYear = monthMatch[3] ? Number(monthMatch[3]) : undefined
    const year = explicitYear ?? today.getFullYear()
    const day = monthMatch[2] ? Number(monthMatch[2]) : 1
    const label = [monthMatch[1], monthMatch[2], monthMatch[3]].filter(Boolean).join(" ")
    return { label, date: new Date(year, month, day) }
  }

  const yearMatch = normalized.match(/\b(20\d{2})\b/)
  if (yearMatch) {
    const year = Number(yearMatch[1])
    return { label: yearMatch[1], date: new Date(year, 11, 31) }
  }

  return null
}

function bucketFromText(text: string): TodoBucket {
  if (/^(book|register|open|submit|confirm|audit|calculate|define|research|shortlist|get|start|set|choose|compile|assess|decide|make|find|fund|execute|surrender|redirect|track|change|review|order|enroll|visit|play|do|attend|request|model|compare|factor|document|block|keep|contribute|invest)\b/i.test(text)) {
    return "now"
  }

  if (/^(establish|complete|hold|understand|watch|discuss|achieve|finish|pass|comfortable|basic|sustained|minimum|consistent|long run|weekly|daily|trekking poles decision|race day|2-week taper)\b/i.test(text)) {
    return "soon"
  }

  return "later"
}

function classifyTask(text: string, today: Date) {
  const inferred = inferDeadline(text, today)
  if (inferred) {
    if (inferred.bucket) {
      return { bucket: inferred.bucket, deadlineLabel: inferred.label }
    }

    if (inferred.date) {
      const delta = daysUntil(inferred.date, today)
      if (delta <= 60) return { bucket: "now" as TodoBucket, deadlineLabel: inferred.label }
      if (delta <= 240) return { bucket: "soon" as TodoBucket, deadlineLabel: inferred.label }
      return { bucket: "later" as TodoBucket, deadlineLabel: inferred.label }
    }
  }

  return { bucket: bucketFromText(text), deadlineLabel: null }
}

function taskContentNodes(node: Element) {
  return node.children.filter((child) => !(child.type === "element" && child.tagName === "input"))
}

function extractTasks(nodes: ElementContent[], areaTitle: string, today: Date) {
  const tasks: TodoTask[] = []

  for (const node of nodes) {
    if (!isElement(node, "ul")) continue

    for (const child of node.children) {
      if (!isElement(child, "li")) continue
      const text = normalizeText(toString(child))
      const classified = classifyTask(text, today)
      tasks.push({
        text,
        searchText: (areaTitle + " " + text).toLowerCase(),
        bucket: classified.bucket,
        deadlineLabel: classified.deadlineLabel,
        contentNodes: taskContentNodes(child),
      })
    }
  }

  return tasks
}

function renderInlineNodes(filePath: string, nodes: ElementContent[]) {
  return htmlToJsx(filePath, { type: "root", children: nodes } as Root) as ComponentChildren
}

const Content: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const isTodoBoard = fileData.slug === "todos" && tree.type === "root"
  const classString = ["popover-hint", ...classes, isTodoBoard ? "page-todos" : ""]
    .filter(Boolean)
    .join(" ")

  if (!isTodoBoard) {
    const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
    return <article class={classString}>{content}</article>
  }

  const today = new Date()
  const collected = collectTodoSections(tree as Root)
  const sectionData: TodoSectionData[] = collected.sections.map((section) => {
    const title = toString(section.titleNode)
    const key = title.toLowerCase()
    return {
      title,
      key,
      accent: AREA_ACCENTS[key] ?? "var(--secondary)",
      tasks: extractTasks(section.bodyNodes, title, today),
    }
  })

  const totalTasks = sectionData.reduce((sum, section) => sum + section.tasks.length, 0)
  const bucketTotals = BUCKET_ORDER.reduce(
    (acc, bucket) => {
      acc[bucket] = sectionData.reduce(
        (sum, section) => sum + section.tasks.filter((task) => task.bucket === bucket).length,
        0,
      )
      return acc
    },
    { now: 0, soon: 0, later: 0 } as Record<TodoBucket, number>,
  )

  return (
    <article class={classString} data-task-board="true">
      <div class="task-board-shell">
        {collected.introNodes.length > 0 && (
          <div class="task-board-intro">
            {collected.introNodes.map((node, idx) => (
              <div key={idx}>{htmlToJsx(fileData.filePath!, node) as ComponentChildren}</div>
            ))}
          </div>
        )}

        <div class="task-board-toolbar" aria-label="Task board filters">
          <label class="task-search-field">
            <span class="label">Search tasks</span>
            <input
              type="search"
              placeholder="Search tasks, goals, dates"
              aria-label="Search tasks"
              data-task-search
            />
          </label>

          <div class="task-area-filter-group" role="tablist" aria-label="Filter tasks by area">
            <button
              type="button"
              class="task-filter-chip is-active"
              data-area-filter="all"
              aria-pressed="true"
            >
              <span>All areas</span>
              <strong>{totalTasks}</strong>
            </button>
            {sectionData.map((section) => (
              <button
                type="button"
                class="task-filter-chip"
                data-area-filter={section.key}
                aria-pressed="false"
              >
                <span>{section.title}</span>
                <strong>{section.tasks.length}</strong>
              </button>
            ))}
          </div>
        </div>

        <p class="task-board-status" data-task-status>
          Showing {totalTasks} tasks across all areas.
        </p>

        <div class="task-board-overview" aria-label="Task board summary">
          <button
            type="button"
            class="task-overview-pill is-active"
            data-bucket-filter="all"
            aria-pressed="true"
          >
            <span class="label">Open tasks</span>
            <strong>{totalTasks}</strong>
          </button>
          <p class="task-overview-pill">
            <span class="label">Lanes</span>
            <strong>{sectionData.length}</strong>
          </p>
          {BUCKET_ORDER.map((bucket) => (
            <button
              type="button"
              class="task-overview-pill"
              data-bucket-filter={bucket}
              aria-pressed="false"
            >
              <span class="label">{BUCKET_LABELS[bucket]}</span>
              <strong>{bucketTotals[bucket]}</strong>
            </button>
          ))}
        </div>

        <div class="task-board-empty" data-task-empty hidden>
          No tasks match the current filters.
        </div>

        <div class="todo-board" role="list" aria-label="Open tasks grouped by area">
          {sectionData.map((section) => (
            <section
              key={section.title}
              class="task-column"
              role="listitem"
              data-area={section.key}
              data-area-label={section.title}
              style={{ "--column-accent": section.accent } as JSX.CSSProperties}
            >
              <header class="task-column-header">
                <div>
                  <p class="eyebrow">Area</p>
                  <h2>{section.title}</h2>
                </div>
                <span class="task-count" data-total={section.tasks.length}>
                  {section.tasks.length}
                </span>
              </header>

              <div class="task-column-body">
                {BUCKET_ORDER.map((bucket) => {
                  const bucketTasks = section.tasks.filter((task) => task.bucket === bucket)
                  if (bucketTasks.length === 0) return null

                  return (
                    <section class="task-bucket" data-bucket={bucket}>
                      <header class="task-bucket-header">
                        <h3>{BUCKET_LABELS[bucket]}</h3>
                        <span class="task-bucket-count" data-total={bucketTasks.length}>
                          {bucketTasks.length}
                        </span>
                      </header>

                      <div class="task-bucket-list">
                        {bucketTasks.map((task, idx) => (
                          <article
                            key={section.key + "-" + bucket + "-" + idx}
                            class="task-card"
                            data-search={task.searchText}
                            data-bucket={task.bucket}
                            data-area={section.key}
                          >
                            <div class="task-card-meta">
                              {task.deadlineLabel && (
                                <span class="task-deadline-chip">{task.deadlineLabel}</span>
                              )}
                            </div>
                            <div class="task-card-main">
                              <span class="task-checkbox" aria-hidden="true"></span>
                              <div class="task-card-copy">
                                {renderInlineNodes(fileData.filePath!, task.contentNodes)}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}

Content.css = style
Content.afterDOMLoaded = script

export default (() => Content) satisfies QuartzComponentConstructor
