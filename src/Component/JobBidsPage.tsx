// src/pages/JobBidsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

type BidStatus = "open" | "rejected" | "assigned" | "completed" | "cancelled" ;

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
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const token = localStorage.getItem("token"); // assuming JWT stored here

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
    } finally {
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

  if (loading) return <div className="p-6">Loading bids…</div>;

  return (
    <div className="w-full mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Bids for Job #{jobId}</h1>

      {bids.length === 0 && <div className="text-gray-500">No bids yet.</div>}

      {bids.map((b) => (
        <div key={b.id} className="border rounded-xl p-4 flex items-start justify-between">
          <div>
            <div className="font-medium">Vendor: {b.vendor?.name ?? `#${b.vendor?.id}`}</div>
            <div className="text-sm text-gray-600">Amount: ₹{b.amount}</div>
            {b.message && <div className="text-sm mt-1">{b.message}</div>}
            <div className="text-xs text-gray-500 mt-1">
              Status: <span className="capitalize">{b.status}</span> • {new Date(b.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              disabled={busyId === b.id || b.status !== "open"}
              onClick={() => accept(b.id)}
              className={`px-3 py-2 rounded-lg text-white ${b.status === "open" ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              {busyId === b.id ? "…" : "Accept"}
            </button>
            <button
              disabled={busyId === b.id || b.status !== "open"}
              onClick={() => reject(b.id)}
              className={`px-3 py-2 rounded-lg text-white ${b.status === "open" ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              {busyId === b.id ? "…" : "Reject"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
