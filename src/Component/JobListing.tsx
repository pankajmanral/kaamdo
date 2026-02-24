import axios from "axios"
import { useEffect, useState } from "react"
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
    schedule_time: string | null
}

export default function JobListing() {
    const [data, setData] = useState<Job[]>([]);
    const [showModal, setShowModal] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
    const [bidData, setBidData] = useState({ amount: "", message: "" })

    const handleBidChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBidData({ ...bidData, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!selectedJobId){
            alert("No job selected")
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
            alert("Bid placed successfully")
            setShowModal(false)
            setBidData({ amount: "", message: "" })
        } catch (error) {
            console.log("Error placing bid",error)
        }
    }

    const getData = async () => {
        const token = localStorage.getItem("token")
        const response: any = await axios.get("http://localhost:4000/api/jobListing", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setData(response.data.data)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Available Jobs</h1>

            {/* Table view for medium and larger screens */}
            <div className="hidden sm:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sr.No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Posted By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.postedBy}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.jobName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                        {item.details}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Button
                                            size="sm"
                                            onClick={()=>{
                                                setShowModal(true)
                                                setSelectedJobId(item.jobId)
                                            }}
                                        >
                                            Bid
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Card view for small screens */}
            <div className="block sm:hidden space-y-4">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-sm rounded-lg p-6 border border-gray-100"
                    >
                        <p className="text-sm text-gray-500 font-semibold mb-2">
                            #{index + 1}
                        </p>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                            Posted By: <span className="font-normal">{item.postedBy}</span>
                        </p>
                        <p className="text-sm text-gray-700 mb-1">
                            Job Type: <span className="font-normal">{item.jobName}</span>
                        </p>
                        <p className="text-sm text-gray-700 mb-4">
                            Details: <span className="font-normal">{item.details}</span>
                        </p>
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                onClick={()=>{
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

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Place Your Bid">
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input
                        label="Bid Amount (₹)"
                        type="number"
                        name="amount"
                        value={bidData.amount}
                        onChange={handleBidChange}
                        placeholder="Enter your bid amount"
                        required
                    />
                    <Textarea
                        label="Message"
                        name="message"
                        value={bidData.message}
                        onChange={handleBidChange}
                        placeholder="Enter a message for the job poster"
                        required
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