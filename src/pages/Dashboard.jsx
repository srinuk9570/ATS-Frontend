import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'
import Pipeline from '../components/Pipeline'
import ScoreBar from '../components/ScoreBar'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs')
      setJobs(response.data.jobs)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCandidates = async (jobId) => {
    try {
      const response = await axios.get(`/api/candidates/job/${jobId}`)
      setCandidates(response.data.candidates)
      setSelectedJob(jobId)
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
    }
  }

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(`/api/candidates/application/${applicationId}/status`, {
        status: newStatus
      })
      // Refresh candidates
      if (selectedJob) {
        fetchCandidates(selectedJob)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recruitment Dashboard</h1>
        <Link
          to="/jobs"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => fetchCandidates(job.id)}
            className={`p-4 rounded-lg cursor-pointer transition ${
              selectedJob === job.id
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-white border hover:border-blue-300'
            }`}
          >
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.location}</p>
            <p className="text-sm text-gray-500 mt-2">
              {job.status === 'active' ? '🟢 Active' : '🔴 Closed'}
            </p>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Candidates ({candidates.length})
          </h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Candidate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Match Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Skills
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/candidates/${candidate.candidate_id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {candidate.candidate_name}
                      </Link>
                      <p className="text-sm text-gray-500">{candidate.candidate_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBar score={candidate.match_score} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {candidate.matched_skills?.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.matched_skills?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{candidate.matched_skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
                        candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        candidate.status === 'Interviewed' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Pipeline
                        currentStatus={candidate.status}
                        applicationId={candidate.id}
                        onUpdate={updateStatus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}