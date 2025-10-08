import axios from "axios";

const API_URL = import.meta.env.DEV ? "http://localhost:4000" : "/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để tự động gắn token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------------------------------
// THÊM: Interceptor xử lý phản hồi để bắt lỗi 401 (Response Interceptor)
// ------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response, // Trả về phản hồi nếu thành công
  (error) => {
    // Kiểm tra nếu có lỗi phản hồi (tức là lỗi từ server) và mã lỗi là 401
    if (error.response && error.response.status === 401) {
      console.log("401 Unauthorized detected. Logging out...");
      
      // 1. Xóa thông tin xác thực
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Giả định bạn cũng lưu user ở đây
      
      // 2. Chuyển hướng người dùng về trang đăng nhập
      // Thao tác này sẽ làm trang reload và xóa mọi UI cần xác thực.
      window.location.href = '/login'; 
      
      // Ngăn lỗi tiếp tục lan truyền để tránh crash app hoặc log lỗi
      return new Promise(() => {}); // Trả về Promise không bao giờ resolved
    }
    
    // Đối với các lỗi khác, truyền lỗi đi tiếp
    return Promise.reject(error);
  }
);
// ------------------------------------------------------------------

export default api;
