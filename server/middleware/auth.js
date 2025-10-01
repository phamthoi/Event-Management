// middleware/auth.js
import jwt from "jsonwebtoken";

// Middleware xác thực JWT, check token hợp lệ 
export function authMiddleware(req, res, next) {
 
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  
  
  // const token = authHeader && authHeader.split(" ")[1]; 
  const token = authHeader; 
 
  //if (!token) return res.sendStatus(401).json({ message: "Invalid token format"});

  
  //  Kiểm tra token có hợp lệ không bằng jwt.verify
   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // lưu payload (id, role, email, orgid) vào req.user để các middleware sau dùng
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}


// Midedleware check role
export function requireRole(roles) {
  // return (req, res, next) => {
  //   if(!req.user) return res.status(401).json({ message: "Unauthorized" });
  //   if (req.user.role !== role) {
  //     return res.status(403).json({ message: `Access denied: ${role} only` });
  //   }
  //   next();
  // };
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: requires role(s) ${allowedRoles.join(", ")}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
}
