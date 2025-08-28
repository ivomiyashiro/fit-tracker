import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/web/components/ui";
import { NotFoundSVG } from "@/web/modules/not-found/not-found.svg";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <NotFoundSVG />
        <p className="mt-4 text-xl">Page not found</p>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button
          onClick={() => window.history.back()}
          className="mt-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mt-0.5" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
