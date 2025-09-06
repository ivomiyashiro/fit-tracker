import { cn } from "@/web/lib/cn";

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
  meta: {
    title: string;
    description: string;
  };
};

export const PageLayout = ({ meta, children, className }: PageLayoutProps) => {
  const titleText = meta.title ? `Tracker | ${meta.title}` : "Tracker";

  return (
    <>
      <title>{titleText}</title>
      <meta name="description" content={meta.description} />
      <main className={cn("px-4 py-8 sm:px-0 sm:max-w-md sm:mx-auto", className)}>{children}</main>
    </>
  );
};
