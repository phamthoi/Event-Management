// components/admin/Notification/NotificationList.jsx
import React, { useState, useEffect } from "react";
import { getNotifications, markAsRead } from "../../../services/notification.service.js";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getNotifications({ page: pageNumber, limit });
      setNotifications(res.data || []);
      setPage(res.pagination?.page || 1);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      alert(err.response?.data?.message || "Lỗi khi tải notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(page);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      // cập nhật state local
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi đánh dấu đã đọc");
    }
  };

  const handlePrev = () => {
    if (page > 1) loadNotifications(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) loadNotifications(page + 1);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>Danh sách Notification</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          {notifications.length === 0 ? (
            <p>Chưa có thông báo nào</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>Tiêu đề</th>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>Nội dung</th>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>Loại</th>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>Ngày tạo</th>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>Trạng thái</th>
                  <th style={{ border: "1px solid #ccc", padding: 8 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n.id}>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>{n.title}</td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>{n.message}</td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>{n.type}</td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {n.isRead ? "Đã đọc" : "Chưa đọc"}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {!n.isRead && (
                        <button onClick={() => handleMarkAsRead(n.id)}>Đánh dấu đã đọc</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 10 }}>
            <button onClick={handlePrev} disabled={page <= 1} style={{ marginRight: 10 }}>
              Prev
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button onClick={handleNext} disabled={page >= totalPages} style={{ marginLeft: 10 }}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationList;
