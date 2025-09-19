// middleware/auth.js
import jwt from "jsonwebtoken";

// Middleware xác thực JWT, check token hợp lệ 
export function authMiddleware(req, res, next) {
 
  const authHeader = req.headers["authorization"];
  // console.log("+++++authHeader: ", authHeader);
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  
  
  const token = authHeader && authHeader.split(" ")[1]; 
  // console.log("+++++token: ", token);
 
  if (!token) return res.sendStatus(401).json({ message: "Invalid token format"});

  

   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("+++++decoded: ", decoded);
    req.user = decoded; // lưu payload (id, role, email, orgid) vào req.user để các middleware sau dùng
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}



export function requireRole(role) {
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied: ${role} only` });
    }
    next();
  };
}
