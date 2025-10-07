// src/providers/attendanceDataProvider.ts
import {
  DataProvider,
  GetListParams,
  UpdateManyParams,
  GetManyReferenceParams,
  CreateParams,
  DeleteParams,
  UpdateParams,
  RaRecord,
  UpdateResult
} from "react-admin";
import api from "../services/axios";

export interface Registration {
  id: number;
  user: { fullName: string; email: string };
  depositPaid: boolean;
  attended: boolean;
}

const attendanceDataProvider: DataProvider = {
  // 🟢 1. Lấy danh sách sự kiện hoặc danh sách đăng ký
  getList: async (resource: string, params: GetListParams) => {
    switch (resource) {
      case "attendance-events": {
        const res = await api.get("/admin/events/ongoing");
        const events = res.data?.events || res.data || [];
        return {
          data: events.map((e: any) => ({ id: e.id, ...e })),
          total: events.length,
        };
      }

      case "registrations": {
        const eventId = params.filter?.eventId;
        if (!eventId) return { data: [], total: 0 };

        const res = await api.get(`/admin/events/registrations/${eventId}`);
        const registrations = (res.data?.registrations || res.data || []).map(
          (reg: any) => ({
            id: reg.id,
            user: reg.user,
            depositPaid: reg.depositPaid ?? false,
            attended: reg.attended ?? false,
          })
        );

        return { data: registrations, total: registrations.length };
      }

      default:
        throw new Error(`getList not implemented for resource: ${resource}`);
    }
  },

  // 🟢 2. Cập nhật TỪNG trạng thái điểm danh hoặc cọc tiền (cho handleToggle)
   update: async <RecordType extends RaRecord = any>( 
     resource: string, 
     params: UpdateParams<RecordType>  
   ): Promise<UpdateResult<RecordType>> => {  
     if (resource === "registrations") { 
         const { id, data } = params;

         // 💡 SỬA ĐỔI: Sử dụng registrationId: id 
         const updates = [{ registrationId: id, ...data }];  
    
         // Gửi JSON chính xác: { "updates": [{"registrationId":..., "attended":..., "depositPaid":...}] } 
         await api.put("/admin/events/registrations/update-status", { updates: updates });

         // Trả về dữ liệu đã được cập nhật cho React-Admin  
         const updatedRecord = { ...params.previousData, ...data, id: id };  
         return { data: updatedRecord as RecordType }; 
     }

     throw new Error(`update not implemented for resource: ${resource}`);  
   },



  // 🟢 2. Lấy danh sách đăng ký theo member (React-Admin gọi khi dùng ReferenceField)
  getManyReference: async (resource: string, params: GetManyReferenceParams) => {
    if (resource === "registrations" && params.target === "memberId") {
      const memberId = params.id;
      const res = await api.get(`/admin/member/registrations/${memberId}`);
      const registrations = res.data?.registrations || res.data || [];
      return {
        data: registrations.map((r: any) => ({ id: r.id, ...r })),
        total: registrations.length,
      };
    }

    throw new Error(`getManyReference not implemented for resource: ${resource}`);
  },

  // 🟢 3. Thành viên đăng ký sự kiện
  create: async (resource: string, params: CreateParams) => {
    if (resource === "registrations") {
      const { memberId, eventId } = params.data;
      const res = await api.post(`/admin/member/registrations/${memberId}/${eventId}`);
      return { data: { id: res.data.id, ...res.data } };
    }

    throw new Error(`create not implemented for resource: ${resource}`);
  },

  // 🟢 4. Hủy đăng ký sự kiện
  delete: async (resource: string, params: DeleteParams) => {
    if (resource === "registrations") {
      const { memberId, eventId } = params.previousData;
      const res = await api.delete(`/admin/member/registrations/${memberId}/${eventId}`);
      return { data: { id: eventId, ...res.data } };
    }

    throw new Error(`delete not implemented for resource: ${resource}`);
  },

  // 🟢 5. Cập nhật hàng loạt trạng thái điểm danh hoặc cọc tiền
  updateMany: async (resource: string, params: UpdateManyParams) => { 
     if (resource === "registrations") { 
         // 💡 SỬA ĐỔI: Ánh xạ id (từ params.ids) sang registrationId  
         const updates = params.ids.map(id => ({ registrationId: id, ...params.data }));
    
         // Gửi JSON chính xác: { "updates": [{"registrationId":..., ...}, ...] }  
         await api.put("/admin/events/registrations/update-status", { updates: updates }); 
    
         return { data: params.ids };  
     }
  
     throw new Error(`updateMany not implemented for resource: ${resource}`);  
   },

  // 🔴 6. Các hàm chưa cần dùng
  getOne: async () => Promise.reject("getOne not implemented"),
  getMany: async () => Promise.reject("getMany not implemented"),
  deleteMany: async () => Promise.reject("deleteMany not implemented"),
};

export default attendanceDataProvider;
