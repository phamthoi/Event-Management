// middleware/auth.js
import jwt from "jsonwebtoken";

// Middleware xác thực JWT, check token hợp lệ 
export function authMiddleware(req, res, next) {
  // 1️⃣ Lấy header Authorization từ request
  // Ví dụ: "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  
  
  const token = authHeader && authHeader.split(" ")[1]; 
  // Nếu có authHeader thì tách lấy phần token sau "Bearer"
  // 2️⃣ Nếu không có token → từ chối (401: Unauthorized)
  if (!token) return res.sendStatus(401).json({ message: "Invalid token format"});

  
  // 3️⃣ Kiểm tra token có hợp lệ không bằng jwt.verify
   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // lưu payload (id, role, email, orgid) vào req.user để các middleware sau dùng
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}


// Midedleware check role
export function requireRole(role) {
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied: ${role} only` });
    }
    next();
  };
}
