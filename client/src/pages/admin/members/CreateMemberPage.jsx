import React from "react";
import CreateMemberForm from "../../../components/admin/Create/CreateMemberForm";

/*
function CreateMemberPage() {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Member</h2>
        
        <CreateMemberForm />

        <div className="mt-4 text-center">
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}*/
const CreateMemberPage = () => {
    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <CreateMemberForm/>
        </div>
    )
}
 
export default CreateMemberPage;
