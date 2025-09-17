// middleware/auth.js
import jwt from "jsonwebtoken";

// Middleware xác thực JWT: kiểm tra token hợp lệ
export function authMiddleware(req, res, next) {
  // Lấy header Authorization từ request
  // Ví dụ: "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // lấy phần token sau "Bearer"
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded; // lưu payload (id, email, role, organizationId) vào req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}

// Middleware kiểm tra role
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied: ${role} only` });
    }
    next();
  };
}
