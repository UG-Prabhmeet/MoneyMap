import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { LayoutDashboard } from "lucide-react";

export default function Layout() {
    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
                    Dashboard
                </h1>
            </div>

            <Suspense
                fallback={
                    <div className="mt-6">
                        <BarLoader
                            width={"100%"}
                            color="#10b981"
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
