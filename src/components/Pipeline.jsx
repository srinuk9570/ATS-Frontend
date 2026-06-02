import { useState } from 'react'

const stages = ['Applied', 'Shortlisted', 'Interviewed', 'Offered', 'Hired', 'Rejected']

export default function Pipeline({ currentStatus, applicationId, onUpdate }) {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleStatusChange = (newStatus) => {
    onUpdate(applicationId, newStatus)
    setShowDropdown(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-yellow-500',
      'Shortlisted': 'bg-blue-500',
      'Interviewed': 'bg-purple-500',
      'Offered': 'bg-orange-500',
      'Hired': 'bg-green-500',
      'Rejected': 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
      >
        Move →
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[150px]">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => handleStatusChange(stage)}
              disabled={stage === currentStatus}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                stage === currentStatus ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
              }`}
            >
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(stage)}`}></span>
              {stage}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}