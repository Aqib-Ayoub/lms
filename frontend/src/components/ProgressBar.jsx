export default function ProgressBar({ percentage = 0, showLabel = true, size = 'md', color = 'blue' }) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' };
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Progress</span>
          <span className={`font-bold ${percentage === 100 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${colors[color]} ${heights[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {percentage === 100 && showLabel && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">✅ Completed!</p>
      )}
    </div>
  );
}
