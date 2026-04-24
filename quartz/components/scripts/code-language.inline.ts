function addCodeHeaders() {
  const figures = document.querySelectorAll<HTMLElement>("figure[data-rehype-pretty-code-figure]")

  for (const figure of figures) {
    if (figure.querySelector(".code-header")) continue

    const pre = figure.querySelector("pre")
    const code = pre?.querySelector<HTMLElement>("code[data-language]")
    const existingTitle = figure.querySelector<HTMLElement>("[data-rehype-pretty-code-title]")

    const language = code?.getAttribute("data-language") ?? ""
    const title = existingTitle?.textContent ?? ""

    const skipLangs = ["text", "plaintext", ""]
    if (skipLangs.includes(language) && !title) continue

    const header = document.createElement("div")
    header.className = "code-header"

    const label = document.createElement("span")
    label.className = "code-language"
    label.textContent = title || language
    header.appendChild(label)

    existingTitle?.remove()

    if (pre) {
      figure.insertBefore(header, pre)
    }
  }
}

document.addEventListener("nav", addCodeHeaders)
