import { Outlet } from "react-router-dom";
import Sidebar from "./SidebarMember";

const DashboardLayoutMember = ({children}) => {
    return(
        <div className="flex min-h-screen">
            <Sidebar/>
            <main className="flex-1 bg-gray-100 p-6">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default DashboardLayoutMember;