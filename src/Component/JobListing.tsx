import axios from "axios"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Modal from "../components/Modal"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Button from "../components/Button"

interface Job {
    jobId: number,
    jobName: string,
    postedBy: string,
    location: string,
    details: string,
    schedule_date: string | null,
    schedule_time: string | null,
    city?: string,
    hasBidded?: boolean
}

export default function JobListing() {
    const [data, setData] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
    const [bidData, setBidData] = useState({ amount: "", message: "" })

    // To support the city filter in original code
    const [city, setCity] = useState("");

    const handleBidChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBidData({ ...bidData, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedJobId) {
            toast.error("No job selected")
            return;
        }
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`http://localhost:4000/api/placeBid/${selectedJobId}`,
                {
                    amount: bidData.amount,
                    message: bidData.message
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            toast.success("Bid placed successfully")
            setData(prevData => prevData.map(job =>
                job.jobId === selectedJobId ? { ...job, hasBidded: true } : job
            ))
            setShowModal(false)
            setBidData({ amount: "", message: "" })
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to place bid"
            toast.error(errorMessage)
            console.log("Error placing bid", error)
        }
    }

    const getData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token")
            const response: any = await axios.get("http://localhost:4000/api/jobListing", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setData(response.data.data || [])
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData()
    }, [city])

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight text-gradient">Available Jobs</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Browse and bid on the latest project requests in your area.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : data.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-3xl p-12 text-center max-w-2xl mx-auto"
                    >

                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-6 shadow-inner border border-blue-100">
                            <span className="text-5xl">🔍</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">No jobs found</h3>
                        <p className="text-slate-500 mb-6">There are currently no available jobs matching your criteria.</p>
                        <Button onClick={() => setCity("")} variant="outline" className="border-indigo-200 hover:bg-indigo-50 text-indigo-700">
                            Clear Filters
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        {/* Table view for medium and larger screens */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hidden md:block glass rounded-3xl overflow-hidden shadow-sm"
                        >
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200/50">
                                    <thead className="bg-slate-50/50 backdrop-blur-sm">
                                        <tr>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Provider
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Task Details
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Location & Time
                                            </th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/50">
                                        {data.map((item, index) => (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={item.jobId || index}
                                                className="hover:bg-slate-50/50 transition-colors group"
                                            >
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                                            {item.postedBy ? item.postedBy.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-slate-900">{item.postedBy || "User"}</div>
                                                            <div className="text-xs text-slate-500">#{item.jobId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-sm font-bold text-slate-900 mb-1">{item.jobName}</div>
                                                    <div className="text-sm text-slate-600 line-clamp-2">{item.details}</div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                        {item.location || item.city || "Not specified"}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {[item.schedule_date, item.schedule_time].filter(Boolean).join(" ") || "Flexible timing"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button
                                                        size="sm"
                                                        className={`shadow-md shadow-indigo-500/20 transition-all ${item.hasBidded ? 'opacity-50 cursor-not-allowed bg-slate-400 hover:bg-slate-400 hover:shadow-none' : 'hover:shadow-indigo-500/40 hover:-translate-y-0.5 opacity-90 group-hover:opacity-100'}`}
                                                        onClick={() => {
                                                            if (item.hasBidded) return;
                                                            setShowModal(true)
                                                            setSelectedJobId(item.jobId)
                                                        }}
                                                        disabled={item.hasBidded}
                                                    >
                                                        {item.hasBidded ? "Bid Placed" : "Place Bid"}
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* Card view for small screens */}
                        <div className="md:hidden space-y-4">
                            {data.map((item, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={item.jobId || index}
                                    className="glass rounded-2xl p-6"
                                >
                                    <div className="flex justify-between items-start mb-4 border-b border-slate-200/50 pb-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                                {item.postedBy ? item.postedBy.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-bold text-slate-900">{item.postedBy || "User"}</div>
                                                <div className="text-xs text-slate-500">#{item.jobId}</div>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {item.jobName}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-700 mb-4 font-medium leading-relaxed">
                                        {item.details}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 text-xs font-semibold uppercase">Location</span>
                                            <span className="text-slate-900 font-medium">{item.location || item.city || "Any"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 text-xs font-semibold uppercase">Timing</span>
                                            <span className="text-slate-900 font-medium">
                                                {[item.schedule_date, item.schedule_time].filter(Boolean).join(" ") || "Flexible"}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        className={`w-full shadow-md shadow-indigo-500/20 ${item.hasBidded ? 'opacity-50 cursor-not-allowed bg-slate-400 hover:bg-slate-400 hover:shadow-none' : ''}`}
                                        onClick={() => {
                                            if (item.hasBidded) return;
                                            setShowModal(true)
                                            setSelectedJobId(item.jobId)
                                        }}
                                        disabled={item.hasBidded}
                                    >
                                        {item.hasBidded ? "Bid Placed" : "Place Bid"}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Place Your Bid">
                    <form onSubmit={onSubmit} className="space-y-5 mt-2">
                        <div className="mb-6 rounded-xl bg-blue-50/50 p-4 border border-blue-100">
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Bidding competitive rates</h4>
                            <p className="text-xs text-blue-700">Ensure your message highlights your experience to stand out to the customer.</p>
                        </div>

                        <Input
                            label="Bid Amount (₹)"
                            type="number"
                            name="amount"
                            value={bidData.amount}
                            onChange={handleBidChange}
                            placeholder="Enter your proposed rate"
                            required
                        />
                        <Textarea
                            label="Why should they hire you?"
                            name="message"
                            value={bidData.message}
                            onChange={handleBidChange}
                            placeholder="Describe your relevant experience and approach..."
                            required
                            rows={4}
                        />
                        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setShowModal(false)} type="button">
                                Cancel
                            </Button>
                            <Button type="submit" className="shadow-lg shadow-indigo-500/30">
                                Submit Bid
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    )
}