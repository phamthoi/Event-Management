// src/providers/eventDataProvider.ts
import api from "../services/axios";
import { DeleteResult, RaRecord, DataProvider, GetListParams, GetOneParams, UpdateParams, CreateParams, DeleteParams } from "react-admin";

// Giả sử bạn lưu thông tin user trong localStorage
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const eventDataProvider: DataProvider = {
  // Lấy danh sách events
  getList: async (resource, params: GetListParams) => {
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;

    const query: Record<string, any> = {
      page,
      limit: perPage,
      ...params.filter,
    };

    const queryString = new URLSearchParams(query as any).toString();
    const res = await api.get(`/admin/events/list?${queryString}`);
    const data = res.data.events.map((ev: any) => ({ ...ev, id: ev.id.toString() }));
    const total = res.data.total || data.length;

    return { data, total };
  },

  // Lấy chi tiết event theo ID
  getOne: async (resource, params: GetOneParams) => {
    const res = await api.get(`/admin/events/detail/${params.id}`);
    return { data: { ...res.data.event, id: params.id } };
  },

  // Tạo event mới
  create: async (resource, params: CreateParams) => {
    if (!params.data) throw new Error("Missing data in create");
    const res = await api.post("/admin/events/create", params.data);
    const eventData = res.data.event;
    if (!eventData?.id) throw new Error("Backend response is missing 'id'");
    return { data: { ...eventData, id: eventData.id.toString() } };
  },

  // Cập nhật event
  update: async (resource, params: UpdateParams) => {
    const res = await api.put(`/admin/events/edit/${params.id}`, params.data);
    return { data: { ...res.data.event, id: params.id.toString() } };
  },

  // Xoá event với check admin
  delete: async <RecordType extends RaRecord>(
  resource: string,
  params: DeleteParams<RecordType>
) => {
  if (resource === "events") {
    try {
      const res = await api.delete(`/admin/events/delete/${params.id}`);
      return { data: res.data };
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
  return { data: params.previousData };
},

  // Bulk delete
  deleteMany: async (resource, params) => {
    const user = getUser();
    if (!user || user.role !== "ADMIN") {
      throw new Error("Only admin can delete events");
    }

    try {
      await Promise.all(
        params.ids.map((id) =>
          api.delete(`/admin/events/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      return { data: params.ids };
    } catch (error: any) {
      console.error("Bulk delete failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Bulk delete failed");
    }
  },

   // Optional
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] }),
};

export default eventDataProvider;
