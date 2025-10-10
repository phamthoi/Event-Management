// src/components/attendance/AttendanceToolbar.tsx
import * as React from "react";
import { Button, Stack } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import { Registration } from "../../types";

interface AttendanceToolbarProps {
  eventId: number | null;
  registrations: Registration[];
  setRegistrations: React.Dispatch<React.SetStateAction<Registration[]>>;
  refresh: () => void;
}

const AttendanceToolbar: React.FC<AttendanceToolbarProps> = ({
  eventId,
  registrations,
  setRegistrations,
  refresh,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const markAllAsPresent = async () => {
    if (!eventId) return notify("Vui lòng chọn sự kiện trước", { type: "warning" });

    try {
      await Promise.all(
        registrations.map((r) =>
          dataProvider.update("events", {
            id: r.id,
            data: { attended: true },
            previousData: r,
          })
        )
      );
      setRegistrations((prev) => prev.map((r) => ({ ...r, attended: true })));
      notify("✅ Đã điểm danh tất cả!", { type: "success" });
    } catch (error) {
      console.error(error);
      notify("❌ Lỗi khi cập nhật điểm danh", { type: "error" });
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={markAllAsPresent}
        disabled={!eventId}
      >
        Điểm danh tất cả
      </Button> */}
      <Button variant="outlined" onClick={refresh} disabled={!eventId}>
        Làm mới danh sách
      </Button>
    </Stack>
  );
};

export default AttendanceToolbar;
