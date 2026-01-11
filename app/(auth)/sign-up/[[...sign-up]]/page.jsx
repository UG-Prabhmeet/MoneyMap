import { SignUp } from "@clerk/nextjs";

export default function Page() {
    // Returns the Clerk SignUp UI 
    // This handles user registration, account creation, and social auth logic
    return <SignUp />;
}
