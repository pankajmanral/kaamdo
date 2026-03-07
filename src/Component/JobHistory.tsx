import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CompletedJobData {
    jobId: number,
    jobName: string,
    customerName: string,
    customerPhoneNumber: number,
    jobDate: string,
    details?: string
}

export default function JobHistory() {
    const [data, setData] = useState<CompletedJobData[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    async function getData() {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/")
                return
            }

            const response: any = await axios.get("http://localhost:4000/api/completedJob",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setData(response.data.data)
        } catch (error) {
            console.error("Error fetching job history", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    }

    const [selectedJob, setSelectedJob] = useState<CompletedJobData | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

            <div className="px-6 py-4 flex justify-between glass shadow-sm sticky top-0 z-20 border-b border-white/50">
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 text-gradient">Completed Jobs History</h1>
                    <p className="text-slate-600 font-medium">Review all the tasks you have successfully completed.</p>
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
                        className="glass rounded-3xl p-6 shadow-sm border border-white/50"
                    >
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
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
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-white/40 last:rounded-tr-2xl">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50 bg-white/20 backdrop-blur-md">
                                    {data.map((item, index) => (
                                        <motion.tr
                                            variants={itemVariants}
                                            key={index}
                                            onClick={() => setSelectedJob(item)}
                                            className="hover:bg-white/40 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-sm font-bold text-slate-900">{item.jobName}</div>
                                                {item.details && <div className="text-xs text-slate-500 mt-1 truncate max-w-xs">{item.details}</div>}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-700">{item.customerName}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-center">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                    {item.customerPhoneNumber}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                    Completed
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List */}
                        <div className="block sm:hidden space-y-4">
                            {data.map((item, index) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={index}
                                    onClick={() => setSelectedJob(item)}
                                    className="bg-white/60 backdrop-blur-md shadow-sm rounded-2xl p-5 border border-white cursor-pointer active:scale-95 transition-transform"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-base font-bold text-slate-900 leading-tight">{item.jobName}</h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            <span className="font-medium text-slate-800">{item.customerName}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-slate-600">
                                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                            {item.customerPhoneNumber}
                                        </div>
                                    </div>
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
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No completed jobs yet</h2>
                        <p className="text-slate-600">When you finish working on assigned jobs, they will appear here in your history.</p>
                    </motion.div>
                )}
            </div>

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
                    >
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <span className="inline-flex mb-2 items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                Completed
                            </span>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedJob.jobName}</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Name</h4>
                                <div className="text-base font-semibold text-slate-800">{selectedJob.customerName}</div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Details</h4>
                                <div className="flex items-center text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium w-fit">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    {selectedJob.customerPhoneNumber}
                                </div>
                            </div>

                            {selectedJob.details && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Job Details</h4>
                                    <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        {selectedJob.details}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}