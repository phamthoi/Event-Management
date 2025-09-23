// components/admin/Notification/NotificationForm.jsx
import React, { useState, useEffect } from "react";
import { sendNotification, fetchUsers } from "../../../services/notification.service.js";

const NotificationForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GENERAL");
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const members = await fetchUsers(); // fetchUsers đã trả về mảng members
        setUsers(members);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) return alert("Vui lòng nhập tiêu đề và nội dung");

    setLoading(true);
    try {
      const result = await sendNotification({
        title,
        message,
        type,
        recipientId: recipientId || null,
      });
      alert(`Thông báo đã gửi thành công (${result.count || 0} user)`);

      // reset form
      setTitle("");
      setMessage("");
      setType("GENERAL");
      setRecipientId("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 500,
        margin: "auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Tạo Notification (Admin)</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Tiêu đề:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: 6 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Nội dung:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{ width: "100%", padding: 6 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Loại:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", padding: 6 }}
        >
          <option value="GENERAL">GENERAL</option>
          <option value="EVENT">EVENT</option>
          <option value="SYSTEM">SYSTEM</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Người nhận:</label>
        <select
          value={recipientId}
          onChange={(e) =>
            setRecipientId(e.target.value ? parseInt(e.target.value) : "")
          }
          style={{ width: "100%", padding: 6 }}
        >
          <option value="">Tất cả user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName || u.email}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
        {loading ? "Đang gửi..." : "Gửi thông báo"}
      </button>
    </form>
  );
};

export default NotificationForm;
