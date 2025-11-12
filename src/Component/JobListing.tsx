import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import unavailableImage from "../../src/assets/images/temporary_unavailable.jpg"

interface Job {
    jobId: number,
    jobName: string,
    postedBy: string,
    location: string,
    details: string,
    schedule_date: string | null,
    schedule_time: string | null
}

interface BidData{
    amount: number,
    message: string
}

export default function JobListing() {

    const [data, setData] = useState<Job[]>([]);
    const [showModal, setShowModal] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
    const {register, handleSubmit, formState: {errors}} = useForm<BidData>()

    const onSubmit = async function(formData: BidData){
        try {

            if(!selectedJobId){
                alert("No job selected")
                return;
            }

            const token = localStorage.getItem("token")

            const response = await axios.post(`http://localhost:4000/api/placeBid/${selectedJobId}`,
                {
                    amount: formData.amount,
                    message: formData.message
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            toast.success("Bid placed successfully")
            console.log("Response", response.data)

            setShowModal(false)

        } catch (error) {
            console.log("Error placing bid",error)
        }
    }

    const getData = async () => {

        // get the authentication token from the localstorage 
        const token = localStorage.getItem("token")

        const response: any = await axios.get("http://localhost:4000/api/jobListing", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response.data.data)
        setData(response.data.data)

    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className="w-full">


                {/* conditional rendering */}
                {
                    data.length > 0 ? 
                    (
                        <>
                            <h1 className="text-center d-block md:font-bold font-normal font-sans py-5 md:text-3xl text-xl transition-all duration-500">Job listing view for vendors</h1>
                    
                            <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                                                Sr.No
                                            </th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                                                Posted By
                                            </th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                                                Job Type
                                            </th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                                                Details
                                            </th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                                                Location
                                            </th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {data.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                                                    {item.postedBy}
                                                </td>
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                                                    {item.jobName}
                                                </td>
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                                                    {item.details}
                                                </td>
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                                                    {item.location}
                                                </td>
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                                                    <button className="min-w-[80px] sm:min-w-[100px] bg-blue-500 text-white py-1.5 sm:py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={()=>{
                                                        setShowModal(true)
                                                        setSelectedJobId(item.jobId)
                                                    }}>
                                                        Bid
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="block sm:hidden space-y-4">
                                {data.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white shadow-sm rounded-lg p-4 border border-gray-100"
                                    >
                                        <p className="text-xs text-gray-500 font-semibold mb-1">
                                            #{index + 1}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                            Posted By: <span className="font-normal">{item.postedBy}</span>
                                        </p>
                                        <p className="text-sm text-gray-700 mb-1">
                                            Job Type: <span className="font-normal">{item.jobName}</span>
                                        </p>
                                        <p className="text-sm text-gray-700 mb-3">
                                            Details: <span className="font-normal">{item.details}</span>
                                        </p>
                                        <div className="flex justify-end">
                                            <button className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-600 transition" onClick={()=>{
                                                        setShowModal(true)
                                                        setSelectedJobId(item.jobId)
                                                    }}>
                                                Bid
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {showModal && (
                                <div id="bidModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    {/* Modal Box */}
                                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
                                        {/* Close Button */}
                                        <button id="closeModal" className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={()=>setShowModal(false)}>&times;</button>

                                        {/* Modal Header */}
                                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                            Place Your Bid
                                        </h2>

                                        {/* Bid Form */}
                                        <form id="bidForm" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                            {/* Bid Amount */}
                                            <div>
                                                <label htmlFor="amount" className="block text-gray-700 font-medium mb-1">
                                                    Bid Amount (₹)
                                                </label>
                                                <input type="number" id="amount" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter your bid amount"
                                                    {...register("amount",{
                                                        required: "Please enter the amount",
                                                        pattern: {
                                                            value: /^[0-9]{2,9}$/,
                                                            message: "Enter charges"
                                                        }
                                                    })}/>
                                                {errors.amount ? <p className={`text-sm ps-2 h-4 my-1 ${errors.amount.message ? "text-red-500" : "invisible"}`}>{errors.amount.message}</p> : <p className="text-sm ps-2 h-4 my-1 invisible">This is for the error</p>}
                                            </div>

                                            {/* Message */}
                                            <div>
                                                <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                                                    Message
                                                </label>
                                                <textarea id="message" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter a message for the job poster" 
                                                    {...register("message",{
                                                        required: "Please enter a message for the user to see",
                                                        pattern: {
                                                            value: /^.{4,}$/,
                                                            message: "Message should be atleast 4 characters",
                                                        }
                                                    })}>
                                                </textarea>
                                                {errors.message ? <p className={`text-sm ps-2 h-4 my-1 ${errors.message.message ? "text-red-500" : "invisible"}`}>{errors.message.message}</p> : <p className="text-sm ps-2 h-4 my-1 invisible">This is for the error</p>}
                                            </div>

                                            {/* Submit Button */}
                                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200">
                                                Submit Bid
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : 
                        <div className="relative h-screen w-full flex justify-center items-center">
                        
                            {/* Transparent overlay */}
                            <div className="absolute inset-0 bg-white bg-center bg-no-repeat opacity-5"  style={{ backgroundImage: `url(${unavailableImage})` }}></div>

                            {/* Text content */}
                            <h1 className="relative font-light font-sans md:text-2xl text-md text-black text-center">
                                No jobs to display at the moment...
                            </h1>
                        </div>
                }

            </div>

        </>
    )
}