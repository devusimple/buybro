"use client"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type StatCardItem = {
  label: string
  value: string
  hint?: string
}

export function AdminStatCards({ items }: { items: StatCardItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {items.map((item) => (
        <Card key={item.label} className="@container/card">
          <CardHeader>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {item.value}
            </CardTitle>
          </CardHeader>
          {item.hint && (
            <CardFooter className="text-sm text-muted-foreground">
              {item.hint}
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
