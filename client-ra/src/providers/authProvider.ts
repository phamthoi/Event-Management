// src/providers/authProvider.ts
import api from "../services/axios";

// 3 phút không hoạt động = 180000 ms
const TOKEN_EXPIRY_MS = 3 * 60 * 1000; 

const authProvider = {
  /**
   * Xử lý quá trình đăng nhập.
   * Lưu token, user, role và thời điểm hết hạn (expiryTime) vào localStorage.
   */
  login: async ({ username, password }: any) => {
    try {
      const res = await api.post("/auth/login", {
        email: username,
        password,
      });

      const { token, user } = res.data;

      // Tính toán thời điểm hết hạn mới dựa trên TOKEN_EXPIRY_MS
      const expiryTime = Date.now() + TOKEN_EXPIRY_MS;

      // Lưu tất cả dữ liệu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...user, role: (user.role || "").toLowerCase() })
      );
      localStorage.setItem("role", (user.role || "").toLowerCase());
      localStorage.setItem("expiryTime", expiryTime.toString()); // <-- Mới: Lưu thời điểm hết hạn

      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error.response?.data?.message || "Login failed");
    }
  },

  /**
   * Xử lý quá trình đăng xuất.
   * Xóa tất cả các khóa liên quan khỏi localStorage.
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    localStorage.removeItem("expiryTime"); // <-- Mới: Xóa thời điểm hết hạn
    return Promise.resolve();
  },

  /**
   * Kiểm tra lỗi phản hồi từ API (chủ yếu là lỗi 401/403).
   */
  checkError: (error: any) => {
    const status = error.status || error.response?.status;
    if (status === 401 || status === 403) {
      // Nếu là lỗi không được phép, xóa dữ liệu đăng nhập
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("role");
      localStorage.removeItem("expiryTime"); // <-- Mới: Xóa thời điểm hết hạn
      return Promise.reject();
    }
    return Promise.resolve();
  },

  /**
   * Kiểm tra xem người dùng có được xác thực hay không.
   * Bao gồm logic kiểm tra thời gian hết hạn.
   */
  checkAuth: () => {
    const token = localStorage.getItem("token");
    const expiryTimeStr = localStorage.getItem("expiryTime");

    // Nếu không có token, từ chối
    if (!token) {
      return Promise.reject();
    }

    // Kiểm tra thời điểm hết hạn
    if (expiryTimeStr) {
      const expiryTime = parseInt(expiryTimeStr, 10);
      const currentTime = Date.now();

      if (currentTime > expiryTime) {
        // Token đã hết hạn do không hoạt động (Inactivity Timeout)!
        // Xóa dữ liệu và buộc đăng nhập lại.
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("role");
        localStorage.removeItem("expiryTime");
        return Promise.reject();
      }
      
      // Nếu chưa hết hạn: Gia hạn thêm thời gian không hoạt động
      const newExpiryTime = Date.now() + TOKEN_EXPIRY_MS;
      localStorage.setItem("expiryTime", newExpiryTime.toString());
    }

    return Promise.resolve();
  },

  /**
   * Lấy quyền (role) của người dùng. Trả về "member" nếu không có.
   */
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

      // Fallback an toàn: trả "member"
      return Promise.resolve("member");
    } catch (e) {
      return Promise.resolve("member");
    }
  },

  /**
   * Lấy thông tin nhận dạng (identity) của người dùng.
   */
  getIdentity: async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      return Promise.resolve({
        id: user.id ?? null,
        fullName: user.fullName ?? user.name ?? "",
        // Lấy role từ currentUser hoặc role riêng lẻ, fallback về "member"
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