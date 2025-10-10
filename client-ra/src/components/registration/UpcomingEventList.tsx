// src/admin/events/UpcomingEventsList.tsx
import React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    FunctionField,
    useDataProvider, // Giữ lại cho useDataProvider.delete
    useNotify,
    useRefresh,
    // Bỏ BooleanField
} from "react-admin";
import { Button } from "@mui/material";

// 🔥 FIX: Import Axios instance trực tiếp
import api from "../../services/axios"; 

const statusColors: Record<string, string> = {
    UPCOMING: "bg-blue-100 text-blue-800",
    ONGOING: "bg-green-100 text-green-800",
    COMPLETED: "bg-gray-200 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
};

const RegisterButton = ({ record }: { record: any }) => {
    // Giữ lại dataProvider cho thao tác delete, vì logic delete đã được tùy chỉnh
    const dataProvider = useDataProvider(); 
    const notify = useNotify();
    const refresh = useRefresh();

    const handleClick = async () => {
       try {
          // 🔥 BẮT ĐẦU SỬA LỖI: Lấy ID, dùng record._id nếu record.id không có (phổ biến với MongoDB)
          const eventId = record.id || record._id; 
          
          if (!eventId) {
             notify("Error: Event ID is missing from the record.", { type: "error" });
             return; // Dừng nếu ID không hợp lệ
          }
          // 🔥 KẾT THÚC SỬA LỖI

          if (!record.registered) {
             // Sử dụng eventId đã được kiểm tra
             await api.post(`/event/${eventId}/register`, {});
             notify("Registered successfully", { type: "success" });
          } else {
             // Truyền eventId đã được kiểm tra vào dataProvider.delete
             await dataProvider.delete("event", { id: eventId });
             notify("Registration cancelled", { type: "success" });
          }
          refresh();
       } catch (err: any) {
          // Cố gắng hiển thị thông báo lỗi chi tiết hơn từ server
          notify(err.response?.data?.message || err.message || "Error", { type: "error" });
       }
    };

    return (
       <Button
          variant="contained"
          color={record.registered ? "error" : "primary"}
          onClick={handleClick}
          disabled={record.status === "CANCELLED"}
       >
          {record.registered ? "❌ Cancel" : "🚀 Register"}
       </Button>
    );
};

const UpcomingEventsList = () => {
    return (
       <List
          resource="upcoming-events"
          perPage={4}
          sort={{ field: "startAt", order: "ASC" }}
       >
          <Datagrid rowClick="show">
             <TextField source="title" label="Event Title" />
             <TextField source="location" label="Location" />
             <DateField source="startAt" label="Start Time" showTime />
             <DateField source="endAt" label="End Time" showTime />
             <FunctionField
                 label="Status"
                 render={(record: any) => (
                   <span
                       className={`px-2 py-1 rounded-full text-xs font-semibold ${
                         statusColors[record.status] || "bg-gray-100 text-gray-800"
                       }`}
                   >
                       {record.status}
                   </span>
                 )}
             />
             <FunctionField
                 label="Slots"
                 render={(record: any) =>
                   `${record.registeredCount || 0} / ${record.maxAttendees} ${
                       record.maxAttendees - (record.registeredCount || 0) > 0
                         ? `(${record.maxAttendees - (record.registeredCount || 0)} left)`
                         : "(Full)"
                   }`
                 }
             />
             <FunctionField
                 label="Action"
                 render={(record: any) => <RegisterButton record={record} />}
             />
          </Datagrid>
       </List>
    );
};

export default UpcomingEventsList;