export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="flex justify-between mt-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-800 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
    </div>
  );
}
