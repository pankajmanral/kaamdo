import axios from "axios";
import { useEffect, useState } from "react";

type JobStatus = "open" | "assigned" | "in_progress" | "completed" | "cancelled" | "draft";

interface UserJob {
  id: number;
  categoryName: string;
  subCategoryName: string;
  details: string;
  city: string;
  status: JobStatus;
  scheduled_date: string | null;
  scheduled_time: string | null;
  created_at: string | null;
}

const STATUS_LABELS: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyJobs() {
  const [jobs, setJobs] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");

  const fetchJobs = async (status: JobStatus | "all" = "all") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Adjust the URL if your route is different (e.g. /api/viewJob)
      const response = await axios.get("http://localhost:4000/api/viewJob", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          pageSize: 20,
          ...(status !== "all" ? { status } : {}), // only send status if not "all"
        },
      });


setJobs((response.data as { data: UserJob[] }).data ?? []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const renderStatusBadge = (status: JobStatus) => {
    let base =
      "inline-flex items-center px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full";
    let color = "";

    switch (status) {
      case "open":
        color = "bg-green-100 text-green-700";
        break;
      case "assigned":
        color = "bg-blue-100 text-blue-700";
        break;
      case "in_progress":
        color = "bg-yellow-100 text-yellow-700";
        break;
      case "completed":
        color = "bg-emerald-100 text-emerald-700";
        break;
      case "cancelled":
        color = "bg-red-100 text-red-700";
        break;
      case "draft":
        color = "bg-gray-100 text-gray-700";
        break;
      default:
        color = "bg-gray-100 text-gray-700";
    }

    return <span className={`${base} ${color}`}>{status.replace("_", " ")}</span>;
  };

  return (
    <>
      {/* Filter Row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-800">My Job Listings</h2>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Filter by status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JobStatus | "all")}
            className="border border-gray-300 text-xs sm:text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {STATUS_LABELS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No jobs found for this filter.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Sr.No
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Category
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Sub Category
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                  Details
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                  Location
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                  Date
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                  Time
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {jobs.map((job, index) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                    {index + 1}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                    {job.categoryName || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                    {job.subCategoryName || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left max-w-xs truncate">
                    {job.details || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                    {job.city || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                    {job.scheduled_date || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                    {job.scheduled_time || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                    {renderStatusBadge(job.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* (Optional) Simple mobile view – you can style later */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="p-3 text-center text-sm text-gray-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-3 text-center text-sm text-gray-500">
            No jobs found for this filter.
          </div>
        ) : (
          jobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500">
                  #{index + 1} • {job.categoryName}
                </span>
                {renderStatusBadge(job.status)}
              </div>
              {job.subCategoryName && (
                <div className="text-xs text-gray-600 mb-1">
                  Sub-category: {job.subCategoryName}
                </div>
              )}
              <div className="text-xs text-gray-800 mb-1 line-clamp-2">
                {job.details || "-"}
              </div>
              <div className="text-[11px] text-gray-600">
                <div>Location: {job.city || "-"}</div>
                <div>
                  {job.scheduled_date || "-"} {job.scheduled_time || ""}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
