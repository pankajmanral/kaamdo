import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Reuse the same API_BASE strategy as RegisterPage
const API_BASE_DASH = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

// Define the shape of a job as returned by your backend
interface UserJob {
  jobId: number;
  jobName: string;      // e.g., category or type of job
  details: string;      // description provided by the user
  location: string;     // city/area
  schedule_date: string | null; // optional
  schedule_time: string | null; // optional
  status?: string;      // optional: open | assigned | in_progress | completed | cancelled
  createdAt?: string;   // optional: for sorting/display
}

export function UserDashboard() {
  const navigate = useNavigate();

  // Local UI state
  const [jobs, setJobs] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's own jobs
  const fetchMyJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) Read JWT from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setError("You are not logged in. Please log in to view your jobs.");
        return;
      }


      // 2) Build required query params (your backend needs them; otherwise 400)
// If your API later adds server-side defaults, you can remove these.
const params = new URLSearchParams({
page: "1",
pageSize: "10",
status: "open",
sort: "newest",
});

      // 2) Make the API call
      //    Adjust the URL to your actual endpoint (e.g., "/api/user/jobs" or "/api/customer/jobs")
      const res = await axios.get<{ data: UserJob[] }>(`${API_BASE_DASH}/api/viewJob?page=1&pageSize=10&status=open&sort=newest`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3) Update local state
      //    Assuming the response shape is { data: [...] }
      const list: UserJob[] = res.data?.data ?? [];
      setJobs(Array.isArray(list) ? list : []);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to fetch your jobs";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // On mount, pull the list
  useEffect(() => {
    fetchMyJobs();
  }, []);

  // Navigate to the job creation page (or open a modal if you prefer)
  const handleCreateNew = () => {
    navigate("/create-job");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Your Jobs</h1>
          <p className="text-sm text-gray-500">View and manage the jobs you've posted.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-black/90"
        >
          + Create New Job
        </button>
      </div>

      {/* Loading / Error / Empty states */}
      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">Loading your jobs…</div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-700">You haven't posted any jobs yet.</p>
          <button
            onClick={handleCreateNew}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-black/90"
          >
            Create your first job
          </button>
        </div>
      )}

      {/* Jobs table */}
      {jobs.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Sr.No</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Job Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">Details</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Location</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Schedule</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Vendor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {jobs.map((item, index) => {
                const schedule = [item.schedule_date, item.schedule_time].filter(Boolean).join(" ");
                return (
                  <tr key={item.jobId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{item.jobName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-left max-w-[28rem] truncate">{item.details}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-center">{item.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{schedule || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-center">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-700">
                        {item.status || "open"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* View details action — route to a details page if available */}
                        <button
                          onClick={() => navigate(`/jobs/${item.jobId}`)}
                          className="rounded-md bg-blue-500 px-3 py-1.5 text-white hover:bg-blue-600"
                        >
                          View
                        </button>
                        {/* Edit job — route to edit page */}
                        <button
                          onClick={() => navigate(`/jobs/${item.jobId}/edit`)}
                          className="rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
