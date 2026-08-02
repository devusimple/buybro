const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "code",
  "pre",
])

const ALLOWED_ATTRS = new Set(["href", "target", "rel"])

export function sanitizeHtml(html: string): string {
  if (typeof document === "undefined") {
    return ""
  }
  const container = document.createElement("div")
  container.innerHTML = html

  function clean(node: ChildNode) {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element
        if (!ALLOWED_TAGS.has(element.tagName.toLowerCase())) {
          const parent = element.parentNode
          while (element.firstChild) {
            parent?.insertBefore(element.firstChild, element)
          }
          parent?.removeChild(element)
          continue
        }
        for (const attr of Array.from(element.attributes)) {
          const name = attr.name.toLowerCase()
          if (
            name.startsWith("on") ||
            (name === "href" &&
              !/^(https?:|mailto:)/.test(attr.value.trim())) ||
            (name !== "href" && !ALLOWED_ATTRS.has(name))
          ) {
            element.removeAttribute(attr.name)
          }
        }
        element.removeAttribute("target")
        element.removeAttribute("rel")
        if (element.tagName.toLowerCase() === "a") {
          element.setAttribute("target", "_blank")
          element.setAttribute("rel", "noopener noreferrer")
        }
        clean(element)
      }
    }
  }

  clean(container)
  return container.innerHTML
}
