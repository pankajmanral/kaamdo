import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface AssignedJob {
    jobId: number,
    jobName: string,
    postedBy: string,
    customerPhoneNumber: number,
    schedule_date: string,
    schedule_time: string,
    jobDetails: string,
    location: string
}

export default function AssignedJobs() {
    const [data, setData] = useState<AssignedJob[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response: any = await axios.get("http://localhost:4000/api/assigned-jobs", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setData(response.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load assigned jobs");
        } finally {
            setLoading(false);
        }
    }

    async function changeStatus(jobId: number) {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:4000/api/completeJob/${jobId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Job marked as completed!");
            getData();
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to update job status");
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 text-gradient">Assigned Jobs</h1>
                    <p className="text-slate-600 font-medium max-w-2xl mx-auto">
                        View tasks that have been assigned to you. Mark them as completed once you've finished the work.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : data.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="glass rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20"
                    >
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200/50">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left bg-white/40 first:rounded-tl-2xl">
                                            Job Name
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left bg-white/40">
                                            Posted By
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-white/40">
                                            Contact
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left bg-white/40">
                                            Location & Time
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right bg-white/40 last:rounded-tr-2xl">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50 bg-white/20 backdrop-blur-md">
                                    {data.map((item, index) => (
                                        <motion.tr variants={itemVariants} key={index} className="hover:bg-white/40 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-bold text-slate-900">{item.jobName}</div>
                                                <div className="text-xs text-slate-600 truncate mt-1 max-w-xs">{item.jobDetails}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-700">{item.postedBy}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-center">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                    {item.customerPhoneNumber}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-800">{item.location}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{item.schedule_date} {item.schedule_time && `at ${item.schedule_time}`}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => changeStatus(item.jobId)}
                                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    Mark Completed
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {data.map((item, index) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={index}
                                    className="bg-white/60 backdrop-blur-md shadow-sm rounded-2xl p-5 border border-white"
                                >
                                    <div className="flex justify-between items-start mb-3 border-b border-slate-200/50 pb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{item.jobName}</h3>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.jobDetails}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm mt-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Posted By</span>
                                            <span className="text-slate-900 font-semibold">{item.postedBy}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Contact</span>
                                            <span className="text-slate-900 font-semibold flex items-center gap-1">
                                                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                {item.customerPhoneNumber}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Location</span>
                                            <span className="text-slate-900 font-semibold">{item.location}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Timing</span>
                                            <span className="text-slate-900 font-semibold">{item.schedule_date} {item.schedule_time && `at ${item.schedule_time}`}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => changeStatus(item.jobId)}
                                        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Mark as Completed
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-3xl p-12 text-center max-w-lg mx-auto"
                    >
                        <div className="w-24 h-24 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="text-5xl">📋</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">No assigned jobs yet</h2>
                        <p className="text-slate-500 mb-8 px-4">You don't have any active jobs assigned to you right now. Go view the available jobs to place bids!</p>
                        <Link
                            to="/vendor-jobs"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:bg-blue-700 transition-all"
                        >
                            View Available Jobs
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}