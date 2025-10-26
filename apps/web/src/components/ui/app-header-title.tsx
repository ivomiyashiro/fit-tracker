import { Skeleton } from "@/web/components/ui";

type Props = {
  title?: string;
  isLoading?: boolean;
};

export const AppHeaderTitle = ({ title, isLoading = false }: Props) => {
  if (isLoading || !title) {
    return <Skeleton className="h-7 w-32" />;
  }

  return <span className="text-xl font-bold">{title}</span>;
};
