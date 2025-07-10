import { UserProfile } from "@clerk/nextjs";

export default async function SettingsPage() {
    return (
        <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-3">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
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
