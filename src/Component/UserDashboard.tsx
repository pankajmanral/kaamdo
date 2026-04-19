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
import imageCompression from 'browser-image-compression';

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
    z.string().min(25, "Please enter at least 25 characters").max(250, "Details too long (max 250)")
  ),
  scheduled_date: emptyToUndefined(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  ),
  scheduled_time: emptyToUndefined(
    z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Time must be HH:mm or HH:mm:ss")
  ),
}).superRefine((val, ctx) => {
  if (val.scheduled_date && val.scheduled_time) {
    const jobDateTime = new Date(`${val.scheduled_date}T${val.scheduled_time}`);
    const now = new Date();
    const diffHours = (jobDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date and time must be at least 3 hours from now",
        path: ["scheduled_time"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date and time must be at least 3 hours from now",
        path: ["scheduled_date"],
      });
    }
  }
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<CreateJobForm>({
    resolver: zodResolver(CreateJobSchema) as Resolver<CreateJobForm>,
    mode: "onChange",
    defaultValues: {
      jobTaskId: undefined,
      details: "",
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

      const formData = new FormData();
      if (values.jobTaskId) formData.append("jobTaskId", values.jobTaskId.toString());
      if (values.details) formData.append("details", values.details);
      if (values.scheduled_date) formData.append("scheduled_date", values.scheduled_date);
      if (values.scheduled_time) formData.append("scheduled_time", values.scheduled_time);

      if (selectedFiles.length > 0) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
        for (const file of selectedFiles) {
          try {
            const compressedFile = await imageCompression(file, options);
            formData.append("images", compressedFile, compressedFile.name);
          } catch (error) {
            console.error("Compression error:", error);
            formData.append("images", file);
          }
        }
      }

      await axios.post(`${API_BASE_DASH}/api/createJob`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      reset();
      setSelectedCategoryId("");
      setSelectedSubcatId("");
      setSelectedFiles([]);
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
    setSelectedFiles([]);
    setIsTimeDropdownOpen(false);
    setServerError(null);
  };

  const now = new Date();
  const todayDateString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const selectedDate = watch("scheduled_date");
  const isToday = selectedDate === todayDateString;

  let minTime = "";
  if (isToday) {
    const futureDate = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const hours = futureDate.getHours().toString().padStart(2, "0");
    const minutes = futureDate.getMinutes().toString().padStart(2, "0");
    minTime = `${hours}:${minutes}`;
  }

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 10; i <= 22; i++) {
      const isPM = i >= 12;
      const hour12 = i > 12 ? i - 12 : i;

      // 00 minute slot
      slots.push({
        label: `${hour12.toString().padStart(2, '0')}:00 ${isPM ? 'PM' : 'AM'}`,
        value: `${i.toString().padStart(2, '0')}:00`,
        hour: i,
        minute: 0
      });

      // 30 minute slot (skip 10:30 PM if strictly until 10:00 PM)
      if (i !== 22) {
        slots.push({
          label: `${hour12.toString().padStart(2, '0')}:30 ${isPM ? 'PM' : 'AM'}`,
          value: `${i.toString().padStart(2, '0')}:30`,
          hour: i,
          minute: 30
        });
      }
    }
    return slots;
  }, []);

  const availableSlots = useMemo(() => {
    if (!isToday) return timeSlots;
    const minHour = parseInt(minTime.split(":")[0]) || 0;
    const minMinute = parseInt(minTime.split(":")[1]) || 0;
    return timeSlots.filter(slot => {
      if (slot.hour > minHour) return true;
      if (slot.hour === minHour && slot.minute >= minMinute) return true;
      return false;
    });
  }, [isToday, timeSlots, minTime]);

  useEffect(() => {
    if (isToday) {
      const currentTimeVal = getValues("scheduled_time");
      const isValidSlot = availableSlots.some(s => s.value === currentTimeVal);
      if (!isValidSlot) {
        if (availableSlots.length > 0) {
          setValue("scheduled_time", availableSlots[0].value, { shouldValidate: true });
        } else {
          setValue("scheduled_time", "", { shouldValidate: true });
        }
      }
    }
  }, [isToday, availableSlots, setValue, getValues]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
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

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (Max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => {
                if (e.target.files) {
                  setSelectedFiles(Array.from(e.target.files).slice(0, 5));
                }
              }}
            />
            {selectedFiles.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">{selectedFiles.length} file(s) selected.</p>
            )}
          </div>

          {/* Date */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-indigo-600">Schedule Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <input
                type="date"
                min={todayDateString}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white hover:bg-white hover:border-slate-300 transition-all shadow-sm"
                {...register("scheduled_date", {
                  onChange: (e) => {
                    if (e.target.value && e.target.value < todayDateString) {
                      setValue("scheduled_date", todayDateString, { shouldValidate: true });
                    }
                  }
                })}
              />
            </div>
            {errors.scheduled_date && (
              <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.scheduled_date.message as string}
              </p>
            )}
          </div>

          {/* Time Limit Slot Dropdown */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-indigo-600">Time Slot</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>

              <button
                type="button"
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:bg-white hover:border-slate-300 transition-all shadow-sm text-left flex items-center justify-between"
              >
                <span className={watch("scheduled_time") ? "text-slate-800" : "text-slate-400"}>
                  {availableSlots.find(s => s.value === watch("scheduled_time"))?.label || "Select a time slot"}
                </span>
              </button>

              <input type="hidden" {...register("scheduled_time")} />

              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none z-10">
                <svg className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180 text-indigo-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              {isTimeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsTimeDropdownOpen(false)} />
                  <div className="absolute z-50 w-full bottom-full mb-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1 custom-scrollbar ring-1 ring-black ring-opacity-5 origin-bottom">
                    {availableSlots.length > 0 ? (
                      availableSlots.map(slot => (
                        <div
                          key={slot.value}
                          onClick={() => {
                            setValue("scheduled_time", slot.value, { shouldValidate: true });
                            setIsTimeDropdownOpen(false);
                          }}
                          className={`px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors hover:bg-indigo-50 hover:text-indigo-700 ${watch("scheduled_time") === slot.value ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700'}`}
                        >
                          {slot.label}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm font-medium text-red-500">
                        No slots available today
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {errors.scheduled_time && (
              <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.scheduled_time.message as string}
              </p>
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
