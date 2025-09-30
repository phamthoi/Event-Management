// src/components/admin/MemberList/MemberTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  Cross2Icon,
  EyeOpenIcon,
  LockClosedIcon,
  LockOpen1Icon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { getMembers, MemberLock, MemberUnlock } from "../../../services/admin/member/memberService";
import { showErrorAlert } from "../../../utils/admin/errorHandler";

function MemberTable({ role = "admin" }) {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({ email: "", fullName: "", isActive: "" });
  const [tempFilters, setTempFilters] = useState({ email: "", fullName: "", isActive: "" });

  const limit = 5;
  const totalPages = Math.ceil(total / limit);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = { page, limit, ...filters };
      const response = await getMembers(params);
      setMembers(response.members || []);
      setTotal(response.total || 0);
      setMsg("");
    } catch (err) {
      console.error(err);
      showErrorAlert(err);
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
    setFilters({ ...tempFilters });
  };

  const handleClearFilter = () => {
    const empty = { email: "", fullName: "", isActive: "" };
    setTempFilters(empty);
    setFilters(empty);
    setPage(1);
  };

  const handleView = (id) => {
    if (role !== "admin") return;
    navigate(`/admin/members/${id}`);
  };

  const handleToggleLock = async (id, isActive) => {
    if (role !== "admin") return;
    try {
      setLoading(true);
      if (isActive) await MemberLock(id);
      else await MemberUnlock(id);
      await loadMembers();
    } catch (err) {
      console.error(err);
      showErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (id) => {
    if (role !== "admin") return;
    navigate(`/admin/members/${id}/reset-password`);
  };

  const renderStatusBadge = (isActive) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
          isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "Active" : "Locked"}
      </span>
    );
  };

  if (loading) return <div className="text-center py-6 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Filter Card */}
      <div className="p-5 bg-white shadow-md rounded-2xl flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Email"
          value={tempFilters.email}
          onChange={(e) => setTempFilters({ ...tempFilters, email: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
          className="border px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Full Name"
          value={tempFilters.fullName}
          onChange={(e) => setTempFilters({ ...tempFilters, fullName: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleFilter()}
          className="border px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        {role === "admin" && (
          <select
            value={tempFilters.isActive}
            onChange={(e) => setTempFilters({ ...tempFilters, isActive: e.target.value })}
            className="border px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Status</option>
            <option value="true">Active</option>
            <option value="false">Locked</option>
          </select>
        )}
        <button
          onClick={handleFilter}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          <MagnifyingGlassIcon className="w-4 h-4" /> Search
        </button>
        <button
          onClick={handleClearFilter}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl shadow hover:bg-gray-600 transition"
        >
          <Cross2Icon className="w-4 h-4" /> Clear
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-gray-700 uppercase text-xs">
              <th className="border px-3 py-2 text-left">#</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Full Name</th>
              <th className="border px-3 py-2 text-left">Phone</th>
              <th className="border px-3 py-2 text-center">Status</th>
              {role === "admin" && <th className="border px-3 py-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 6 : 5}
                  className="text-center p-4 text-gray-500"
                >
                  No members found
                </td>
              </tr>
            ) : (
              members.map((m, idx) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="border px-3 py-2">{(page - 1) * limit + idx + 1}</td>
                  <td className="border px-3 py-2">{m.email}</td>
                  <td className="border px-3 py-2">{m.fullName || "-"}</td>
                  <td className="border px-3 py-2">{m.phoneNumber || "-"}</td>
                  <td className="border px-3 py-2 text-center">{renderStatusBadge(m.isActive)}</td>
                  {role === "admin" && (
                    <td className="border px-3 py-2 flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleView(m.id)}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        title="View Member"
                      >
                        <EyeOpenIcon />
                      </button>
                      <button
                        onClick={() => handleToggleLock(m.id, m.isActive)}
                        className={`p-2 rounded-full transition ${
                          m.isActive
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                        title={m.isActive ? "Lock Member" : "Unlock Member"}
                        disabled={loading}
                      >
                        {m.isActive ? <LockClosedIcon /> : <LockOpen1Icon />}
                      </button>
                      <button
                        onClick={() => handleResetPassword(m.id)}
                        className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
                        title="Reset Password"
                        disabled={loading}
                      >
                        <ReloadIcon />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages} (Total: {total} members)
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      {msg && <div className="mt-2 text-red-500">{msg}</div>}
    </div>
  );
}

export default MemberTable;
