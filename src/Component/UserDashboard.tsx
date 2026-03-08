import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { motion } from "framer-motion";

const API_BASE_DASH = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

// Helper: "" -> undefined, then validate as optional
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const CreateJobSchema = z.object({
  jobTaskId: z.preprocess(
    (val) => (val === "" || val === undefined || isNaN(Number(val)) ? undefined : Number(val)),
    z.number({
      message: "Please select a service needed"
    })
  ),
  details: emptyToUndefined(
    z.string().min(3, "Please add at least 3 characters").max(5000, "Details too long")
  ),
  city: emptyToUndefined(z.string().min(2, "City name is too short").max(100, "City name is too long")),
  pincode: emptyToUndefined(z.string().min(4, "Min 4 characters").max(10, "Max 10 characters")),
  scheduled_date: emptyToUndefined(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  ),
  scheduled_time: emptyToUndefined(
    z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Time must be HH:mm or HH:mm:ss")
  ),
});
type CreateJobForm = z.infer<typeof CreateJobSchema>;

type JobItem = {
  id: number;
  name: string;
  slug: string;
  kind: "category" | "sub-category";
  is_active: boolean;
  parentId: number | null;
};

interface UserJob {
  jobId: number;
  jobName?: string;
  details: string;
  location: string;
  status?: string;
  schedule_date: string | null;
  schedule_time: string | null;
  jobItemId: number;
  categryName: string;
  subCategoryName: string;
  createdAt?: string;
}

export function UserDashboard() {
  const navigate = useNavigate();

  // Job management state
  const [jobs, setJobs] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal and create job state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<JobItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [selectedSubcatId, setSelectedSubcatId] = useState<number | "">("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateJobForm>({
    resolver: zodResolver(CreateJobSchema) as Resolver<CreateJobForm>,
    defaultValues: {
      jobTaskId: undefined,
      details: "",
      city: "",
      pincode: "",
      scheduled_date: "",
      scheduled_time: "",
    },
  });

  // Fetch user's own jobs
  const fetchMyJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setError("You are not logged in. Please log in to view your jobs.");
        return;
      }

      const url = `${API_BASE_DASH}/api/viewJob?page=1&pageSize=50&status=all&sort=newest`;
      const res = await axios.get<any>(url, { headers: { Authorization: `Bearer ${token}` } });

      const raw = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);

      const normalized: UserJob[] = (raw || []).map((r: any) => {
        const jobId = r.jobId ?? r.id ?? r.job_id;

        const jobName =
          r.jobName ??
          r.job_type ??
          r.job_item?.name ??
          r.jobitem?.name ??
          r.category ??
          "";

        let schedule_time = r.schedule_time ?? r.scheduled_time ?? null;
        if (schedule_time && typeof schedule_time === "string" && schedule_time.includes("T")) {
          schedule_time = schedule_time.substring(11, 16);
        }

        return {
          jobId: jobId ?? 0,
          jobName: jobName ?? "",
          details: r.details ?? "",
          location: r.location ?? r.city ?? "",
          status: r.status ?? "open",
          schedule_date: r.schedule_date ?? r.scheduled_date ?? null,
          schedule_time,
          jobItemId: r.jobItemId ?? r.job_item_id ?? r.jobitem?.id ?? 0,
          categryName: r.categryName ?? r.categoryName ?? r.category ?? r.job_item?.category ?? "",
          subCategoryName: r.subCategoryName ?? r.sub_category ?? r.subCategory ?? "",
          createdAt: r.createdAt ?? r.created_at ?? null,
        } as UserJob;
      });

      setJobs(normalized);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to fetch your jobs";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch job items for create job form
  const fetchJobItems = async () => {
    try {
      setLoadingItems(true);
      setItemsError(null);

      const res = await axios.get(`${API_BASE_DASH}/api/job-item`);
      const raw = Array.isArray((res as any).data) ? (res as any).data : ((res as any).data?.data ?? (res as any).data?.items ?? []);
      const normalized = (raw || []).map((r: any) => ({
        id: Number(r.id),
        name: r.name ?? r.title ?? "",
        slug: r.slug ?? (r.name || "").toLowerCase().replace(/\s+/g, "-"),
        kind: /sub.?category/i.test(r.kind) ? "sub-category" : "category",
        is_active: r.is_active ?? r.active ?? (r.status === "active" || r.status === true),
        parentId: r.parentId ?? r.parent_id ?? r.parent ?? null,
      }));

      setItems(normalized.filter((i: JobItem) => i.name));
    } catch (e: any) {
      setItemsError(e?.response?.data?.message || e?.message || "Failed to load job items");
    } finally {
      setLoadingItems(false);
    }
  };

  const categories = useMemo(
    () => items.filter((i) => i.kind === "category"),
    [items]
  );

  const subcategoriesByParent = useMemo(() => {
    const map = new Map<number, JobItem[]>();
    items
      .filter((i) => i.kind === "sub-category" && i.parentId)
      .forEach((sc) => {
        const pid = sc.parentId as number;
        if (!map.has(pid)) map.set(pid, []);
        map.get(pid)!.push(sc);
      });
    map.forEach((arr, k) => {
      arr.sort((a, b) => a.name.localeCompare(b.name));
      map.set(k, arr);
    });
    return map;
  }, [items]);

  // When category changes, clear sub-category
  useEffect(() => {
    setSelectedSubcatId("");
    setValue("jobTaskId", undefined as unknown as number, { shouldValidate: true, shouldDirty: true });
  }, [selectedCategoryId, setValue]);

  // When sub-category changes, set jobTaskId
  useEffect(() => {
    if (selectedSubcatId === "") {
      setValue("jobTaskId", undefined as unknown as number, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue("jobTaskId", Number(selectedSubcatId), { shouldValidate: true, shouldDirty: true });
    }
  }, [selectedSubcatId, setValue]);

  const onSubmit = async (values: CreateJobForm) => {
    setServerError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setServerError("You are not logged in. Please log in to create a job.");
        return;
      }

      const payload: any = { jobTaskId: values.jobTaskId };
      if (values.details) payload.details = values.details;
      if (values.city) payload.city = values.city;
      if (values.pincode) payload.pincode = values.pincode;
      if (values.scheduled_date) payload.scheduled_date = values.scheduled_date;
      if (values.scheduled_time) payload.scheduled_time = values.scheduled_time;

      await axios.post(`${API_BASE_DASH}/api/createJob`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      reset();
      setSelectedCategoryId("");
      setSelectedSubcatId("");
      setIsModalOpen(false);
      fetchMyJobs();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create job";
      setServerError(msg);
    }
  };

  // On mount, fetch jobs and items
  useEffect(() => {
    fetchMyJobs();
    fetchJobItems();
  }, []);

  // Calculate stats
  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status === "open").length;
  const completedJobs = jobs.filter(j => j.status === "completed").length;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedCategoryId("");
    setSelectedSubcatId("");
    setServerError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-blob"></div>
      <div className="absolute top-20 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-blob animation-delay-2000"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Jobs</h1>
          <p className="text-slate-500 mt-1">View and manage the jobs you've posted.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-700 hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Job
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Jobs", value: totalJobs, icon: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h1a1 1 0 001-1v-6a1 1 0 00-1-1h-1z", color: "blue" },
          { label: "Open Jobs", value: openJobs, icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", color: "green" },
          { label: "Completed", value: completedJobs, icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", color: "slate" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`glass rounded-2xl p-6 border-l-4 border-${stat.color}-500 hover:-translate-y-1 transition-transform`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
                <p className="text-4xl font-extrabold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-100/50 rounded-xl p-3`}>
                <svg className={`w-8 h-8 text-${stat.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule={stat.label !== "Total Jobs" ? "evenodd" : undefined} d={stat.icon} clipRule={stat.label !== "Total Jobs" ? "evenodd" : undefined} />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your jobs…</p>
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-800 font-medium">{error}</p>
        </motion.div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-12 text-center"
        >
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-4">
              <span className="text-5xl">📋</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No jobs yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't posted any jobs yet. Create your first job to get started finding professionals for your tasks.</p>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 hover:-translate-y-0.5 shadow-lg shadow-blue-500/30 transition-all text-lg"
          >
            Create your first job
          </button>
        </motion.div>
      )}

      {jobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/50">
              <thead className="bg-slate-50/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Sr.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Job Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {jobs.map((item, index) => {
                  const schedule = [item.schedule_date, item.schedule_time].filter(Boolean).join(" ");
                  return (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      key={item.jobId}
                      onClick={() => navigate(`/jobs/${item.jobId}`)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-900">
                        {item.subCategoryName}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 max-w-xs truncate">
                        {item.details}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                        {item.location}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                        {schedule || "—"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${item.status === "open"
                          ? "bg-green-100 text-green-700"
                          : item.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                          }`}>
                          {item.status || "open"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 group-hover:underline font-semibold transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Create Job Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create New Job" maxWidth="max-w-2xl">
        <p className="text-gray-600 text-sm mb-4">
          Fill in the details to post a new job
        </p>

        {serverError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {itemsError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {itemsError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-1 mt-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors bg-white"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : "")}
              disabled={loadingItems || categories.length === 0}
            >
              <option value="">{loadingItems ? "Loading..." : "Select category"}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Needed */}
          {!!selectedCategoryId && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Needed *</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors bg-white"
                value={selectedSubcatId}
                onChange={(e) => setSelectedSubcatId(e.target.value ? Number(e.target.value) : "")}
                disabled={!selectedCategoryId}
              >
                <option value="">Select a service</option>
                {!!selectedCategoryId &&
                  (subcategoriesByParent.get(Number(selectedCategoryId)) || []).map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
              </select>
              {errors.jobTaskId && (
                <p className="mt-1 text-xs text-red-600">{errors.jobTaskId.message as string}</p>
              )}
            </div>
          )}

          {/* Details */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
            <textarea
              rows={3}
              placeholder="Describe the job requirements..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              {...register("details")}
            />
            {errors.details && <p className="mt-1 text-xs text-red-600">{errors.details.message as string}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              placeholder="e.g., Mumbai"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              {...register("city")}
            />
            {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message as string}</p>}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <input
              type="text"
              placeholder="e.g., 400001"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              {...register("pincode")}
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode.message as string}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              {...register("scheduled_date")}
            />
            {errors.scheduled_date && (
              <p className="mt-1 text-xs text-red-600">{errors.scheduled_date.message as string}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              step={60}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              {...register("scheduled_time")}
            />
            {errors.scheduled_time && (
              <p className="mt-1 text-xs text-red-600">{errors.scheduled_time.message as string}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t md:col-span-2 mt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
