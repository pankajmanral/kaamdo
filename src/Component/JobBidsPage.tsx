// src/pages/JobBidsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

type BidStatus = "open" | "accepted" | "rejected" | "assigned" | "completed" | "cancelled";

interface VendorMini {
  id: number;
  name: string;
  phone?: string;
}

interface Bid {
  id: number;
  amount: string; // from numeric
  message: string | null;
  status: BidStatus;
  vendor: VendorMini;
  createdAt: string;
}

export default function JobBidsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  const fetchBids = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await axios.get<{ bids: Bid[] }>(`${API_BASE}/jobs/${jobId}/bids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBids(res.data.bids);
    } finally {
      setLoading(false);
    }
  }, [jobId, token]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const accept = async (bidId: number) => {
    setBusyId(bidId);
    try {
      await axios.post(`${API_BASE}/bids/${bidId}/accept`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // optimistic refetch
      await fetchBids();
    } catch (err: any) {
      console.log(err.response?.data);
      setBusyId(null);
    }
  };

  const reject = async (bidId: number) => {
    setBusyId(bidId);
    try {
      await axios.post(`${API_BASE}/bids/${bidId}/reject`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBids();
    } finally {
      setBusyId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full glass hover:bg-white/80 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900">Bids for Job #{jobId}</h1>
        </div>

        {bids.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Bids Yet</h3>
            <p className="text-slate-600">Vendors haven't placed any bids on this job at the moment.</p>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {bids.map((b) => (
            <motion.div
              key={b.id}
              variants={itemVariants}
              className="glass border border-white/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                    {b.vendor?.name?.[0]?.toUpperCase() || '#'}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900 leading-tight">{b.vendor?.name ?? `Vendor #${b.vendor?.id}`}</div>
                    <div className="text-xs text-slate-500">{new Date(b.createdAt).toLocaleDateString()} at {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-blue-700">₹{b.amount}</span>
                  <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                    {b.status}
                  </span>
                </div>

                {b.message && (
                  <div className="mt-3 bg-white/60 p-3 rounded-lg border border-slate-200/50 text-sm text-slate-700 italic flex items-start gap-2">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path></svg>
                    "{b.message}"
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  disabled={busyId === b.id || b.status !== "open"}
                  onClick={() => accept(b.id)}
                  className={`flex-1 sm:w-32 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${b.status === "open"
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/20 hover:-translate-y-0.5"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed hidden" // hide if not open
                    }`}
                >
                  {busyId === b.id ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Accept
                    </>
                  )}
                </button>
                <button
                  disabled={busyId === b.id || b.status !== "open"}
                  onClick={() => reject(b.id)}
                  className={`flex-1 sm:w-32 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${b.status === "open"
                    ? "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed hidden" // hide if not open
                    }`}
                >
                  {busyId === b.id ? "..." : "Reject"}
                </button>
                {b.status === 'accepted' && (
                  <div className="w-full text-center py-2 px-4 rounded-xl bg-green-100 text-green-800 font-bold border border-green-200">
                    Accepted
                  </div>
                )}
                {b.status === 'rejected' && (
                  <div className="w-full text-center py-2 px-4 rounded-xl bg-red-100 text-red-800 font-bold border border-red-200">
                    Rejected
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
