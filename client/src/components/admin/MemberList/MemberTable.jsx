// client/src/components/MemberList/MemberTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMembers, MemberLock, MemberUnlock, resetMemberPassword } from "../../../services/admin/member/memberService";

function MemberTable({ role = "admin" }) {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    email: "",
    fullName: "",
    isActive: "",
  });

  // Thêm state để lưu giá trị input tạm thời
  const [tempFilters, setTempFilters] = useState({
    email: "",
    fullName: "",
    isActive: "",
  });

  const limit = 5;

  const loadMembers = async () => {
    try {
      setLoading(true);
      setMsg("");
      
      const params = {
        page,
        limit,
        ...filters
      };
      
      const response = await getMembers(params);
      console.log('Members response:', response);
      
      setMembers(response.members || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error loading members:', err);
      setMsg("Lỗi khi tải danh sách member");
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
    setFilters({ ...tempFilters }); // Áp dụng filter từ tempFilters
  };

  const handleClearFilter = () => {
    const emptyFilters = {
      email: "",
      fullName: "",
      isActive: "",
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
  };

  const handleView = (id) => {
    console.log('+++View member ID:', id);
    if (role !== "admin") return;
    navigate(`/admin/members/${id}`);
  };

  const handleToggleLock = async (id, isActive) => {
    if (role !== "admin") return;
    
    try {
      setLoading(true);
      if (isActive) {
        await MemberLock(id);
        alert("Đã khóa member");
      } else {
        await MemberUnlock(id);
        alert("Đã mở khóa member");
      }
      await loadMembers(); // Reload danh sách
    } catch (error) {
      console.error('Error toggling member lock:', error);
      alert("Lỗi khi thay đổi trạng thái member");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (id) => {
    if (role !== "admin") return;
    if (!window.confirm("Reset password về 'Member@123'?")) return;
    
    try {
      setLoading(true);
      await resetMemberPassword(id);
      alert("Đã reset password cho member " + id);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert("Lỗi khi reset password");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Email"
          value={tempFilters.email}
          onChange={(e) => setTempFilters({ ...tempFilters, email: e.target.value })}
          className="border px-3 py-1 rounded"
          onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
        />
        <input
          type="text"
          placeholder="Full name"
          value={tempFilters.fullName}
          onChange={(e) => setTempFilters({ ...tempFilters, fullName: e.target.value })}
          className="border px-3 py-1 rounded"
          onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
        />
        {role === "admin" && (
          <select
            value={tempFilters.isActive}
            onChange={(e) => setTempFilters({ ...tempFilters, isActive: e.target.value })}
            className="border px-3 py-1 rounded"
          >
            <option value="">Status</option>
            <option value="true">Active</option>
            <option value="false">Locked</option>
          </select>
        )}
        <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
          Tìm kiếm
        </button>
        <button onClick={handleClearFilter} className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600">
          Xóa bộ lọc
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
                    <button onClick={() => handleView(m.id)} className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400">
                      View
                    </button>
                    <button 
                      onClick={() => handleToggleLock(m.id, m.isActive)} 
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      {m.isActive ? "Lock" : "Unlock"}
                    </button>
                    <button 
                      onClick={() => handleResetPassword(m.id)} 
                      className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                      disabled={loading}
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
        <span>Page {page} of {totalPages} (Total: {total} members)</span>
        <button 
          disabled={page >= totalPages} 
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
