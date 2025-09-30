function MemberTable({ registrations, isOngoing, onToggle }) {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0 z-10">
          <tr>
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2 text-center">Join</th>
          </tr>
        </thead>
        <tbody>
          {registrations.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500 italic border">
                No members found
              </td>
            </tr>
          ) : (
            registrations.map((reg, idx) => (
              <tr
                key={reg.id}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">{reg.user?.fullName || "Unknown"}</td>
                <td className="border px-3 py-2">{reg.user?.email || "-"}</td>
                <td className="border px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={reg.attended}
                    disabled={!isOngoing}
                    onChange={() => onToggle(reg.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                    aria-label={`Mark ${reg.user?.fullName} as attended`}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


export default MemberTable;
