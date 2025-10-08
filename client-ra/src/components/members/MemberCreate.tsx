// src/components/members/MemberCreate.tsx

import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required, // Thêm validator bắt buộc
  email,    // Thêm validator định dạng email
  minLength, // Thêm validator độ dài tối thiểu
} from "react-admin";
import { Grid } from "@mui/material"; // Sử dụng Grid từ MUI để chia cột

// --- 1. Định nghĩa các quy tắc xác thực (Validation Rules) ---
const validateRequired = required("Trường này không được để trống.");
const validateEmail = [
    validateRequired,
    email("Email phải đúng định dạng."),
];
const validatePassword = [
    validateRequired,
    minLength(3, "Mật khẩu phải có ít nhất 3 ký tự."),
];

// --- 2. Component MemberCreate chuyên nghiệp ---
const MemberCreate = () => (
  // Thêm title cho trang
  <Create title="Tạo Thành viên Mới">
    {/* SimpleForm vẫn được giữ để quản lý state và submit */}
    <SimpleForm>
      {/* Sử dụng Grid container để chia bố cục */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        
        {/* Cột 1: Email & Mật khẩu */}
        <Grid item xs={12} sm={6}>
            <TextInput 
                source="email" 
                label="Email (Đăng nhập)" 
                validate={validateEmail} // Áp dụng validation email
                fullWidth 
                autoFocus // Tự động focus vào trường này
                helperText="Cần phải là một email hợp lệ."
            />
            <TextInput 
                source="password" 
                label="Mật khẩu" 
                type="password" 
                validate={validatePassword} // Áp dụng validation mật khẩu
                fullWidth 
                helperText="Mật khẩu phải chứa ít nhất 3 ký tự."
            />
        </Grid>

        {/* Cột 2: Thông tin cá nhân */}
        <Grid item xs={12} sm={6}>
            <TextInput 
                source="fullName" 
                label="Họ và Tên" 
                validate={validateRequired} // Áp dụng validation bắt buộc
                fullWidth 
            />
            <TextInput 
                source="phoneNumber" 
                label="Số điện thoại" 
                fullWidth 
                // Có thể thêm validation phone number ở đây nếu cần
            />
        </Grid>
      </Grid>
    </SimpleForm>
  </Create>
);

export default MemberCreate;