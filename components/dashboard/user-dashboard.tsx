"use client";

import PersonalAnalytics from "./personal-analytics";

function UserDashboard({ data }: any) {
    const { personalAnalytics } = data;

    if (!personalAnalytics) return null;

    return <PersonalAnalytics data={personalAnalytics} showAllSections />;
}

export default UserDashboard