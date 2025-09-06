import { Link } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { Card, CardContent, CardHeader, CardTitle, Logo } from "@/web/components/ui";
import { PublicRouteGuard } from "@/web/lib/auth/guards";
import { LoginForm } from "@/web/modules/auth/components/login-form";

function SignInPage() {
  return (
    <PublicRouteGuard>
      <PageLayout
        meta={{ title: "Sign In", description: "Sign In" }}
        className="flex justify-center items-center h-screen"
      >
        <Card className="w-full">
          <CardHeader className="gap-2">
            <Logo asLink to="/" className="w-12 h-12" />
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            <LoginForm />
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?
              <Link
                to="/auth/register"
                className="font-medium hover:underline text-primary-foreground ml-1"
              >
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    </PublicRouteGuard>
  );
}

export default SignInPage;
