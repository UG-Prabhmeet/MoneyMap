import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const MainLayout = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="container mx-auto">
                <SidebarTrigger />
                {children}
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;
