//client/src/pages/member/ViewMemberListPage.jsx
import React from "react";
import ViewMemberList from "../../../components/member/memberList/viewMemberList";
// import { getMembers } from "../../../services/member/member/memberService";

//===========Fake API=========== 
// const fakeMembers = [
//   {
//     id: 1,
//     fullName: "Nguyen Van A",
//     email: "member1@test.com",
//     phoneNumber: "0123456789",
//     role: "MEMBER",
//     organizationId: 123,
//     joinDate: "2024-01-15T00:00:00Z"
//   },
//   {
//     id: 2,
//     fullName: "Tran Thi B",
//     email: "member2@test.com",
//     phoneNumber: "0987654321",
//     role: "MEMBER",
//     organizationId: 123,
//     joinDate: "2024-02-01T00:00:00Z"
//   },
//   {
//     id: 3,
//     fullName: "Le Van C",
//     email: "member3@test.com",
//     phoneNumber: "0555666777",
//     role: "MEMBER",
//     organizationId: 123,
//     joinDate: "2024-02-10T00:00:00Z"
//   },
//   {
//     id: 4,
//     fullName: "Pham Thi D",
//     email: "member4@test.com",
//     phoneNumber: "0111222333",
//     role: "MEMBER",
//     organizationId: 123,
//     joinDate: "2024-02-20T00:00:00Z"
//   }
// ];

// const getMembers = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return fakeMembers;
// };
//==========end fake API==========

function ViewMemberListPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Danh sách Member</h1>
      <ViewMemberList />
    </div>
  );
}

export default ViewMemberListPage;