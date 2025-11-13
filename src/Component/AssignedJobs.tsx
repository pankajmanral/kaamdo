import axios from "axios"
import { useEffect, useState } from "react"
import { StringFormatParams } from "zod/v4/core"

interface AssignedJob{
    jobName : string,
    postedBy : string,
    customerPhoneNumber : number,
    schedule_date : string,
    schedule_time: string,
    jobDetails : string,
    location : string
}

export default function AssignedJobs() {

    const [data, setData] = useState<AssignedJob[]>([])
 
    const getData = async () => {
        const token = localStorage.getItem("token")
        
        const response: any = await axios.get("http://localhost:4000/api/assigned-jobs", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response.data.data)
        setData(response.data.data)

    }

    useEffect(()=>{
        getData()
    },[])

    return (
        <>
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
                                Customer Phone <br /> number
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                                Job Name
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                                Details
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                                Location
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                                Date
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide text-left">
                                Time
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
                                    {item.customerPhoneNumber}
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                                    {item.jobName}
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                                    {item.jobDetails}
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                                    {item.location}
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                                    {item.schedule_date}
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-gray-900 text-left">
                                    {item.schedule_time}
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">
                                    <button className="min-w-[80px] sm:min-w-[100px] bg-blue-500 text-white py-1.5 sm:py-2 rounded-md hover:bg-blue-600 transition-colors">
                                        Completed
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}