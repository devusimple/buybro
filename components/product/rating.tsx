"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export function RatingStars({
  value,
  size = "md",
}: {
  value: number
  size?: "sm" | "md"
}) {
  const className = size === "sm" ? "size-3.5" : "size-4"
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${value.toFixed(1)} / 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const fill = Math.max(0, Math.min(1, value - index))
        return (
          <span key={index} className={cn("relative shrink-0", className)}>
            <Star
              className={cn(
                "absolute inset-0",
                className,
                "text-muted-foreground/30"
              )}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className={cn("size-full fill-amber-500 text-amber-500")} />
            </span>
          </span>
        )
      })}
    </div>
  )
}

export function RatingInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: number
  onChange: (value: number) => void
  ariaLabel: (rating: number) => string
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const rating = index + 1
        return (
          <button
            key={rating}
            type="button"
            aria-label={ariaLabel(rating)}
            onClick={() => onChange(rating)}
            className="rounded-md p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "size-6",
                rating <= value
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
