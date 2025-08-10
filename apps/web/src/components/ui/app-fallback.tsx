import { Spinner } from "./spinner";

export const AppFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Spinner className="mx-auto size-20" />
      <span className="text-2xl font-bold">Loading...</span>
    </div>
  );
};
