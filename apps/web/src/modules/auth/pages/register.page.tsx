import { Link } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { Card, CardContent, CardHeader, CardTitle, Logo } from "@/web/components/ui";
import { PublicRouteGuard } from "@/web/lib/auth/guards";
import { RegisterForm } from "@/web/modules/auth/components/register-form";

function RegisterPage() {
  return (
    <PublicRouteGuard>
      <PageLayout
        meta={{ title: "Register", description: "Register" }}
        className="flex justify-center items-center h-screen"
      >
        <Card className="w-full ">
          <CardHeader className="flex flex-col gap-2">
            <Logo asLink to="/" className="w-12 h-12" />
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            <RegisterForm />
            <div className="text-center text-sm text-muted-foreground ">
              Already have an account?
              <Link to="/auth/sign-in" className="font-medium hover:underline text-foreground ml-1">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    </PublicRouteGuard>
  );
}

export default RegisterPage;
