import React from "react";
import MemberTable from "../../../components/admin/MemberList/MemberTable";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

function MemberListPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm">
          👥 Member Management
        </h1>
        <button
          onClick={() => navigate("/admin/members/create")}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow hover:from-blue-700 hover:to-blue-600 transition"
        >
          <PlusIcon className="w-4 h-4" />
          Create Member
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl p-4 overflow-x-auto">
        <MemberTable />
      </div>
    </div>
  );
}

export default MemberListPage;
