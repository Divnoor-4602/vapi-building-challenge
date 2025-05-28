import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import AuthRedirect from "@/components/auth/AuthRedirect";

export default async function Page() {
  const { userId } = await auth();

  // If user is already authenticated, show the redirect component
  if (userId) {
    return <AuthRedirect />;
  }

  return (
    <main className="flex min-h-screen w-screen items-center justify-center">
      <SignUp forceRedirectUrl="/auth-redirect" />
    </main>
  );
}
