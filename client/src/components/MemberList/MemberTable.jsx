// components/MemberTable.jsx
// 👉 Component này hiển thị filter, bảng, pagination
import React, { useEffect, useState } from "react";
/*
import {
  fetchMembers,
  toggleMemberLock,
  resetMemberPassword,
} from "../../services/admin/MemberListService";
*/
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
/*
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
*/

 // Fake data
  const fakeMembers = [
  {
    id: 1,
    email: "alice@example.com",
    fullName: "Alice Nguyen",
    phoneNumber: "0901234567",
    isActive: true,
  },
  {
    id: 2,
    email: "bob@example.com",
    fullName: "Bob Tran",
    phoneNumber: "0912345678",
    isActive: false,
  },
  {
    id: 3,
    email: "charlie@example.com",
    fullName: "Charlie Pham",
    phoneNumber: "0987654321",
    isActive: true,
  },
  {
    id: 4,
    email: "david@example.com",
    fullName: "David Le",
    phoneNumber: "0934567890",
    isActive: true,
  },
  {
    id: 5,
    email: "eva@example.com",
    fullName: "Eva Hoang",
    phoneNumber: "0971234567",
    isActive: false,
  },
  {
    id: 6,
    email: "frank@example.com",
    fullName: "Frank Vu",
    phoneNumber: "0956781234",
    isActive: true,
  },];

  // load members(fake)
  // Load members (fake)
  const loadMembers = () => {
    try {
      // Filter trước
      let filtered = fakeMembers.filter((m) => {
        return (
          (!filters.email || m.email.includes(filters.email)) &&
          (!filters.fullName ||
            m.fullName.toLowerCase().includes(filters.fullName.toLowerCase())) &&
          (filters.isActive === ""
            ? true
            : m.isActive.toString() === filters.isActive)
        );
      });

      // Pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paged = filtered.slice(start, end);

      setMembers(paged);
      setHasMore(end < filtered.length);
      setMsg("");
    } catch (err) {
      setMsg("Lỗi tải danh sách member");
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line
  }, [page, filters]);

  // Submit filter
  const handleFilter = () => {
    setPage(1); // reset về trang 1
    loadMembers();
  };

  // View member
  const handleView = (id) => {
    alert("Xem chi tiết member: " + id);
  };

  // Lock/unlock
  const handleToggleLock = (id, isActive) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isActive: !isActive } : m
      )
    );
    alert(isActive ? "Đã khóa member" : "Đã mở khóa member");
  };

  // Reset password
  const handleResetPassword = (id) => {
    if (!window.confirm("Reset password về 'Member@123'?")) return;
    alert("Đã reset password cho member " + id);
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
              <td colSpan="6" className="text-center p-3 text-gray-500">
                Không có member nào
              </td>
            </tr>
          ) : (
            members.map((m, idx) => (
              <tr key={m.id}>
                <td className="border px-3 py-2">{(page - 1) * limit + idx + 1}</td>
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
