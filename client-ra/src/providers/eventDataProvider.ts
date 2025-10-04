// src/providers/eventDataProvider.ts
import api from "../services/axios";
import { DeleteResult, RaRecord, DataProvider, GetListParams, GetOneParams, UpdateParams, CreateParams, DeleteParams } from "react-admin";

const eventDataProvider: DataProvider = {
  // Lấy danh sách events (list + filter + pagination)
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
    return { data: { ...res.data, id: params.id } };
  },

  // Tạo event mới
  create: async (resource, params: CreateParams) => {
    const res = await api.post("/admin/events/create", params.data);
    return { data: { ...res.data, id: res.data.id.toString() } };
  },

  // Cập nhật event
  update: async (resource, params: UpdateParams) => {
    const res = await api.put(`/admin/events/edit/${params.id}`, params.data);
    return { data: { ...res.data, id: params.id.toString() } };
  },

  // Xoá event
  delete: async <RecordType extends RaRecord = any>(
  resource: string,
  params: DeleteParams<RecordType>
): Promise<DeleteResult<RecordType>> => {
  await api.delete(`/admin/events/delete/${params.id}`);
  
  return { data: { ...params.previousData } as RecordType };
  },


  
  // Optional: cho bulk actions (deleteMany)
  deleteMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => api.delete(`/admin/events/delete/${id}`)));
    return { data: params.ids };
  },
};

export default eventDataProvider;
