import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { PageLayout } from "@/web/components/layouts";
import { Button } from "@/web/components/ui/button";
import { LandingSVG } from "@/web/modules/landing/landing.svg";

const LandingPage = () => {
  return (
    <PageLayout
      meta={{
        title: "Landing Page",
        description: "Tracker is a platform for tracking your fitness goals and achievements.",
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <LandingSVG />
      </div>
      <div className="text-center font-extrabold text-4xl">
        <h1>Train. Track. Progress.</h1>
        <p className="text-muted-foreground">Your fitness journey starts now.</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 mt-12">
        <Link to="/auth/register" className="w-full">
          <Button className="w-full h-10">
            Get Started
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/auth/sign-in" className="w-full">
          <Button className="w-full h-10" variant="secondary">
            Sign In
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default LandingPage;
