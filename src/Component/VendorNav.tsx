import { Link } from "react-router-dom";

export default function VendorNav() {
    return (
        <>
            <div className="flex items-center gap-3 flex-wrap">
                <Link to="/vendor-jobs" className="bg-blue-400 text-white font-sans font-medium rounded-lg px-4 py-1 hover:bg-blue-600 transition-all duration-500">
                    All Jobs
                </Link>
                <Link to="/assigned-jobs" className="bg-blue-400 text-white font-sans font-medium rounded-lg px-4 py-1 hover:bg-blue-600 transition-all duration-500">
                    Assigned Job
                </Link>
                <Link to="/job-history" className="bg-blue-400 text-white font-sans font-medium rounded-lg px-4 py-1 hover:bg-blue-600 transition-all duration-500">
                    Job History
                </Link>
            </div>
        </>
    )
}