import React, { useEffect, useState } from "react";
import { getMembers } from "../../../services/member/member/memberService";
import { showErrorAlert } from "../../../utils/member/errorHandler";

function ViewMemberList() {
  const [members, setMembers] = useState([]);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // luôn cố định chỉ lấy member đang active
  const [filters, setFilters] = useState({
    email: "",
    fullName: "",
    isActive: "true",
  });

  // input tạm cho filter
  const [tempFilters, setTempFilters] = useState({
    email: "",
    fullName: "",
  });

  const limit = 5;
  /*
  //============ Fake API =============
  // Fake member data
  const fakeMembers = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    email: `member${i + 1}@example.com`,
    fullName: `Member ${i + 1}`,
    phoneNumber: `0900${i.toString().padStart(4, "0")}`,
    isActive: true,
  }));
  //============= End Fake API ============
*/
  
  const loadMembers = async () => {
    try {
      setLoading(true);
      setMsg("");

      const params = {
        page,
        limit,
        ...filters,
      };

      const response = await getMembers(params);
      setMembers(response.members || []);
      setTotal(response.total || 0);
    } catch (err) {
      showErrorAlert(err);
      setMsg("Lỗi khi tải danh sách member");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };
  
/*
  //===========loadmembers Fake API =============
   const loadMembers = async () => {
    try {
      setLoading(true);
      setMsg("");

      // fake filter
      let filtered = fakeMembers.filter(
        (m) =>
          m.isActive === true &&
          m.email.includes(filters.email) &&
          m.fullName.includes(filters.fullName)
      );

      setTotal(filtered.length);

      // fake pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      setMembers(filtered.slice(start, end));
    } catch (err) {
      console.error("Error loading members:", err);
      setMsg("Lỗi khi tải danh sách member");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  //==============End=============
*/
  useEffect(() => {
    loadMembers();
  }, [page, filters]);

  const handleFilter = () => {
    setPage(1);
    setFilters({ ...filters, ...tempFilters });
  };

  const handleClearFilter = () => {
    const emptyFilters = {
      email: "",
      fullName: "",
      isActive: "true", // luôn giữ isActive = true
    };
    setTempFilters({ email: "", fullName: "" });
    setFilters(emptyFilters);
    setPage(1);
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
          onChange={(e) =>
            setTempFilters({ ...tempFilters, email: e.target.value })
          }
          className="border px-3 py-1 rounded"
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
        />
        <input
          type="text"
          placeholder="Full name"
          value={tempFilters.fullName}
          onChange={(e) =>
            setTempFilters({ ...tempFilters, fullName: e.target.value })
          }
          className="border px-3 py-1 rounded"
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
        />
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
        <button
          onClick={handleClearFilter}
          className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
        >
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
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-3 text-gray-500">
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
        <span>
          Page {page} of {totalPages} (Total: {total} members)
        </span>
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

export default ViewMemberList;
