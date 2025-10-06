// client/src/providers/profileDataProvider.ts
import api from "../services/axios";
import { DataProvider } from "react-admin";

/**
 * DataProvider riêng cho Profile (current user).
 * Backend: /common/profile, /common/profile/password
 */
const profileDataProvider: DataProvider = {
  // Không dùng getList cho profile (chỉ có 1 user hiện tại)
  getList: async () => {
    throw new Error("getList not implemented in profileDataProvider");
  },

  // GET /common/profile
  getOne: async (resource, params) => {
    if (resource === "admin" && params.id === "profile") {
      const { data } = await api.get(`/profile`);
      return {
        data: {
          ...data,
          id: "profile", // ép id thành "profile" để match với params.id
        },
      };
    }
    throw new Error(`getOne not implemented for resource ${resource}`);
  },

  // UPDATE /common/profile
  update: async (resource, params) => {
    if (resource === "admin" && params.id === "profile") {
      const { data } = await api.put(`/profile`, params.data);
      return {
        data: {
          ...data,
          id: "profile",
        },
      };
    }
    throw new Error(`update not implemented for resource ${resource}`);
  },

  // Đổi mật khẩu /common/profile/password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put(`/profile/password`, {
      currentPassword,
      newPassword,
    });
    return data;
  },

  // Các method còn lại (không dùng cho profile)
  create: async () => {
    throw new Error("create not implemented in profileDataProvider");
  },
  delete: async () => {
    throw new Error("delete not implemented in profileDataProvider");
  },
  getMany: async () => {
    throw new Error("getMany not implemented in profileDataProvider");
  },
  getManyReference: async () => {
    throw new Error("getManyReference not implemented in profileDataProvider");
  },
  updateMany: async () => {
    throw new Error("updateMany not implemented in profileDataProvider");
  },
  deleteMany: async () => {
    throw new Error("deleteMany not implemented in profileDataProvider");
  },
};

export default profileDataProvider;
