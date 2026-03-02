import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'

export const Route = createFileRoute('/_app')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <main className='w-full h-full'>
                <Header />
                <Outlet />
            </main>
        </>
    )
}
