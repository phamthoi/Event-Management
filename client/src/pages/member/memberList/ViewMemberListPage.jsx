import React from "react";
import ViewMemberList from "../../../components/member/memberList/viewMemberList";

function ViewMemberListPage() {
  return (
    <div className="p-6 bg-gray-100 dark:bg-secondary-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Member List</h1>
      <ViewMemberList />
    </div>
  );
}

export default ViewMemberListPage;