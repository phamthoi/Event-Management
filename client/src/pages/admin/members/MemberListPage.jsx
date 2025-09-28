

import React from "react";
import MemberTable from "../../../components/admin/MemberList/MemberTable";

function MemberListPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Member List</h1>
      <MemberTable role="admin" />
    </div>
  );
}

export default MemberListPage;
