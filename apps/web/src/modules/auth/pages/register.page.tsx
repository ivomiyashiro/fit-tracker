import { createRoute, Link } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { Card, CardContent, CardHeader, CardTitle, Logo } from "@/web/components/ui";
import { PublicRouteGuard } from "@/web/lib/auth/guards";
import { rootRoute } from "@/web/lib/router/__root";
import { RegisterForm } from "@/web/modules/auth/components/register-form";

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <PublicRouteGuard redirectIfAuthenticated>
      <RegisterPage />
    </PublicRouteGuard>
  ),
});

function RegisterPage() {
  return (
    <PublicRouteGuard>
      <PageLayout
        meta={{ title: "Register", description: "Register" }}
        className="flex justify-center items-center h-screen"
      >
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-2">
            <Logo asLink to="/" className="w-12 h-12" />
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            <RegisterForm />
            <div className="text-center text-sm text-muted-foreground ">
              Already have an account?
              <Link to="/login" className="font-medium hover:underline text-primary-foreground ml-1">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    </PublicRouteGuard>
  );
}

export default RegisterPage;
