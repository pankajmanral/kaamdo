import { Link, useNavigate } from "react-router-dom"
import unavailableImage from "../../src/assets/images/temporary_unavailable.jpg"
import axios from "axios"
import { useEffect, useState } from "react"

interface CompletedJobData {
    jobName: string,
    customerName: string,
    customerPhoneNumber: number,
    jobDate: string
}

export default function JobHistory(){

    const [data, setData] = useState<CompletedJobData[]>([])
    const navigate = useNavigate()

    async function getData() {

        try {

            const token = localStorage.getItem("token")
            if(!token){
                navigate("/")
            }

            const response:any = await axios.get("http://localhost:4000/api/completedJob",
                {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
            )
            console.log(response.data.data)
            setData(response.data.data)
        
        } catch (error) {
            
        }

    }

    useEffect(()=>{
        getData()
    },[])

    return(
        <>
            <div className="w-full">

                <div className="px-6 py-4 flex justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <Link to="/assigned-jobs" className="bg-black text-white rounded-lg px-4 py-1 hover:bg-gray-300 hover:text-black transition-all duration-3  00">
                            Assigned Job
                        </Link>
                        <Link to="/job-history" className="bg-black text-white rounded-lg px-4 py-1 hover:bg-gray-300 hover:text-black transition-all duration-3  00">
                            Job History
                        </Link>
                    </div>
                </div>

                {/* conditional rendering */}
                {
                    data.length > 0 ? 
                    (
                        <>
                            <h1 className="text-center d-block md:font-bold font-normal font-sans py-5 md:text-3xl text-xl transition-all duration-500">Completed jobs</h1>
                    

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
                                                Customer Phone number
                                            </th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                                                Job Name
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {data.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                                                    {item.customerName}
                                                </td>
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium text-gray-900 text-center">
                                                    {item.customerPhoneNumber}
                                                </td>
                                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-center">
                                                    {item.jobName}
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
                                            Posted By: <span className="font-normal">{item.customerName}</span>
                                        </p>
                                        <p className="text-sm text-gray-700 mb-1">
                                            Job Type: <span className="font-normal">{item.customerPhoneNumber}</span>
                                        </p>
                                        <p className="text-sm text-gray-700 mb-3">
                                            Details: <span className="font-normal">{item.jobName}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
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