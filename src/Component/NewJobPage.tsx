import React, { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

// helper: map "" → undefined, then validate as optional <schema>
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const CreateJobSchema = z.object({
  jobTaskId: z.coerce
    .number({ message: "Select a valid task id" })
    .int()
    .positive("Task id must be positive"),
  details: emptyToUndefined(
    z.string().min(3, "Please add at least 3 characters").max(5000, "Details too long")
  ),
  city: emptyToUndefined(
    z.string().min(2, "City name is too short").max(100, "City name is too long")
  ),
  pincode: emptyToUndefined(z.string().min(4, "Min 4 characters").max(10, "Max 10 characters")),
  scheduled_date: emptyToUndefined(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  ),
  scheduled_time: emptyToUndefined(
    z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Time must be HH:mm or HH:mm:ss")
  ),
});

type CreateJobForm = z.infer<typeof CreateJobSchema>;

export default function NewJobPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateJobForm>({
    resolver: zodResolver(CreateJobSchema) as Resolver<CreateJobForm>,
    defaultValues: {
      jobTaskId: undefined,   // required; leave undefined initially
      details: "",
      city: "",
      pincode: "",
      scheduled_date: "",
      scheduled_time: "",
    },
  });

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

      await axios.post(`${API_BASE}/createJob`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      reset();
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create job";
      setServerError(msg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Create a New Job</h1>
        <p className="text-sm text-gray-500">Fill the details and submit to post your job.</p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Job Task ID (required) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Task ID *</label>
          <input
            type="number"
            placeholder="e.g., 42 (sub-category/task id)"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/80"
            {...register("jobTaskId", { valueAsNumber: true })}
          />
          {errors.jobTaskId && (
            <p className="mt-1 text-xs text-red-600">{errors.jobTaskId.message as string}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            (Will be a dropdown once the JobItem list endpoint is ready.)
          </p>
        </div>

        {/* Details (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Details</label>
          <textarea
            rows={4}
            placeholder="Describe the work (tools, scope, timing)"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/80"
            {...register("details")}
          />
          {errors.details && <p className="mt-1 text-xs text-red-600">{errors.details.message as string}</p>}
        </div>

        {/* City (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            placeholder="e.g., Nashik"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/80"
            {...register("city")}
          />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message as string}</p>}
        </div>

        {/* Pincode (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Pincode</label>
          <input
            type="text"
            placeholder="e.g., 422101"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/80"
            {...register("pincode")}
          />
          {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode.message as string}</p>}
        </div>

        {/* Schedule (optional) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/80"
              {...register("scheduled_date")}
            />
            {errors.scheduled_date && <p className="mt-1 text-xs text-red-600">{errors.scheduled_date.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scheduled Time</label>
            <input
              type="time"
              step={60}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/80"
              {...register("scheduled_time")}
            />
            {errors.scheduled_time && (
              <p className="mt-1 text-xs text-red-600">{errors.scheduled_time.message as string}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-black text-white py-2.5 font-medium hover:bg-black/90 disabled:opacity-60"
        >
          {isSubmitting ? "Creating…" : "Create Job"}
        </button>
      </form>
    </div>
  );
}
