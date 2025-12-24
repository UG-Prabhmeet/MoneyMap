import { SignIn } from "@clerk/nextjs";

export default function Page() {
    // Rendering the pre-built Clerk SignIn component
    // This handles the UI, form state, and authentication logic automatically
    return <SignIn />;
}
