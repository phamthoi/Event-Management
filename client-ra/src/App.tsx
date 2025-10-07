// src/App.tsx
import * as React from "react";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";

import authProvider from "./providers/authProvider";
import dataProvider from "./providers/dataProvider";

import CustomLayout from "./components/CustomLayout/CustomLayout";
import AppDashboard from "./pages/AppDashboard";
import MemberStatsDashboard from "./pages/MemberStatsDashboard";

// Profile
import { ProfileView, ProfileEdit } from "./components/Profile";

// Events
import { EventList, EventEdit, EventCreate } from "./components/events";

// Members
import {
  MemberList,
  MemberEdit,
  MemberCreate,
  MemberShow,
  ResetPassword,
  ViewMemberList,
} from "./components/members";

// Registrations / Attendance
import { UpcomingEventList, MyEventsList } from "./components/registration";
import AttendancePage from "./components/attendance/AttendancePage";

const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    dashboard={AppDashboard}
    layout={CustomLayout}
  >
    {/* ✅ Các route tùy chỉnh ngoài CRUD */}
    <CustomRoutes>
      <Route path="/profile" element={<ProfileView />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />
      <Route path="/admin/members/:id/reset-password" element={<ResetPassword />} />
      <Route path="/member-stats" element={<MemberStatsDashboard />} />
    </CustomRoutes>

    {/* ✅ Resource cho quản trị viên */}
    <Resource
      name="events"
      list={EventList}
      edit={EventEdit}
      create={EventCreate}
    />

    <Resource
      name="members"
      list={MemberList}
      edit={MemberEdit}
      create={MemberCreate}
      show={MemberShow}
    />

    {/* ✅ Resource chung cho thành viên */}
    <Resource name="upcoming-events" list={UpcomingEventList} />
    <Resource name="member-events" list={MyEventsList} />

    {/* ✅ Resource ảo cho thống kê */}
    <Resource name="memberStats" />

    {/* ✅ Public member view (danh sách công khai) */}
    <Resource
      name="membersPublic"
      list={ViewMemberList}
    />

    {/* ✅ Resource Attendance — liên kết với attendanceDataProvider */}
    <Resource
      name="registrations"
      list={AttendancePage}
    />
  </Admin>
);

export default App;
