import { useEffect, useState } from "react"
import Modal from "../components/Modal"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Button from "../components/Button"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

interface Job {
    jobId: number,
    jobName: string,
    postedBy: string,
    location: string,
    details: string,
    schedule_date: string | null,
    schedule_time: string | null
}

interface JobBidData {
    amount: number,
    message: string
}

// format time
const formatTime = (time: string | null) => {
    if (!time) return null;
    try {
        const parts = time.split(':');
        if (parts.length < 2) return time;
        const h = parseInt(parts[0], 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHours = h % 12 || 12;
        return `${formattedHours}:${parts[1]} ${ampm}`;
    } catch {
        return time;
    }
}

export default function JobListing() {
    const [data, setData] = useState<Job[]>([]);
    const [showModal, setShowModal] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
    const { register, handleSubmit, reset } = useForm<JobBidData>({
        defaultValues: {
            amount: undefined,
            message: ""
        }
    })

    const bidJob = async (data: JobBidData) => {

        const token = localStorage.getItem("token")

        try {
            const { amount, message } = data
            const payload = {
                amount: Number(amount),
                message: message
            }
            const response = await fetch(`http://localhost:4000/api/placeBid/${selectedJobId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.message)
            }
            toast.success(result.message)
            setShowModal(false)
            reset()
            console.log(result)
        } catch (error: any) {
            toast.error(error.message)
            reset()
        } finally {
            setShowModal(false)
        }
    }

    // useEffect to fetch all the job listings
    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:4000/api/jobListing", {
                method: "GET",
                headers: {
                    "Content-Type": "application-json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const result = await response.json()
            setData(result.data)
        }
        getData()
    }, [])

    // Job stats
    const totalJobs = data.length;
    // You can add more stats if available, e.g., open/completed jobs

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
                    <p className="text-gray-600 mt-1">Browse and bid on jobs posted by users.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Jobs</p>
                            <p className="text-4xl font-bold text-gray-900 mt-2">{totalJobs}</p>
                        </div>
                        <div className="bg-blue-100 rounded-lg p-3">
                            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h1a1 1 0 001-1v-6a1 1 0 00-1-1h-1z" />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* Add more stats cards here if needed */}
            </div>

            {/* Card view for all screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500 font-semibold">#{index + 1}</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{item.jobName}</span>
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-1">
                                {item.details}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Posted By:</span> {item.postedBy}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Location:</span> {item.location}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Date:</span> {item.schedule_date || "—"}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Time:</span> {formatTime(item.schedule_time) || "—"}
                            </p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button
                                size="sm"
                                onClick={() => {
                                    setShowModal(true)
                                    setSelectedJobId(item.jobId)
                                }}
                            >
                                Bid
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bid Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Place Your Bid">
                <form onSubmit={handleSubmit(bidJob)} className="space-y-4">
                    <Input
                        label="Bid Amount (₹)"
                        type="number"
                        placeholder="Enter your bid amount"
                        {...register("amount", {
                            required: true
                        })}
                    />
                    <Textarea
                        label="Message"
                        placeholder="Enter a message for the job poster"
                        {...register("message", {
                            required: true
                        })}
                    />
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Submit Bid
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}