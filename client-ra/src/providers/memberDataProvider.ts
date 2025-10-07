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
  // Get list cho các resource khác nhau
  getList: async (resource: string, params: GetListParams) => {
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;

    const query: Record<string, any> = {
      page,
      limit: perPage,
      ...params.filter,
    };

    const queryString = new URLSearchParams(query as any).toString();

    let res;

    if (resource === "members") {
      // Admin members
      res = await api.get(`/admin/members/list?${queryString}`);
    } else if (resource === "membersPublic") {
      // Public members service
      const { email = "", fullName = "" } = params.filter || {};
      const serviceQuery = new URLSearchParams({
        page: page.toString(),
        limit: perPage.toString(),
        ...(email && { email }),
        ...(fullName && { fullName }),
      }).toString();
      res = await api.get(`/member/members?${serviceQuery}`);
    } else {
      return { data: [], total: 0 };
    }

    const data = (res.data.members || []).map((m: any) => ({ ...m, id: String(m.id) }));
    const total = res.data.total || data.length;

    return { data, total };
  },

  // Get 1 member
  getOne: async (resource: string, params: GetOneParams) => {
    if (resource === "members") {
      const res = await api.get(`/admin/members/${params.id}`);
      const member = res.data.member || res.data;
      return { data: { id: String(member.id), ...member } };
    }

    if (resource === "membersPublic") {
      const res = await api.get(`/member/members/${params.id}`);
      const member = res.data.member || res.data;
      return { data: { id: String(member.id), ...member } };
    }

    return { data: {} };
  },

  // Create member
  create: async (resource: string, params: CreateParams) => {
    if (resource === "members") {
      const res = await api.post(`/admin/members/create`, params.data);
      return { data: { id: String(res.data.id), ...res.data } };
    }
    return { data: {} };
  },

  // Update member
  update: async (resource: string, params: UpdateParams) => {
    if (resource === "members") {
      const res = await api.put(`/admin/members/${params.id}`, params.data);
      return { data: { id: String(res.data.id), ...res.data } };
    }
    return { data: {} };
  },

  // Delete member
  delete: async (resource: string, params: DeleteParams) => {
    if (resource === "members") {
      const res = await api.delete(`/admin/members/${params.id}`);
      return { data: { id: String(res.data.id), ...res.data } };
    }
    return { data: {} };
  },

  // Optional methods
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] }),
  deleteMany: async () => ({ data: [] }),
};

export default memberDataProvider;
