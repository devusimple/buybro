"use client"

import { useRef, useState } from "react"
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  RemoveFormatting,
  Strikethrough,
  Underline,
} from "lucide-react"

import { cn } from "@/lib/utils"

type Command =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "formatBlock"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "createLink"
  | "removeFormat"

function runCommand(command: Command, value?: string) {
  document.execCommand(command, false, value)
}

function isActive(command: Command, value?: string) {
  if (command === "formatBlock") {
    const block = document.queryCommandValue("formatBlock")
    return block === value
  }
  return document.queryCommandState(command)
}

const toolbar: {
  command: Command
  value?: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { command: "bold", label: "Bold", icon: Bold },
  { command: "italic", label: "Italic", icon: Italic },
  { command: "underline", label: "Underline", icon: Underline },
  { command: "strikeThrough", label: "Strikethrough", icon: Strikethrough },
  { command: "formatBlock", value: "h2", label: "Heading 2", icon: Heading2 },
  { command: "formatBlock", value: "h3", label: "Heading 3", icon: Heading3 },
  {
    command: "insertUnorderedList",
    label: "Bullet list",
    icon: List,
  },
  { command: "insertOrderedList", label: "Numbered list", icon: ListOrdered },
]

export function RichTextEditor({
  value,
  onChange,
  id,
  placeholder = "Describe the product…",
}: {
  value: string
  onChange: (html: string) => void
  id: string
  placeholder?: string
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Record<string, boolean>>({})
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkValue, setLinkValue] = useState("")

  function handleMount(element: HTMLDivElement | null) {
    if (element && !element.dataset.mounted) {
      element.dataset.mounted = "true"
      element.innerHTML = value
    }
  }

  function refreshActive() {
    setActive({
      bold: isActive("bold"),
      italic: isActive("italic"),
      underline: isActive("underline"),
      strikeThrough: isActive("strikeThrough"),
      h2: isActive("formatBlock", "h2") || isActive("formatBlock", "H2"),
      h3: isActive("formatBlock", "h3") || isActive("formatBlock", "H3"),
      insertUnorderedList: isActive("insertUnorderedList"),
      insertOrderedList: isActive("insertOrderedList"),
    })
  }

  function handleToolbar(command: Command, label: string) {
    runCommand(command, command === "formatBlock" ? label : undefined)
    handleChange()
    refreshActive()
  }

  function handleChange() {
    onChange(editorRef.current?.innerHTML ?? "")
  }

  function handleLink() {
    if (linkOpen) {
      const url = linkValue.trim()
      if (url) {
        runCommand("createLink", url)
        handleChange()
      }
      setLinkOpen(false)
      setLinkValue("")
    } else {
      setLinkOpen(true)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (linkOpen && event.key === "Enter") {
      event.preventDefault()
      handleLink()
    }
    if (linkOpen && event.key === "Escape") {
      setLinkOpen(false)
      setLinkValue("")
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background focus-within:ring-2 focus-within:ring-ring/30">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-1.5">
        {toolbar.map((item) => {
          const Icon = item.icon
          const pressed = active[item.command] ?? false
          return (
            <button
              key={`${item.command}-${item.value ?? ""}`}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-pressed={pressed}
              onMouseDown={(event) => {
                event.preventDefault()
                handleToolbar(item.command, item.value ?? item.label)
              }}
              className={cn(
                "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pressed && "bg-muted text-foreground"
              )}
            >
              <Icon className="size-4" />
            </button>
          )
        })}
        <button
          type="button"
          title="Link"
          aria-label="Link"
          aria-pressed={linkOpen}
          onMouseDown={(event) => {
            event.preventDefault()
            handleLink()
          }}
          className={cn(
            "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            linkOpen && "bg-muted text-foreground"
          )}
        >
          <Link className="size-4" />
        </button>
        <button
          type="button"
          title="Clear formatting"
          aria-label="Clear formatting"
          onMouseDown={(event) => {
            event.preventDefault()
            runCommand("removeFormat")
            handleChange()
          }}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RemoveFormatting className="size-4" />
        </button>
        {linkOpen && (
          <input
            autoFocus
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://…"
            className="h-8 min-w-40 flex-1 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
          />
        )}
      </div>
      <div
        ref={handleMount}
        id={id}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        className="min-h-40 cursor-text px-4 py-3 text-sm leading-relaxed outline-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_li]:list-inside [&_ol]:list-decimal [&_ol]:pl-1 [&_ul]:list-disc [&_ul]:pl-1"
        onInput={handleChange}
        onKeyUp={refreshActive}
        onMouseUp={refreshActive}
        onBlur={() => setLinkOpen(false)}
      />
    </div>
  )
}
