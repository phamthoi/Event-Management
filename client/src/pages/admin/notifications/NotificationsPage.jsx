// pages/admin/NotificationsPage.jsx
import React from "react";
import NotificationForm from "../../../components/admin/Notification/NotificationForm";
import NotificationList from "../../../components/admin/Notification/NotificationList";

const NotificationsPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <NotificationForm />
      <hr style={{ margin: "20px 0" }} />
      <NotificationList />
    </div>
  );
};

export default NotificationsPage;
