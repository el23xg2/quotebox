export function ListPageSkeleton() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="divide-y divide-gray-100 px-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <div className="space-y-2">
                <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6 h-4 w-16 animate-pulse rounded bg-gray-200" />
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-36 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-20 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
      <div className="h-96 w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}
