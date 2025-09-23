import { AuthService, forgotPassword, verifyCode, resetPassword } from '../services/auth.service.js';

export class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Email và password là bắt buộc" 
        });
      }

      const result = await AuthService.login(email, password);
      
      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi server" 
      });
    }
  }
}

export async function forgotPasswordController(req, res) {
  const { email } = req.body;
  try {
    const result = await forgotPassword(email);
    res.json(result);
  } catch (err) {
    console.error("forgotPasswordController:", err);
    res.status(400).json({ error: err.message });
  }
}

export async function verifyCodeController(req, res) {
  const { email, code } = req.body; // frontend uses token as code
  try {
    const result = await verifyCode(email, code);
    return res.json({ success: true, ok: true });
  } catch (err) {
    console.error("verifyCodeController:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
}

export async function resetPasswordController(req, res) {
  console.log("Body reveived:", req.body);
  const { email, code, newPassword } = req.body;
  
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Email, code và newPassword là bắt buộc" });
  }

  try {
    const result = await resetPassword(email, code, newPassword);
    return res.json(result);
  } catch (err) {
    console.error("resetPasswordController:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
}