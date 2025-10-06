// src/providers/memberDataProvider.ts
import api from "../services/axios";
import {
  DataProvider,
  GetListParams,
  GetOneParams,
  UpdateParams,
  CreateParams,
  DeleteParams,
} from "react-admin";

const memberDataProvider: DataProvider = {
  // Lấy danh sách
  getList: async (resource, params: GetListParams) => {
    //const { page, perPage } = params.pagination;
    //const { field, order } = params.sort;
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;

    const query: Record<string, any> = {
      page,
      limit: perPage,
      ...params.filter,
    };
    
    const queryString = new URLSearchParams(query as any).toString();
    const res = await api.get(`/admin/members/list?${queryString}`);
    const data = res.data.events.map((ev: any) => ({ ...ev, id: ev.id.toString() }));
    const total = res.data.total || data.length;
    return { data, total };
  },

  // Lấy 1 member
  getOne: async (resource, params: GetOneParams) => {
    const res = await api.get(`/admin/members/${params.id}`);
    return { data: { id: res.data.id, ...res.data } };
  },

  // Tạo member
  create: async (resource, params: CreateParams) => {
    const res = await api.post(`/admin/members/create`, params.data);
    return { data: { id: res.data.id, ...res.data } };
  },

  // Update member
  update: async (resource, params: UpdateParams) => {
    const res = await api.put(`/admin/members/${params.id}`, params.data);
    return { data: { id: res.data.id, ...res.data } };
  },

  // Delete member
  delete: async (resource, params: DeleteParams) => {
    const res = await api.delete(`/admin/members/${params.id}`);
    return { data: { id: res.data.id, ...res.data } };
  },

  // Optional
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] }),
  deleteMany: async () => ({ data: [] }),
};

export default memberDataProvider;
