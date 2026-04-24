const STORAGE_KEY = "qz-auth"

function getGate() {
  return document.getElementById("auth-gate") as HTMLElement | null
}

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function isAuthenticated(expectedHash: string): boolean {
  if (!expectedHash) return true // no password configured → open
  return sessionStorage.getItem(STORAGE_KEY) === expectedHash
}

function showGate(gate: HTMLElement) {
  gate.style.display = "flex"
  const input = gate.querySelector<HTMLInputElement>("#auth-password")
  if (input) setTimeout(() => input.focus(), 50)
}

function hideGate(gate: HTMLElement) {
  gate.style.display = "none"
}

async function setupAuth() {
  const gate = getGate()
  if (!gate) return

  const expectedHash = gate.dataset.hash ?? ""

  if (isAuthenticated(expectedHash)) {
    hideGate(gate)
    return
  }

  showGate(gate)

  const form = gate.querySelector<HTMLFormElement>("#auth-form")
  const input = gate.querySelector<HTMLInputElement>("#auth-password")
  const error = gate.querySelector<HTMLElement>("#auth-error")

  if (!form || !input || !error) return

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const hash = await sha256(input.value)
    if (hash === expectedHash) {
      sessionStorage.setItem(STORAGE_KEY, hash)
      hideGate(gate)
    } else {
      error.style.display = "block"
      input.value = ""
      input.focus()
    }
  })
}

document.addEventListener("nav", setupAuth)
setupAuth()
