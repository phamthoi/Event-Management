// src/i18nProvider.ts
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import vietnameseMessages from "ra-language-vietnamese";
import { TranslationMessages } from "ra-core";
import { ResetPassword } from "./components/members";
import { act } from "react";
import { info, profile } from "console";
import { getSystemErrorMap } from "util";

/* ------------------------- 🇻🇳 Bản dịch tiếng Việt ------------------------- */
const customVi: TranslationMessages = {
  ...vietnameseMessages,

  ra: {
    ...vietnameseMessages.ra,
    action: {
      ...vietnameseMessages.ra.action,
      add: "Thêm",
      add_filter: "Thêm bộ lọc",
      back: "Quay lại",
      cancel: "Hủy",
      clear_input_value: "Xóa",
      clone: "Nhân bản",
      confirm: "Xác nhận",
      create: "Tạo mới",
      delete: "Xóa",
      edit: "Chỉnh sửa",
      export: "Xuất dữ liệu",
      list: "Danh sách",
      refresh: "Làm mới",
      remove_filter: "Xóa bộ lọc",
      save: "Lưu",
      search: "Tìm kiếm",
      show: "Xem chi tiết",
      sort: "Sắp xếp",
      undo: "Hoàn tác",
    },
    sort: {
      ASC: "Tăng dần",
      DESC: "Giảm dần",
    },
    message: {
      ...vietnameseMessages.ra.message,
      yes: "Có",
      no: "Không",
      are_you_sure: "Bạn có chắc không?",
      invalid_form: "Biểu mẫu không hợp lệ",
      loading: "Đang tải...",
    },
    navigation: {
      ...vietnameseMessages.ra.navigation,
      no_results: "Không có kết quả nào",
      next: "Tiếp theo",
      prev: "Trước đó",
    },
  },

  /* ---------------------- Custom keys ---------------------- */
  custom: {
    menu: {
      dashboard: "Bảng điều khiển",
      events: "Quản lý sự kiện",
      members: "Quản lý thành viên",
      upcoming: "Sự kiện sắp tới",
      myEvents: "Sự kiện của tôi",
      attendance: "Điểm danh sự kiện",
      directory: "Danh bạ thành viên",
      profile: "Hồ sơ cá nhân",
      changePassword: "Đổi mật khẩu",
      logout: "Đăng xuất",
    },
    attendance: {
      title: "Quản lý điểm danh sự kiện",
      chooseEvent: "Chọn sự kiện",
      refresh: "Làm mới",
      noMembers: "Không có thành viên nào",
      name: "Họ tên",
      email: "Email",
      deposit: "Cọc",
      attendance: "Điểm danh",
    },
    profile: {
      title: "Hồ sơ người dùng",
      fullName: "Họ và tên",
      email: "Email",
      edit: "Chỉnh sửa hồ sơ",
      phoneNumber: "Số điện thoại",
      save: "Lưu thay đổi",
    },
    resetPassword: {
      title: "Đặt lại mật khẩu",
      secure: "giữ tài khoản an toàn",
      currentPass: "Mật khẩu hiện tại",
      newPassword: "Mật khẩu mới",
      confirmNewPassword: "Xác nhận mật khẩu mới",
      save: "Lưu",
      passwordMismatch: "Mật khẩu không khớp",
      success: "Đặt lại mật khẩu thành công",
      error: "Lỗi khi đặt lại mật khẩu",
    },
  },

  /* ---------------------- Resources ---------------------- */
  resources: {
    events: {
      name: "Sự kiện |||| Các sự kiện",
      fields: {
        title: "Tên sự kiện",
        location: "Địa điểm",
        startAt: "Thời gian bắt đầu",
        endAt: "Thời gian kết thúc",
        registrationStartAt: "Mở đăng ký",
        registrationEndAt: "Kết thúc đăng ký",
        minAttendees: "Số người tối thiểu",
        maxAttendees: "Số người tối đa",
        registeredCount: "Số người đã đăng ký",
        deposit: "Tiền cọc (VND)",
        status: "Trạng thái",
        description: "Mô tả",
      },
      status: {
        DRAFT: "Bản nháp",
        REGISTRATION: "Đang mở đăng ký",
        READY: "Sẵn sàng",
        ONGOING: "Đang diễn ra",
        COMPLETED: "Đã hoàn thành",
        CANCELLED: "Đã hủy",
      },
    },
    members: {
      name: "Thành viên |||| Các thành viên",
      fields: {
        title: "Thành viên",
        name: "Họ tên",
        email: "Email",
        password: "Mật khẩu",
        ResetPassword: "Đặt lại mật khẩu",
        role: "Vai trò",
        status: "Trạng thái",
        phonenumber: "Số điện thoại",
        helppertextmail: "email để đăng nhập",
        helpertextpassword: "mật khẩu ít nhất 3 ký tự",
        lock: "Khóa",
        unlock: "Mở khóa",
        active: "Đang hoạt động",
        locked: "Đã khóa",
        info: "Thông tin",
        systemInfo: "Thông tin hệ thống",
        personalInfo: "Thông tin cá nhân",
        organizationInfo: "Thông tin tổ chức", 
        timestamps: "Thông tin thời gian",
        otherInfo: "Thông tin khác",   
        newPassword: "Mật khẩu mới",
        resetPassTittle: "Đặt lại mật khẩu cho thành viên ", 
      },
      status: {
        ACTIVE: "Đang hoạt động",
        LOCKED: "Đã khóa",
      },
    },

    upcoming:{
      name: "Sự kiện sắp tới |||| Các sự kiện sắp tới",
      fields: {
        title: "tên sự kiện",
        location: "Địa điểm",
        startAt: "Thời gian bắt đầu",
        endAt: "Thời gian kết thúc",
        status: "Trạng thái",
        slots: "Số chỗ",
        actions: "Hành động",
        CancelButton: "❌ Hủy",
        RegisterButton: "🚀 Đăng ký",
      },
      status: {
        REGISTRATION: "Đang mở đăng ký",
        READY: "Sẵn sàng",
        ONGOING: "Đang diễn ra",
      }
    },

    myEvents:{
      name: "Sự kiện của tôi |||| Các sự kiện của tôi",
      fields: {
        title: "tên sự kiện",
        location: "Địa điểm",
        startAt: "Thời gian bắt đầu",
        endAt: "Thời gian kết thúc",
        status: "Trạng thái",
        registered: "Đã đăng ký",
        CancelButton: "❌ Hủy",
      },
      status: {
        CANCELLED: "Đã hủy",
        COMPLETED: "Đã hoàn thành",
        ONGOING: "Đang diễn ra",
        REGISTRATION: "Đang mở đăng ký",  
      }
    },

    dashboard: {
      name: "Bảng điều khiển",
      fields: {
        totalEvents: "Tổng số sự kiện",
        activeMembers: "Thành viên hoạt động",
        registrations: "Sự kiện đã đăng ký",
        ready: "Sự kiện đã sẵn sàng",
        ongoing: "Sự kiện đang diễn ra",
        completed: "Sự kiện đã hoàn thành"

      }
    },

  },
};

/* ------------------------- 🇬🇧 English version ------------------------- */
const customEn: TranslationMessages = {
  ...englishMessages,

  custom: {
    menu: {
      dashboard: "Dashboard",
      events: "Events Management",
      members: "Members Management",
      upcoming: "Upcoming Events",
      myEvents: "My Events",
      attendance: "Event Attendance",
      directory: "Members Directory",
      profile: "Profile",
      changePassword: "Change Password",
      logout: "Logout",
    },
    attendance: {
      title: "Event Attendance Management",
      chooseEvent: "Choose event",
      refresh: "Refresh",
      noMembers: "No members",
      name: "Name",
      email: "Email",
      deposit: "Deposit",
      attendance: "Attendance",
    },
    profile: {
      title: "User Profile",
      fullName: "Full Name",
      email: "Email",
      edit: "Edit Profile",
      phoneNumber: "Phone Number",
      save: "Save Changes",
    },
    resetPassword: {
      title: "Reset Password",
      secure: "Keep your account secure",
      currentPass: "Current password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      save: "Change",
      passwordMismatch: "Passwords do not match",
      success: "Password reset successfully",
      error: "Error resetting password",
    },
  },

  resources: {
    events: {
      name: "Event |||| Events",
      fields: {
        title: "Event name",
        location: "Location",
        startAt: "Start time",
        endAt: "End time",
        registrationStartAt: "Registration start",
        registrationEndAt: "Registration end",
        minAttendees: "Min attendees",
        maxAttendees: "Max attendees",
        registeredCount: "Registered count",
        deposit: "Deposit (VND)",
        status: "Status",
        description: "Description",
      },
      status: {
        DRAFT: "Draft",
        REGISTRATION: "Registration",
        READY: "Ready",
        ONGOING: "Ongoing",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
      },
    },
    members: {
      name: "Member |||| Members",
      fields: {
        title: "Member",
        name: "Full Name",
        email: "Email",
        ResetPassword: "Reset Password",
        password: "Password",
        role: "Role",
        status: "Status",
        phonenumber: "Phone Number",
        helppertextmail: "email as login",
        helpertextpassword: "password least 3 characters.",
        lock: "Lock",
        unlock: "Unlock",
        active: "Active",
        locked: "Locked",
        info: "Information",
        systemInfo: "System Information",
        personalInfo: "Personal Information",
        organizationInfo: "Organization Information",
        timestamps: "Timestamps",
        otherInfo: "Other Info",
        newPassword: "New Password",
        resetPassTittle: "Reset Password for Member ",
      },

      status: {
        ACTIVE: "Active",
        LOCKED: "Locked",
      }
    },
    upcoming:{
      name: "Upcoming Event |||| Upcoming Events",
      fields: {
        title: "Event title",
        location: "Location",
        startAt: "Start time",
        endAt: "End time",
        status: "Status",
        slots: "Slots",
        actions: "Actions",
        CancelButton: "❌ Cancel",
        RegisterButton: "🚀 Register",
      },
      status: {
        REGISTRATION: "Registration",
        READY: "Ready",
        ONGOING: "Ongoing",
      }
    },

    myEvents:{
      name: "My Event |||| My Events",
      fields: {
        title: "Event title",
        location: "Location",
        startAt: "Start time",
        endAt: "End time",
        status: "Status",
        registered: "Registered",
        CancelButton: "❌ Cancel",
      },
      status: {
        CANCELLED: "Cancelled",
        COMPLETED: "Completed",
        ONGOING: "Ongoing",
        REGISTRATION: "Registration",
      }
    },
    dashboard: {
      name: "Dashboard",
      fields: {
        totalEvents: "Total Events",
        activeMembers: "Active Members",
        registrations: "Registrations",
        ready: "Ready",
        ongoing: "Ongoing",
        completed: "Completed",
      }
    }
  },
};

/* ------------------------- Provider chính ------------------------- */
export const i18nProvider = polyglotI18nProvider(
  (locale) => (locale === "vi" ? customVi : customEn),
  "vi" // Ngôn ngữ mặc định
);
