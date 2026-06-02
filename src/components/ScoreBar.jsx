export default function ScoreBar({ score }) {
  const percentage = Math.min(Math.max(score || 0, 0), 100)
  
  const getColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium min-w-[40px]">
        {percentage.toFixed(0)}%
      </span>
    </div>
  )
}