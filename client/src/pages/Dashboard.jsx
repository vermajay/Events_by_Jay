import { useQuery } from "@tanstack/react-query";
import DoughnutStatsCard from "../components/common/DoughnutStatsCard";
import StatsCard from "../components/common/StatsCard";

import totalReg from "../../public/assets/totalReg.svg";
import approved from "../../public/assets/approved.svg";
import checkedIn from "../../public/assets/checkedIn.svg";
import pending from "../../public/assets/pending.svg";

const Dashboard = () => {

  return (
    <div>
      <div className="flex flex-row justify-center items-center w-full">
        <StatsCard title="Total Registrations" value="120" logo={totalReg} logoColor="#297FFF1A"/>
        <StatsCard title="Approved" value="80" description="20% of approval rate" logo={approved} logoColor="#DCFCE7"/>
        <StatsCard title="Checked In" value="60" description="50% of approved" logo={checkedIn} logoColor="#DBEAFE"/>
        <StatsCard title="Pending" value="20" logo={pending} logoColor="#FEF3C7"/>
      </div>

      <div className="min-h-[40px]"></div>

      <div className="flex flex-row justify-start items-center w-full">
        <DoughnutStatsCard 
          title="Registration Status" 
          data={[
            { label: "Approved", value: 45, color: "#F87171" },
            { label: "Pending", value: 30, color: "#FBBF24" },
            { label: "Rejected", value: 25, color: "#F43F5E" },
          ]}
        />

        <DoughnutStatsCard 
          title="Check-in Status" 
          data={[
            { label: "Checked In", value: 80, color: "#34d399" },
            { label: "Not Checked In", value: 20, color: "#60a5fa" },
          ]}
        />
      </div>

    </div>
  )
}

export default Dashboard