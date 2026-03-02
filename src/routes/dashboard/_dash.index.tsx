import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full max-h-screen">

    </div>
  )
}
