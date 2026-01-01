import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
    return (
        <div>

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
