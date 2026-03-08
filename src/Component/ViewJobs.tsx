import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
      "inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full";
    let color = "";

    switch (status) {
      case "open":
        color = "bg-green-100 text-green-700 border border-green-200";
        break;
      case "assigned":
        color = "bg-blue-100 text-blue-700 border border-blue-200";
        break;
      case "in_progress":
        color = "bg-amber-100 text-amber-700 border border-amber-200";
        break;
      case "completed":
        color = "bg-emerald-100 text-emerald-700 border border-emerald-200";
        break;
      case "cancelled":
        color = "bg-red-100 text-red-700 border border-red-200";
        break;
      case "draft":
        color = "bg-slate-100 text-slate-700 border border-slate-200";
        break;
      default:
        color = "bg-slate-100 text-slate-700 border border-slate-200";
    }

    return <span className={`${base} ${color}`}>{status.replace("_", " ")}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-blob"></div>
      <div className="absolute top-40 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-blob animation-delay-2000"></div>

      {/* Filter Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vendor Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage and track your job applications and assignments.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-xl shadow-sm border border-slate-200/60">
          <span className="text-sm font-medium text-slate-600 pl-2">Filter status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JobStatus | "all")}
            className="border-none bg-white text-sm font-medium text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
          >
            {STATUS_LABELS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Desktop Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden sm:block overflow-hidden glass rounded-3xl shadow-sm"
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your job records...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6 shadow-inner border border-slate-200 text-4xl">
              📁
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-500">There are no records matching your current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/50">
              <thead className="bg-slate-50/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Sr.No
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                    Category Information
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                    Task Details
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                    Location & Time
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {jobs.map((job, index) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={job.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-900 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{job.subCategoryName || "-"}</div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">{job.categoryName || "-"}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 max-w-xs xl:max-w-md">
                      <div className="line-clamp-2 leading-relaxed">{job.details || "-"}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {job.city || "-"}
                      </div>
                      <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {[job.scheduled_date, job.scheduled_time].filter(Boolean).join(" ") || "Flexible timing"}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-left shadow-sm">
                      {renderStatusBadge(job.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Mobile view */}
      <div className="sm:hidden space-y-4">
        {loading ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            <p className="text-slate-600 text-sm font-medium">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <span className="text-3xl mb-3 block">📁</span>
            <p className="text-slate-600 text-sm font-medium">No jobs found for this filter.</p>
          </div>
        ) : (
          jobs.map((job, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              key={job.id}
              className="glass rounded-2xl p-5"
            >
              <div className="flex justify-between items-start mb-3 border-b border-slate-200/50 pb-3">
                <div>
                  <span className="text-sm font-bold text-slate-900 block mb-0.5">
                    {job.subCategoryName || job.categoryName || "Unknown Task"}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600">#{index + 1}</span>
                </div>
                {renderStatusBadge(job.status)}
              </div>

              <div className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                {job.details || "No details provided."}
              </div>

              <div className="bg-slate-50/50 rounded-xl p-3 grid grid-cols-2 gap-2 border border-slate-100">
                <div className="text-xs">
                  <span className="block text-slate-400 font-semibold uppercase mb-0.5">Location</span>
                  <span className="text-slate-800 font-medium">{job.city || "Not specified"}</span>
                </div>
                <div className="text-xs">
                  <span className="block text-slate-400 font-semibold uppercase mb-0.5">Timing</span>
                  <span className="text-slate-800 font-medium">
                    {[job.scheduled_date, job.scheduled_time].filter(Boolean).join(" ") || "Flexible"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
