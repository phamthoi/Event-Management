// client/src/services/memberService.js
import api from "../axios"; 

export const CreateMember = async (memberData) => {
    const res = await api.post("admin/members/create", memberData);
    return res.data;
};
