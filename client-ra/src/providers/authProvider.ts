// src/providers/authProvider.ts
import api from "../services/axios";

const authProvider = {
  login: async ({ username, password }: any) => {
    try {
      const res = await api.post("/auth/login", {
        email: username,
        password,
      });

      const { token, user } = res.data;

      // Lưu token, user, role chuẩn hóa lowercase
      localStorage.setItem("token", token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...user, role: (user.role || "").toLowerCase() })
      );
      localStorage.setItem("role", (user.role || "").toLowerCase());

      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error.response?.data?.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    return Promise.resolve();
  },

  checkError: (error: any) => {
    const status = error.status || error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("role");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () =>
    localStorage.getItem("token") ? Promise.resolve() : Promise.reject(),

  // <-- Sửa chính: không bao giờ reject, trả fallback "member"
  getPermissions: async () => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        const role = (user.role || localStorage.getItem("role") || "").toLowerCase();
        if (role === "admin" || role === "member") return Promise.resolve(role);
      }

      const roleLS = (localStorage.getItem("role") || "").toLowerCase();
      if (roleLS === "admin" || roleLS === "member") return Promise.resolve(roleLS);

      // Fallback an toàn: trả "member" thay vì reject
      return Promise.resolve("member");
    } catch (e) {
      return Promise.resolve("member");
    }
  },

  getIdentity: async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      return Promise.resolve({
        id: user.id ?? null,
        fullName: user.fullName ?? user.name ?? "",
        role: user.role ?? localStorage.getItem("role") ?? "member",
        avatar: user.avatarUrl ?? user.avatar ?? null,
      });
    } catch {
      return Promise.resolve({
        id: null,
        fullName: "",
        role: "member",
        avatar: null,
      });
    }
  },
};

export default authProvider;
