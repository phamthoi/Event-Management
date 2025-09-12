// components/MemberTable.jsx
// 👉 Component này hiển thị filter, bảng, pagination

import React, { useEffect, useState } from "react";
import {
  fetchMembers,
  toggleMemberLock,
  resetMemberPassword,
} from "../../services/MemberListService";

function MemberTable() {
  // State quản lý dữ liệu
  const [members, setMembers] = useState([]);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    email: "",
    fullName: "",
    isActive: "",
  });

  const limit = 5;

  // Load members từ API
  const loadMembers = async (applyFilter = false) => {
    try {
      const data = await fetchMembers({
        page,
        limit,
        ...filters,
      });

      setMembers(data.members || []);
      setHasMore(data.hasMore);
      setMsg("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Lỗi tải danh sách member");
    }
  };

  // Khi page thay đổi thì load lại
  useEffect(() => {
    loadMembers(true);
    // eslint-disable-next-line
  }, [page]);

  // Submit filter
  const handleFilter = () => {
    setPage(1); // reset về trang 1
    loadMembers(true);
  };

  // View member
  const handleView = (id) => {
    alert("Xem chi tiết member: " + id);
  };

  // Lock/unlock
  const handleToggleLock = async (id, isActive) => {
    try {
      const res = await toggleMemberLock(id, isActive);
      alert(res.message);
      loadMembers(true);
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // Reset password
  const handleResetPassword = async (id) => {
    if (!window.confirm("Reset password về 'Member@123'?")) return;
    try {
      const res = await resetMemberPassword(id);
      alert(res.message);
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="border px-3 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Full name"
          value={filters.fullName}
          onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
          className="border px-3 py-1 rounded"
        />
        <select
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
          className="border px-3 py-1 rounded"
        >
          <option value="">Status</option>
          <option value="true">Active</option>
          <option value="false">Locked</option>
        </select>
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Lọc
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Full Name</th>
            <th className="border px-3 py-2">Phone</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="text-center p-3 text-gray-500"
              >
                Không có member nào
              </td>
            </tr>
          ) : (
            members.map((m, idx) => (
              <tr key={m.id}>
                <td className="border px-3 py-2">
                  {(page - 1) * limit + idx + 1}
                </td>
                <td className="border px-3 py-2">{m.email}</td>
                <td className="border px-3 py-2">{m.fullName || "-"}</td>
                <td className="border px-3 py-2">{m.phoneNumber || "-"}</td>
                <td
                  className={`border px-3 py-2 ${
                    m.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {m.isActive ? "Active" : "Locked"}
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => handleView(m.id)}
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleToggleLock(m.id, m.isActive)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    {m.isActive ? "Lock" : "Unlock"}
                  </button>
                  <button
                    onClick={() => handleResetPassword(m.id)}
                    className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Reset PW
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={!hasMore}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {msg && <div className="mt-2 text-red-500">{msg}</div>}
    </div>
  );
}

export default MemberTable;
