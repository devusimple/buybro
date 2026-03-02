import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_dash/users')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="w-full h-screen bg-gray-200">
            <h1>User</h1>
        </div>
    )
}
