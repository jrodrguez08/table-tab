import { Skeleton } from '@/components/ui/skeleton';

export function MenuLoading() {
  return (
    <div className="tt-page tt-page-gradient">
      <div className="tt-container pt-4 pb-10">
        <div className="tt-surface tt-section space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-8 w-60 rounded-lg" />
            <Skeleton className="h-4 w-40 rounded-lg" />
          </div>

          {/* Search + tabs skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border p-4 space-y-3"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--card)',
                }}
              >
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
