function MemberTable({ registrations, isOngoing, onToggle }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-3 py-2">#</th>
          <th className="border px-3 py-2">Name</th>
          <th className="border px-3 py-2">Email</th>
          <th className="border px-3 py-2">Join</th>
        </tr>
      </thead>
      <tbody>
        {registrations.length === 0 ? (
          <tr>
            <td
              colSpan="4"
              className="text-center p-3 text-gray-500 border"
            >
              No members found
            </td>
          </tr>
        ) : (
          registrations.map((reg, idx) => (
            <tr key={reg.id}>
              <td className="border px-3 py-2">{idx + 1}</td>
              <td className="border px-3 py-2">{reg.user?.fullName || "-"}</td>
              <td className="border px-3 py-2">{reg.user?.email}</td>
              <td className="border px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={reg.attended}
                  disabled={!isOngoing}
                  onChange={() => onToggle(reg.id)}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default MemberTable;
