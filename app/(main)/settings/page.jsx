import { Bolt } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";

export default async function SettingsPage() {
    return (
        <div className="min-h-screen px-6 py-10 space-y-8">
            <div className="flex items-center gap-3">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize flex items-center gap-2">
                    <Bolt className="w-7 h-7 text-primary" />
                    Settings
                </h1>
            </div>

            <div className="flex justify-center bg-muted border border-border rounded-2xl shadow-lg p-6">
                <UserProfile
                    routing="hash"
                    appearance={{
                        elements: {
                            card: "shadow-md border border-gray-200",
                        },
                    }}
                />
            </div>
        </div>
    );
}
