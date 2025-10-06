// client/src/authProvider.ts
import api from "../services/axios";

const authProvider = {
  login: async ({ username, password }: any) => {
    try {
      const res = await api.post("/auth/login", {
        email: username,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error.response?.data?.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    return Promise.resolve();
  },

  checkError: (error: any) => {
    const status = error.status || error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem("token")
      ? Promise.resolve()
      : Promise.reject();
  },

  getPermissions: () => {
    // có thể trả về role ở đây nếu cần
    const role = localStorage.getItem("role");
    return Promise.resolve(role);
  },
  getIdentity: async () => {
    // trả về thông tin user đầy đủ cho useGetIdentity
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    return Promise.resolve({
      id: user.id,
      fullName: user.fullName,
      role: user.role,   // **quan trọng**
      avatar: user.avatarUrl,
    });
  },
};

export default authProvider;
