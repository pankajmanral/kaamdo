import React, { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePlacesWidget } from "react-google-autocomplete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

// helper: "" -> undefined, then validate as optional
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const CreateJobSchema = z.object({
  jobTaskId: z.preprocess(
    (val) => (val === "" || val === undefined || isNaN(Number(val)) ? undefined : Number(val)),
    z.number({
      message: "Please select a service needed",
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
  address: emptyToUndefined(z.string().min(2, "Address too short")),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  placeId: emptyToUndefined(z.string()),
});
type CreateJobForm = z.infer<typeof CreateJobSchema>;

// API types
type JobItem = {
  id: number;
  name: string;
  slug: string;
  kind: "category" | "sub-category";
  is_active: boolean;
  parentId: number | null;
};

export default function NewJobPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [items, setItems] = useState<JobItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateJobForm>({
    resolver: zodResolver(CreateJobSchema) as Resolver<CreateJobForm>,
    defaultValues: {
      jobTaskId: undefined,
      details: "",
      city: "",
      pincode: "",
      scheduled_date: "",
      scheduled_time: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      placeId: "",
    },
  });

  const { ref } = usePlacesWidget({
    apiKey: (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "",
    onPlaceSelected: (place: any) => {
      if (place.formatted_address) {
        setValue("address", place.formatted_address, { shouldValidate: true });
      } else if (place.name) {
        setValue("address", place.name, { shouldValidate: true });
      }
      if (place.geometry?.location) {
        setValue("latitude", place.geometry.location.lat());
        setValue("longitude", place.geometry.location.lng());
      }
      if (place.place_id) {
        setValue("placeId", place.place_id);
      }
    },
    options: {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "in" },
    },
  });

  // local UI state for nested selects
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [selectedSubcatId, setSelectedSubcatId] = useState<number | "">("");

  // fetch job items
  useEffect(() => {
    (async () => {
      try {
        setLoadingItems(true);
        setItemsError(null);

        const res = await axios.get(`${API_BASE}/api/job-item`);
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
    })();
  }, []);

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

  useEffect(() => {
    setSelectedSubcatId("");
    setValue("jobTaskId", undefined as unknown as number, { shouldValidate: true, shouldDirty: true });
  }, [selectedCategoryId, setValue]);

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
      if (values.address) payload.address = values.address;
      if (values.latitude !== undefined) payload.latitude = values.latitude;
      if (values.longitude !== undefined) payload.longitude = values.longitude;
      if (values.placeId) payload.placeId = values.placeId;

      await axios.post(`${API_BASE}/api/createJob`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      reset();
      setSelectedCategoryId("");
      setSelectedSubcatId("");
      navigate("/user-dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create job";
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl w-full z-10"
      >
        <div className="glass rounded-3xl p-8 sm:p-12 shadow-xl border border-white/40">
          <div className="mb-10 border-b border-slate-200/50 pb-6 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 text-gradient">Post a New Job</h1>
            <p className="text-slate-600 font-medium">
              Choose a category and sub-category, then add details to get bids from professionals.
            </p>
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 rounded-xl border border-red-200 bg-red-50/80 p-5 text-sm text-red-700 shadow-sm backdrop-blur-sm flex items-center gap-3"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              {serverError}
            </motion.div>
          )}

          {itemsError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 rounded-xl border border-red-200 bg-red-50/80 p-5 text-sm text-red-700 shadow-sm backdrop-blur-sm flex items-center gap-3"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              {itemsError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category <span className="text-blue-500">*</span></label>
                <select
                  className="w-full rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : "")}
                  disabled={loadingItems || categories.length === 0}
                >
                  <option value="">{loadingItems ? "Loading categories..." : "Select category"}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-category (sets jobTaskId) */}
              {selectedCategoryId !== "" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Service Needed <span className="text-blue-500">*</span></label>
                  <select
                    className="w-full rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
                    value={selectedSubcatId}
                    onChange={(e) => setSelectedSubcatId(e.target.value ? Number(e.target.value) : "")}
                    disabled={!selectedCategoryId}
                  >
                    <option value="">
                      {!selectedCategoryId ? "Select a category first" : "Select specific service"}
                    </option>
                    {!!selectedCategoryId &&
                      (subcategoriesByParent.get(Number(selectedCategoryId)) || []).map((sc) => (
                        <option key={sc.id} value={sc.id}>
                          {sc.name}
                        </option>
                      ))}
                  </select>
                  {errors.jobTaskId && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded inline-block">
                      {errors.jobTaskId.message as string}
                    </motion.p>
                  )}
                </div>
              )}
            </div>

            {/* Details (optional) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Task Details</label>
              <textarea
                rows={4}
                placeholder="Describe your job. E.g., 'Need someone to fix a leaking kitchen pipe. Pipes are easily accessible under the sink.'"
                className="w-full rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm resize-none"
                {...register("details")}
              />
              {errors.details && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded inline-block">
                  {errors.details.message as string}
                </motion.p>
              )}
            </div>

            {/* Location Search API */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Location via Map</label>
              <input
                type="text"
                ref={ref as any}
                placeholder="Search precise location (e.g., Swastik Park)"
                className="w-full rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
              />
              {errors.address && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded inline-block">
                  {errors.address.message as string}
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              {/* City (optional) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                <input
                  type="text"
                  placeholder="e.g., Dombivli"
                  className="w-full rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
                  {...register("city")}
                />
                {errors.city && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded inline-block">
                    {errors.city.message as string}
                  </motion.p>
                )}
              </div>

              {/* Pincode (optional) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pincode</label>
                <input
                  type="text"
                  placeholder="e.g., 400073"
                  className="w-full rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
                  {...register("pincode")}
                />
                {errors.pincode && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded inline-block">
                    {errors.pincode.message as string}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Schedule (optional) */}
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
                  {...register("scheduled_date")}
                />
                {errors.scheduled_date && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded inline-block">
                    {errors.scheduled_date.message as string}
                  </motion.p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Scheduled Time</label>
                <input
                  type="time"
                  step={60}
                  className="w-full rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
                  {...register("scheduled_time")}
                />
                {errors.scheduled_time && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded inline-block">
                    {errors.scheduled_time.message as string}
                  </motion.p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 mt-6"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing Job...
                </span>
              ) : "Post Job Request"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
