// client/src/providers/profileDataProvider.ts
import api from "../services/axios";
import { DataProvider, GetOneParams, UpdateParams, CreateParams, DeleteParams, RaRecord } from "react-admin";

/**
 * DataProvider riêng cho Profile (current user)
 * Backend: /common/profile, /common/profile/password
 * Lưu ý: Chỉ có 1 profile hiện tại, không dùng getList
 */
const profileDataProvider: DataProvider = {
  // Không dùng getList cho profile
  getList: async () => {
    throw new Error("getList not implemented in profileDataProvider");
  },

  // Lấy profile hiện tại
  getOne: async (resource, params: GetOneParams) => {
    if (resource === "admin" && params.id === "profile") {
      const { data } = await api.get("/profile");
      return {
        data: { ...data, id: "profile" }, // Ép id thành "profile"
      };
    }
    throw new Error(`getOne not implemented for resource ${resource}`);
  },

  // Cập nhật profile hiện tại
  update: async (resource, params: UpdateParams) => {
    if (resource === "admin" && params.id === "profile") {
      const { data } = await api.put("/profile", params.data);
      return {
        data: { ...data, id: "profile" },
      };
    }
    throw new Error(`update not implemented for resource ${resource}`);
  },

  // Tạo profile (không sử dụng)
  create: async () => {
    throw new Error("create not implemented in profileDataProvider");
  },

  // Xóa profile (không sử dụng)
  delete: async <RecordType extends RaRecord = any>() => {
    throw new Error("delete not implemented in profileDataProvider");
  },

  // Không dùng các phương thức nhiều bản ghi
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

  // Phương thức đặc biệt: đổi mật khẩu
  // Không phải chuẩn react-admin, dùng trực tiếp từ service
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put("/profile/password", { currentPassword, newPassword });
    return data;
  },
};

export default profileDataProvider;
