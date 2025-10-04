// client/src/dataProvider.ts
import api from "../services/axios";
import { DataProvider } from "react-admin";

const profileDataProvider: DataProvider = {
  // GET /resource
  getList: async (resource, params) => {
    const { data } = await api.get(`/${resource}`);
    return { data, total: data.length }; // cần backend trả total chuẩn nếu có pagination
  },

  // GET /resource/:id
  getOne: async (resource, params) => {
    if (resource === "admin" && params.id === "profile") {
      const { data } = await api.get(`/admin/profile`);
      return { data: {
        ...data,
        id: "profile", //ép id thành "profile" để match với params.id
      },
     };
    }
    const { data } = await api.get(`/${resource}/${params.id}`);
    return { data };
  },

  // UPDATE /resource/:id
  update: async (resource, params) => {
    if (resource === "admin" && params.id === "profile") {
      const { data } = await api.put(`/admin/profile`, params.data);
      return { data };
    }
    const { data } = await api.put(`/${resource}/${params.id}`, params.data);
    return { data };
  },

  // CREATE /resource
  create: async (resource, params) => {
    const { data } = await api.post(`/${resource}`, params.data);
    return { data };
  },

  // DELETE /resource/:id
  delete: async (resource, params) => {
  const { id, previousData } = params;

  await api.delete(`/${resource}/${id}`);

  // Nếu backend không trả về record đã xoá, thì trả về previousData (bắt buộc RA phải có data)
  return { data: previousData! };
  },

  // (optionally) deleteMany, updateMany, getMany, getManyReference...
  getMany: async (resource, params) => {
    const { data } = await api.get(`/${resource}`, {
      params: { ids: params.ids },
    });
    return { data };
  },

  getManyReference: async (resource, params) => {
    const { data } = await api.get(`/${resource}`, {
      params: { [params.target]: params.id },
    });
    return { data, total: data.length };
  },

  updateMany: async (resource, params) => {
    const { data } = await api.put(`/${resource}`, params.data);
    return { data };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => api.delete(`/${resource}/${id}`)));
    return { data: params.ids };
  },
};

export default profileDataProvider;
