// @ts-ignore: inline script bundled by esbuild
import authScript from "./scripts/auth.inline"
import authStyle from "./styles/auth.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const Auth: QuartzComponent = () => {
  const hash = process.env.QUARTZ_PASSWORD_HASH ?? ""
  return (
    <div id="auth-gate" data-hash={hash}>
      <div class="auth-box">
        <p class="auth-title">Shen Nan's Notes</p>
        <p class="auth-subtitle">Private — enter password to continue</p>
        <form id="auth-form">
          <input
            id="auth-password"
            class="auth-input"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
          />
          <p id="auth-error" class="auth-error">
            Incorrect password
          </p>
          <button type="submit" class="auth-btn">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}

Auth.afterDOMLoaded = authScript
Auth.css = authStyle

export default (() => Auth) satisfies QuartzComponentConstructor
