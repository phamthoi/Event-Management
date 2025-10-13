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
import { useTranslate } from 'react-admin';

// --- 1. Định nghĩa các quy tắc xác thực (Validation Rules) ---
const validateRequired = required("This field is required.");
const validateEmail = [
    validateRequired,
    email("Must be a valid email."),
];
const validatePassword = [
    validateRequired,
    minLength(3, "password least 3 characters."),
];

// --- 2. Component MemberCreate chuyên nghiệp ---
const MemberCreate = () => {
  const translate = useTranslate();

  return(
  // Thêm title cho trang
  <Create title="Create New Member">
    {/* SimpleForm vẫn được giữ để quản lý state và submit */}
    <SimpleForm>
      {/* Sử dụng Grid container để chia bố cục */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        
        {/* Cột 1: Email & Mật khẩu */}
        <Grid item xs={12} sm={6}>
            <TextInput 
                source="email" 
                label="Email" 
                validate={validateEmail} // Áp dụng validation email
                fullWidth 
                autoFocus // Tự động focus vào trường này
                helperText={translate('resources.members.fields.helppertextmail')}
            />
            <TextInput 
                source="password" 
                label={translate('resources.members.fields.password')} 
                type="password" 
                validate={validatePassword} // Áp dụng validation mật khẩu
                fullWidth 
                helperText={translate('resources.members.fields.helpertextpassword')}
            />
        </Grid>

        {/* Cột 2: Thông tin cá nhân */}
        <Grid item xs={12} sm={6}>
            <TextInput 
                source="fullName" 
                label={translate('resources.members.fields.name')}
                validate={validateRequired} // Áp dụng validation bắt buộc
                fullWidth 
            />
            <TextInput 
                source="phoneNumber" 
                label={translate('resources.members.fields.phonenumber')}
                fullWidth 
                // Có thể thêm validation phone number ở đây nếu cần
            />
        </Grid>
      </Grid>
    </SimpleForm>
  </Create>
  );
};

export default MemberCreate;