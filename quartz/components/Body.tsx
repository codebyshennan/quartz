// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
// @ts-ignore
import codeLanguageScript from "./scripts/code-language.inline"
import codeLanguageStyle from "./styles/code-language.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = [clipboardScript, codeLanguageScript]
Body.css = [clipboardStyle, codeLanguageStyle]

export default (() => Body) satisfies QuartzComponentConstructor
