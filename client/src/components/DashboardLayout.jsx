import Sidebar from "./Sidebar";

function DashboardLayout({ children}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main content area */}
            <div className="flex-1 bg-white shadow-lg p-6 m-4">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;