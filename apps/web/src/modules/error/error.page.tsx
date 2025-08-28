import { useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/web/components/ui/button";

import { ErrorSVG } from "./error.svg";

type Props = {
  error?: Error;
};

export default function ErrorPage({ error }: Props) {
  const router = useRouter();

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <ErrorSVG className="w-full" />
        <div className="flex flex-col gap-2 mt-8">
          <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
          <p className="text-muted-foreground">We encountered an unexpected error</p>
        </div>
        {error && (
          <details className="mb-6 rounded-md bg-red-50 p-4 text-left mt-8" open>
            <summary className="cursor-pointer text-sm font-medium text-red-800">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-red-700 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}
        <Button onClick={handleGoHome} variant="outline">
          <ArrowLeftIcon className="w-4 h-4 mr-1 mt-0.5" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
