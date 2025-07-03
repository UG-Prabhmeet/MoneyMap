import {
    BarChart,
    Calendar,
    CreditCard,
    Home,
    Inbox,
    Settings,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import NextImage from "next/image";
import Link from "next/link";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Transactions",
        url: "/transactions",
        icon: Inbox,
    },
    {
        title: "Accounts",
        url: "/accounts",
        icon: CreditCard,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <div className="px-1 py-3 flex justify-center border-b">
                <Link href="/">
                    <NextImage
                        src="/light_logo.png"
                        alt="MoneyMap Logo"
                        width={140}
                        height={50}
                        className="object-contain cursor-pointer"
                        priority
                    />
                </Link>
            </div>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4 mr-2" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
