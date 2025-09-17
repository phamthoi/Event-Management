// client/src/components/MemberList/MemberTable.jsx
import React, { useEffect, useState } from "react";
import { getMembers, lockMember, unlockMember, resetMemberPassword } from "../../../services/admin/member/memberService";

function MemberTable({ role = "admin" }) {
  const [members, setMembers] = useState([]);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [filters, setFilters] = useState({
    email: "",
    fullName: "",
    isActive: "",
  });

  const limit = 5;

  const loadMembers = async () => {
    try {
      const res = await getMembers();
      console.log("getMembers trả về:", res);

      let all = res.members || res; 
      if (!Array.isArray(all)) {
        throw new Error("API không trả về mảng members");
      }

      let filtered = all.filter((m) => {
        const matchesEmail = !filters.email || m.email.includes(filters.email);
        const matchesName = !filters.fullName || m.fullName.toLowerCase().includes(filters.fullName.toLowerCase());
        const matchesStatus = filters.isActive === "" ? true : m.isActive.toString() === filters.isActive;
        return matchesEmail && matchesName && matchesStatus;
      });

      if (role === "member") filtered = filtered.filter((m) => m.isActive);

      const start = (page - 1) * limit;
      const end = start + limit;
      setMembers(filtered.slice(start, end));
      setHasMore(end < filtered.length);
      setMsg("");
    } catch (err) {
      console.error(err);
      setMsg("Lỗi tải danh sách member");
    }
  };

  useEffect(() => {
    loadMembers();
  }, [page, filters, role]);

  const handleFilter = () => {
    setPage(1);
    loadMembers();
  };

  const handleView = (id) => {
    if (role !== "admin") return;
    alert("Xem chi tiết member: " + id);
  };

  const handleToggleLock = async (id, isActive) => {
    if (role !== "admin") return;

    try {
      if (isActive) {
        await lockMember(id);
        alert("Đã khóa member");
      } else {
        await unlockMember(id);
        alert("Đã mở khóa member");
      }

      // Cập nhật trạng thái realtime mà không reload toàn bộ API
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isActive: !isActive } : m))
      );
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thay đổi trạng thái member");
    }
  };

  const handleResetPassword = async (id) => {
    if (role !== "admin") return;
    if (!window.confirm("Reset password về 'Member@123'?")) return;

    try {
      await resetMemberPassword(id);
      alert("Đã reset password cho member " + id);
    } catch (err) {
      console.error(err);
      alert("Lỗi reset password");
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
        {role === "admin" && (
          <select
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            className="border px-3 py-1 rounded"
          >
            <option value="">Status</option>
            <option value="true">Active</option>
            <option value="false">Locked</option>
          </select>
        )}
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
            {role === "admin" && <th className="border px-3 py-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={role === "admin" ? 6 : 5} className="text-center p-3 text-gray-500">
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
                <td className={`border px-3 py-2 ${m.isActive ? "text-green-600" : "text-red-600"}`}>
                  {m.isActive ? "Active" : "Locked"}
                </td>
                {role === "admin" && (
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => handleView(m.id)}
                      className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleToggleLock(m.id, m.isActive)}
                      className={`px-2 py-1 rounded hover:opacity-90 ${
                        m.isActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
                      }`}
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
                )}
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
