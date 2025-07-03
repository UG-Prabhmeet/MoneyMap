import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { LayoutDashboard } from "lucide-react";

export default function Layout() {
    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    <LayoutDashboard className="w-7 h-7 text-primary" />
                    Dashboard
                </h1>
            </div>

            <Suspense
                fallback={
                    <div className="mt-6">
                        <BarLoader
                            width={"100%"}
                            color="#9333ea"
                            height={4}
                            loading={true}
                        />
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                            Loading insights...
                        </p>
                    </div>
                }
            >
                <DashboardPage />
            </Suspense>
        </div>
    );
}
