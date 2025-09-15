//client/src/pages/member/ViewMemberListPage.jsx
import React from "react";
import MemberTable from "../../components/MemberList/MemberTable";

function ViewMemberListPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Danh sách Member</h1>
      <MemberTable role="member"/>
    </div>
  );
}

export default ViewMemberListPage;