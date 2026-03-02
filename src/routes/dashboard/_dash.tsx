import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSideBar } from './-components/app-sidebar'

export const Route = createFileRoute('/dashboard/_dash')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSideBar />
      <SidebarTrigger />
      <main className='w-full h-full'>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
