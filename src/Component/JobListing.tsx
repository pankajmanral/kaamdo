import axios from "axios"
import { useEffect, useState } from "react"

interface Job {
    jobId: number,
    jobName: string,
    postedBy: string,
    location: string,
    details: string,
    schedule_date: string | null,
    schedule_time: string | null
}

export default function JobListing(){

    const [data, setData] = useState<Job[]>([]);

    const getData = async() => {

        // get the authentication token from the localstorage 
        const token = localStorage.getItem("token")

        const response = await axios.get("http://localhost:4000/api/jobListing",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response.data.data)
        setData(response.data.data)

    }

    useEffect(()=>{
        getData()
    },[])

    return(
        <>
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Sr.No</th> 
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Posted By</th> 
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Job type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Details</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"></th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">

                        {/* loop through the data inside the useState data */}

                        {data.map((item, index) => (
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.postedBy}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.jobName}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.details}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Bid</button>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors">Reject</button>
                            </td>
                            </tr>
                        ))}

                        {/* <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Pankaj</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Computer Engineer — React / Django</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Bid</button>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors">Reject</button>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </>
    )
}