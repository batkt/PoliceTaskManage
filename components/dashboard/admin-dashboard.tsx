"use client";

import ApprovalRejectionGauge from "./approve-rejection-gauge";
import PerformersSection from "./performers-section";
import PersonalAnalytics from "./personal-analytics";

function AdminDashboard({
    data,
    branches,
    selectedBranch,
    setSelectedBranch,
    fetchPerformers,
}: any) {
    const { approvalRejectionGauge, topPerformers, bottomPerformers, personalAnalytics } = data;

    return (
        <>
            {/* Approval/Rejection Gauge */}
            <ApprovalRejectionGauge data={approvalRejectionGauge} />

            {/* Top & Bottom Performers */}
            <PerformersSection
                topPerformers={topPerformers}
                bottomPerformers={bottomPerformers}
                branches={branches}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                fetchPerformers={fetchPerformers}
            />

            {/* Personal Analytics */}
            <PersonalAnalytics data={personalAnalytics} />
        </>
    );
}

export default AdminDashboard;