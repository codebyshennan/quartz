import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Shen Nan's Notes",
    pageTitleSuffix: " | Shen Nan",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "codebyshennan.github.io/quartz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Spectral",
        body: "Literata",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#faf7f2",
          lightgray: "#e8e2d8",
          gray: "#a09080",
          darkgray: "#3a3028",
          dark: "#1c1510",
          secondary: "#8b3c2a",
          tertiary: "#c4785a",
          highlight: "rgba(139, 60, 42, 0.07)",
          textHighlight: "#f5e6a099",
        },
        darkMode: {
          light: "#1b1713",
          lightgray: "#2d2720",
          gray: "#6b5e52",
          darkgray: "#cfc6bb",
          dark: "#f0ebe3",
          secondary: "#d4926e",
          tertiary: "#b87055",
          highlight: "rgba(212, 146, 110, 0.1)",
          textHighlight: "#80600088",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
