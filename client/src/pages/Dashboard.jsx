import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DoughnutStatsCard from "../components/common/DoughnutStatsCard";
import { getAttendanceStats } from "../services/operations/formResponseApi";

import totalReg from "../../public/assets/totalReg.svg";
import approved from "../../public/assets/approved.svg";
import checkedIn from "../../public/assets/checkedIn.svg";
import pending from "../../public/assets/pending.svg";

const Dashboard = () => {
  const { currentEvent } = useSelector((state) => state.event);
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalResponses: 0,
    pendingResponses: 0,
    approvedResponses: 0,
    rejectedResponses: 0,
    presentAttendees: 0,
    approvalRate: "0%",
    attendanceRate: "0%"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventStats = async () => {
      if (!currentEvent) return;
      
      setLoading(true);
      try {
        const response = await getAttendanceStats(currentEvent._id, token);
        if (response) {
          setStats(response);
        }
      } catch (error) {
        console.error("Error fetching event stats:", error);
      }
      setLoading(false);
    };

    fetchEventStats();
  }, [currentEvent, token]);

  if (!currentEvent) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Please select an event to view dashboard</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-600 mb-8">Event registration overview</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-700 font-medium">Total Registrations</p>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: "#EBF3FF" }}>
              <img src={totalReg} alt="Total registrations" className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-1">{stats.totalResponses}</h2>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-700 font-medium">Approved</p>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: "#DCFCE7" }}>
              <img src={approved} alt="Approved" className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-1">{stats.approvedResponses}</h2>
          <p className="text-gray-500 text-sm">{stats.approvalRate} approval rate</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-700 font-medium">Checked In</p>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: "#DBEAFE" }}>
              <img src={checkedIn} alt="Checked in" className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-1">{stats.presentAttendees}</h2>
          <p className="text-gray-500 text-sm">{stats.attendanceRate} of approved</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-700 font-medium">Pending</p>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: "#FEF3C7" }}>
              <img src={pending} alt="Pending" className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-1">{stats.pendingResponses}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Status</h2>
          <div className="flex justify-center">
            <DoughnutStatsCard 
              title="" 
              data={[
                { label: "Approved", value: stats.approvedResponses, color: "#34d399" },
                { label: "Pending", value: stats.pendingResponses, color: "#FBBF24" },
                { label: "Rejected", value: stats.rejectedResponses, color: "#F43F5E" },
              ]}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Check-in Status</h2>
          <div className="flex justify-center">
            <DoughnutStatsCard 
              title="" 
              data={[
                { label: "Checked In", value: stats.presentAttendees, color: "#34d399" },
                { label: "Not Checked In", value: stats.approvedResponses - stats.presentAttendees, color: "#60a5fa" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard