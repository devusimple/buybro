import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ChartArea, ChevronRight, Minus, Settings2Icon, ShieldCheckIcon, ShirtIcon, ShoppingCart, TicketXIcon, TrendingUpDownIcon, User, UsersIcon, type LucideProps } from "lucide-react";


const OverviewMenu: { id: number, title: string, link?: string, icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> }[] = [
    {
        id: 1,
        title: "Home",
        icon: ChartArea,
        link: '/dashboard/'
    },
    {
        id: 2,
        title: "Sales",
        icon: TrendingUpDownIcon,
        link: '/dashboard/sales'
    },
    {
        id: 3,
        title: "Users",
        icon: UsersIcon,
        link: "/dashboard/users"
    },
]
const StoreItems: { id: number, title: string, icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> }[] = [
    {
        id: 1,
        title: "Products",
        icon: ShirtIcon
    },
    {
        id: 2,
        title: "Order",
        icon: ShoppingCart
    },
    {
        id: 3,
        title: "Refund",
        icon: TicketXIcon
    },
]



export function AppSideBar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <User />
                            <span>BUYBRO</span>
                        </SidebarMenuButton>
                        <SidebarMenuAction>
                            <ShieldCheckIcon />
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent >
                <SidebarGroup>
                    <SidebarGroupLabel>Overviews</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Minus /> <span className="sr-only">Produucts</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                OverviewMenu.map((menu) => (
                                    <SidebarMenuItem key={menu.id}>
                                        <SidebarMenuButton isActive={menu.id === 1} asChild>
                                            <Link to={menu.link}>
                                                <menu.icon />
                                                <span>{menu.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuAction>
                                            <ChevronRight />
                                        </SidebarMenuAction>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Store</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Minus /> <span className="sr-only">Store</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                StoreItems.map((menu) => (
                                    <SidebarMenuItem key={menu.id}>
                                        <SidebarMenuButton>
                                            <menu.icon />
                                            <span>{menu.title}</span>
                                        </SidebarMenuButton>
                                        <SidebarMenuBadge>29</SidebarMenuBadge>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Settings2Icon /> <span>Settings</span>
                        </SidebarMenuButton>
                        <SidebarMenuAction>
                            <ChevronRight /> <span className="sr-only">Settings</span>
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}