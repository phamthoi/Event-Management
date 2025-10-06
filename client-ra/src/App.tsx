import * as React from "react";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";

import authProvider from "./providers/authProvider";
import dataProvider from "./providers/dataProvider";
import Dashboard from "./pages/Dashboard";
import CustomLayout from "./components/CustomLayout/CustomLayout";

import { ProfileView, ProfileEdit } from "./components/Profile"; 
import { EventList, EventEdit, EventCreate } from "./components/events";

const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    dashboard={Dashboard}
    layout={CustomLayout}
  >
    <CustomRoutes>
      <Route path="/profile" element={<ProfileView />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />

    </CustomRoutes>

    {/* Nếu sau này có entity chuẩn CRUD thì mới khai báo Resource */}
    <Resource 
      name="events" 
      list={EventList}
      edit={EventEdit}
      create={EventCreate}
    />

  </Admin>
);

export default App;
