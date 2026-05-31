function setupOpenTasksBoard(root: HTMLElement) {
  const searchInput = root.querySelector("[data-task-search]") as HTMLInputElement | null
  const filterButtons = Array.from(root.querySelectorAll("[data-area-filter]")) as HTMLButtonElement[]
  const bucketButtons = Array.from(
    root.querySelectorAll("[data-bucket-filter]"),
  ) as HTMLButtonElement[]
  const columns = Array.from(root.querySelectorAll(".task-column")) as HTMLElement[]
  const emptyState = root.querySelector("[data-task-empty]") as HTMLElement | null
  const status = root.querySelector("[data-task-status]") as HTMLElement | null

  let activeArea = "all"
  let activeBucket = "all"

  const syncButtonState = () => {
    for (const button of filterButtons) {
      const isActive = (button.dataset.areaFilter ?? "all") === activeArea
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", isActive ? "true" : "false")
    }

    for (const button of bucketButtons) {
      const isActive = (button.dataset.bucketFilter ?? "all") === activeBucket
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", isActive ? "true" : "false")
    }
  }

  const applyFilters = () => {
    const query = searchInput?.value.trim().toLowerCase() ?? ""
    let visibleTasks = 0
    let visibleAreas = 0

    for (const column of columns) {
      const area = column.dataset.area ?? ""
      const areaMatches = activeArea === "all" || area === activeArea
      let visibleInColumn = 0

      const buckets = Array.from(column.querySelectorAll(":scope .task-bucket")) as HTMLElement[]
      for (const bucket of buckets) {
        let visibleInBucket = 0
        const bucketName = bucket.dataset.bucket ?? ""
        const bucketMatches = activeBucket === "all" || bucketName === activeBucket
        const cards = Array.from(bucket.querySelectorAll(":scope .task-card")) as HTMLElement[]

        for (const card of cards) {
          const haystack = card.dataset.search ?? ""
          const matchesQuery = query === "" || haystack.includes(query)
          const isVisible = areaMatches && bucketMatches && matchesQuery
          card.hidden = !isVisible
          if (isVisible) {
            visibleInBucket += 1
            visibleInColumn += 1
            visibleTasks += 1
          }
        }

        bucket.hidden = !areaMatches || !bucketMatches || visibleInBucket === 0
        const bucketCount = bucket.querySelector(".task-bucket-count") as HTMLElement | null
        if (bucketCount) bucketCount.textContent = String(visibleInBucket)
      }

      column.hidden = !areaMatches || visibleInColumn === 0
      if (!column.hidden) visibleAreas += 1

      const columnCount = column.querySelector(".task-count") as HTMLElement | null
      if (columnCount) columnCount.textContent = String(visibleInColumn)
    }

    syncButtonState()

    if (status) {
      const bucketSuffix =
        activeBucket === "all" ? "" : " in " + activeBucket.charAt(0).toUpperCase() + activeBucket.slice(1)
      status.textContent =
        visibleTasks === 0
          ? "No tasks match the current filters."
          : "Showing " +
            visibleTasks +
            " task" +
            (visibleTasks === 1 ? "" : "s") +
            bucketSuffix +
            " across " +
            visibleAreas +
            " area" +
            (visibleAreas === 1 ? "" : "s") +
            "."
    }

    if (emptyState) emptyState.hidden = visibleTasks !== 0
  }

  const onFilterClick = (event: Event) => {
    const target = event.currentTarget as HTMLButtonElement
    activeArea = target.dataset.areaFilter ?? "all"
    applyFilters()
  }

  for (const button of filterButtons) {
    button.addEventListener("click", onFilterClick)
    window.addCleanup(() => button.removeEventListener("click", onFilterClick))
  }

  const onBucketClick = (event: Event) => {
    const target = event.currentTarget as HTMLButtonElement
    activeBucket = target.dataset.bucketFilter ?? "all"
    applyFilters()
  }

  for (const button of bucketButtons) {
    button.addEventListener("click", onBucketClick)
    window.addCleanup(() => button.removeEventListener("click", onBucketClick))
  }

  if (searchInput) {
    const onInput = () => applyFilters()
    searchInput.addEventListener("input", onInput)
    window.addCleanup(() => searchInput.removeEventListener("input", onInput))
  }

  applyFilters()
}

document.querySelectorAll(".page-todos[data-task-board='true']").forEach((root) => {
  if (root instanceof HTMLElement) setupOpenTasksBoard(root)
})
