import React, { useEffect, useState } from "react";
import { getMembers } from "../../../services/member/member/memberService";
import { showErrorAlert } from "../../../utils/errorHandler";

function ViewMemberList() {
  const [members, setMembers] = useState([]);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({ email: "", fullName: "", isActive: "true" });
  const [tempFilters, setTempFilters] = useState({ email: "", fullName: "" });

  const limit = 5;

  const loadMembers = async () => {
    try {
      setLoading(true);
      setMsg("");
      const params = { page, limit, ...filters };
      const response = await getMembers(params);
      setMembers(response.members || []);
      setTotal(response.total || 0);
    } catch (err) {
      showErrorAlert(err);
      setMsg("Error loading member list");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [page, filters]);

  const handleFilter = () => {
    setPage(1);
    setFilters({ ...filters, ...tempFilters });
  };

  const handleClearFilter = () => {
    setTempFilters({ email: "", fullName: "" });
    setFilters({ email: "", fullName: "", isActive: "true" });
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Email"
          value={tempFilters.email}
          onChange={(e) => setTempFilters({ ...tempFilters, email: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
          className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Full Name"
          value={tempFilters.fullName}
          onChange={(e) => setTempFilters({ ...tempFilters, fullName: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
          className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            🔍 Search
          </button>
          <button
            onClick={handleClearFilter}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            ❌ Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto border border-gray-200">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Full Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">No members found</td>
                </tr>
              ) : (
                members.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-3 text-sm">{m.email}</td>
                    <td className="px-4 py-3 text-sm">{m.fullName || "-"}</td>
                    <td className="px-4 py-3 text-sm flex items-center gap-2">
                      📞 {m.phoneNumber || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          ◀ Previous
        </button>
        <span className="text-sm font-medium">
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>

      {msg && <div className="text-red-600">{msg}</div>}
    </div>
  );
}

export default ViewMemberList;
