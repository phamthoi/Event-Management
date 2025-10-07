// src/components/attendance/MemberTable.tsx
import React from "react";
import { Registration } from "../../types";

interface MemberTableProps {
  registrations: Registration[];
  onToggle: (regId: number, type: "depositPaid" | "attended") => void;
  currentEventStatus: string;
}

const MemberTable: React.FC<MemberTableProps> = ({
  registrations,
  onToggle,
  currentEventStatus,
}) => {
  if (registrations.length === 0)
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded">Không có thành viên nào</div>
    );

  return (
    <div className="overflow-x-auto border rounded shadow p-2">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Tên</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Đặt cọc</th>
            <th className="border px-2 py-1">Điểm danh</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg, idx) => (
            <tr key={reg.id}>
              <td className="border px-2 py-1 text-center">{idx + 1}</td>
              <td className="border px-2 py-1">{reg.user.fullName}</td>
              <td className="border px-2 py-1">{reg.user.email}</td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={reg.depositPaid}
                  onChange={() => onToggle(reg.id, "depositPaid")}
                />
              </td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={reg.attended}
                  disabled={!reg.depositPaid || currentEventStatus !== "ONGOING"}
                  onChange={() => onToggle(reg.id, "attended")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
