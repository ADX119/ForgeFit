import { Skeleton } from "@fitforge/ui";

export default function Loading() {
  return (
    <div className="grid gap-7">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-4 h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-5 w-[34rem] max-w-full" />
      </div>
      <div className="grid grid-auto gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-60" />
        ))}
      </div>
    </div>
  );
}
