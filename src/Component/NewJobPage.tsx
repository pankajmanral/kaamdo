import React, { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

// helper: "" -> undefined, then validate as optional
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const CreateJobSchema = z.object({
  // this will be set by selecting sub-category
  jobTaskId: z.coerce.number().int().positive("Please select a sub-category"),
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

  // local UI state for nested selects
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [selectedSubcatId, setSelectedSubcatId] = useState<number | "">("");

  // fetch job items (keeps dropdown in sync with DB updates at page load)
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
    // sort subcategories by name
    map.forEach((arr, k) => {
      arr.sort((a, b) => a.name.localeCompare(b.name));
      map.set(k, arr);
    });
    return map;
  }, [items]);

  // when category changes, clear sub-category + jobTaskId
  useEffect(() => {
    setSelectedSubcatId("");
    setValue("jobTaskId", undefined as unknown as number, { shouldValidate: true, shouldDirty: true });
  }, [selectedCategoryId, setValue]);

  // when sub-category changes, set jobTaskId
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 border-b pb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create a New Job</h1>
            <p className="text-gray-600">
              Choose a category and sub-category, then add optional details.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {itemsError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {itemsError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors bg-white"
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

            {/* Sub-category (sets jobTaskId) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Sub-category *</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors bg-white"
                value={selectedSubcatId}
                onChange={(e) => setSelectedSubcatId(e.target.value ? Number(e.target.value) : "")}
                disabled={!selectedCategoryId}
              >
                <option value="">
                  {!selectedCategoryId ? "Select a category first" : "Select sub-category"}
                </option>
                {selectedCategoryId !== "" &&
                  (subcategoriesByParent.get(Number(selectedCategoryId)) || []).map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
              </select>
              {/* show validation error for jobTaskId (backed by sub-category) */}
              {errors.jobTaskId && (
                <p className="mt-2 text-sm text-red-600">{errors.jobTaskId.message as string}</p>
              )}
            </div>

            {/* Details (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Details</label>
              <textarea
                rows={4}
                placeholder="e.g., Replace leaking kitchen tap in sink"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                {...register("details")}
              />
              {errors.details && <p className="mt-2 text-sm text-red-600">{errors.details.message as string}</p>}
            </div>

            {/* City (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
              <input
                type="text"
                placeholder="e.g., Dombivli"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                {...register("city")}
              />
              {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message as string}</p>}
            </div>

            {/* Pincode (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Pincode</label>
              <input
                type="text"
                placeholder="e.g., 400073"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                {...register("pincode")}
              />
              {errors.pincode && <p className="mt-2 text-sm text-red-600">{errors.pincode.message as string}</p>}
            </div>

            {/* Schedule (optional) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  {...register("scheduled_date")}
                />
                {errors.scheduled_date && (
                  <p className="mt-2 text-sm text-red-600">{errors.scheduled_date.message as string}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Scheduled Time</label>
                <input
                  type="time"
                  step={60}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  {...register("scheduled_time")}
                />
                {errors.scheduled_time && (
                  <p className="mt-2 text-sm text-red-600">{errors.scheduled_time.message as string}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors mt-8"
            >
              {isSubmitting ? "Creating…" : "Create Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
