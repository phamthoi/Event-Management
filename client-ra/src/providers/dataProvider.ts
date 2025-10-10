// src/providers/dataProvider.ts
import { DataProvider } from "react-admin";
import qs from "query-string";
import api from "../services/axios";

// === RESOURCE KHÔNG CẦN /list ===
// Các resource này sẽ được gọi mà KHÔNG CÓ "/list" ở cuối URL.
const LIST_ENDPOINT_RESOURCES = new Set([
    "stats",
    "member-stats",
    "event",
    "profile",
    "upcoming-events",
    "ongoing-events", 
    "member-members",
]);

// === MAP RESOURCE → ENDPOINT ===
const getEndpoint = (resource: string) => {
    switch (resource) {
        case "events": return "/admin/events";
        case "members": return "/admin/members";
        case "stats": return "/admin/stats/dashboard";
        
        // ✅ ÁNH XẠ CHO ENDPOINT CUSTOM
        case "ongoing-events": return "/admin/events/ongoing"; 

        case "member-events": return "/member/events";
        case "member-members": return "/member/members";
        case "member-stats": return "/member/stats/dashboard";

        case "profile": return "/profile";
        case "event": return "/event";
        case "upcoming-events": return "/event/upcoming";

        default: return `/${resource}`;
    }
};

// === CHUẨN HÓA DỮ LIỆU: PHẢI CÓ ID ===
const mapDataWithId = (data: any[], resource: string) => {
    return data.map((item) => ({
        id:
            item.id ??
            item.eventId ??
            item._id ??
            item.event?._id ??
            item.userId ??
            item.memberId,
        ...item,
    }));
};

// === DATA PROVIDER CHÍNH ===
const dataProvider: DataProvider & { changePassword?: Function } = {
    /** ---------------- GET LIST ---------------- */
    getList: async (resource, params) => {
        const endpoint = getEndpoint(resource);
        const page = params.pagination?.page || 1;
        const perPage = params.pagination?.perPage || 10;

        // Xác định có phải endpoint custom không cần /list hoặc query string
        const isCustomEndpoint = ["ongoing-events"].includes(resource);

        const query = isCustomEndpoint
            ? ""
            : qs.stringify({ page, limit: perPage, ...params.filter });

        const url = LIST_ENDPOINT_RESOURCES.has(resource)
            ? `${endpoint}${query ? '?' + query : ''}`
            : `${endpoint}/list?${query}`;

        const response = await api.get(url);

        let rawData: any[] = [];
        let total = 0;

        // === Xử lý riêng cho từng resource ===
        switch (resource) {
            case "upcoming-events":
            case "ongoing-events":
                rawData = response.data.events ?? response.data ?? [];
                total = response.data.total ?? rawData.length;
                break;

            case "member-members":
                rawData = response.data.members ?? response.data.data ?? [];
                total = response.data.total ?? rawData.length;
                break;

            default:
                rawData = response.data[resource] ?? response.data.data ?? response.data ?? [];
                total = response.data.total ?? rawData.length;
                break;
        }

        if (!Array.isArray(rawData)) {
            console.error(`Expected array for resource ${resource} but got:`, rawData);
            rawData = [rawData];
        }

        const mapped = mapDataWithId(rawData, resource);

        return { data: mapped, total };
    },

    // getOne
    getOne: async (resource, params) => {
        if (!params.id) throw new Error(`Missing ID for getOne(${resource})`);

        const endpoint = getEndpoint(resource);

        // Chỉnh URL chi tiết theo resource
        const detailEndpoint =
            resource === "upcoming-events" 
                ? `${endpoint}/${params.id}`
                : resource === "members" 
                    ? `${endpoint}/${params.id}` 
                    : resource === "profile"
                        ? `${endpoint}`
                        : `${endpoint}/detail/${params.id}`;

        const response = await api.get(detailEndpoint);

        // 🔹 Xử lý data cho từng resource
        let record;
        if (resource === "members") {
            // Lấy trực tiếp member
            record = response.data.member;
        } else if (resource === "profile") {
            record = response.data;
            record.id = params.id; // ép id
        } else {
            // default các resource khác
            record = response.data.data || response.data.event || response.data.result || response.data;
        }

        return { data: record };
    },

    /** ---------------- CREATE ---------------- */
    create: async (resource, params) => {
        // ✅ Đăng ký sự kiện (POST /event/:id/register)
        if (resource === "event" && params.data.eventId) {
            const eventId = params.data.eventId;
            await api.post(`/event/${eventId}/register`, {});
            return { data: { id: eventId, ...params.data, registered: true } };
        }

        // ❌ Ngăn tạo event sai luồng
        if (resource === "event") {
            throw new Error("Invalid CREATE operation for user events. Use 'events' for admin.");
        }

        // ✅ Các resource khác
        const endpoint = getEndpoint(resource);
        const response = await api.post(`${endpoint}/create`, params.data);

        let resultData = response.data.data || response.data;
        if (!Array.isArray(resultData)) resultData = [resultData];
        const mapped = mapDataWithId(resultData, resource)[0];

        return { data: mapped };
    },

    /** ---------------- UPDATE ---------------- */
    update: async (resource, params) => {
        const endpoint = getEndpoint(resource);

        
    // 🟢 Nếu là PROFILE → xử lý riêng
    if (resource === "profile") {
        // Không cần lấy dữ liệu cũ (vì /profile không có id)
        const payload = params.data;

        const response = await api.put(`${endpoint}`, payload);

        // Chuẩn hoá dữ liệu trả về
        let resultData = 
            response.data.data || 
            response.data.result || 
            response.data;

        // Ép id để React-Admin không lỗi
        const mapped = { id: "profile", ...resultData };
        return { data: mapped };
    }


        // 🟢 Lấy dữ liệu cũ (nếu cần merge)
        const existingResponse = await api.get(`${endpoint}/detail/${params.id}`);
        const existing = 
                    existingResponse.data.data || 
                    existingResponse.data ||
                    existingResponse.data.event;

        // 🟢 Gộp dữ liệu cũ và mới lại
        const merged = { ...existing, ...params.data };

        // 🟢 Chỉ giữ lại các field hợp lệ cho backend
        //    (lọc ra những field mà form có thể chỉnh sửa)
        const allowedFields = [
            "title",
            "description",
            "location",
            "minAttendees",
            "maxAttendees",
            "startAt",
            "endAt",
            "registrationStartAt",
            "registrationEndAt",
            "deposit",
            "status"
        ];

        const payload = Object.fromEntries(
            Object.entries(merged).filter(([key]) => allowedFields.includes(key))
        );

        // 🟢 Gửi PUT với dữ liệu đã lọc
        const response = await api.put(`${endpoint}/edit/${params.id}`, payload);

        let resultData = 
                    response.data.data || 
                    response.data ||
                    response.data.event ||
                    response.data.result;
        if (!Array.isArray(resultData)) resultData = [resultData];
        const mapped = mapDataWithId(resultData, resource)[0];

        return { data: mapped };
    },


    /** ---------------- DELETE ---------------- */
    delete: async (resource, params) => {
        // ✅ Hủy đăng ký sự kiện (DELETE /event/:id/register)
        if (resource === "event") {
            const eventId = params.id;
            await api.delete(`/event/${eventId}/register`);
            return { data: { id: eventId } };
        }

        // ✅ Các resource khác dùng /delete/:id
        const endpoint = getEndpoint(resource);
        const response = await api.delete(`${endpoint}/delete/${params.id}`);
        return { data: response.data.data || response.data };
    },

    /** ---------------- GET MANY ---------------- */
    getMany: async (resource, params) => {
        const results = await Promise.all(
            params.ids.map((id) =>
                dataProvider.getOne(resource, { id }).then((res) => res.data)
            )
        );
        return { data: results };
    },

    /** ---------------- GET MANY REF ---------------- */
    getManyReference: async (resource, params) => {
        const endpoint = getEndpoint(resource);
        const page = params.pagination?.page || 1;
        const perPage = params.pagination?.perPage || 10;
        const { field = "id", order = "ASC" } = params.sort || {};

        const query = qs.stringify({
            page,
            limit: perPage,
            sortField: field,
            sortOrder: order,
            ...params.filter,
            [params.target]: params.id,
        });

        const response = await api.get(`${endpoint}/list?${query}`);
        let resultData = response.data.data ?? [];
        resultData = mapDataWithId(resultData, resource);

        return {
            data: resultData,
            total: response.data.total ?? resultData.length ?? 0,
        };
    },

    /** ---------------- UPDATE MANY ---------------- */
    updateMany: async (resource, params) => {
        const results = await Promise.all(
            params.ids.map(async (id) => {
                // Lấy previousData từ backend trước
                const { data: previousData } = await dataProvider.getOne(resource, { id });
                return dataProvider.update(resource, { id, data: params.data, previousData });
            })
        );
        return { data: results.map((r) => r.data.id) };
    },

    /** ---------------- DELETE MANY ---------------- */
    deleteMany: async (resource, params) => {
        const results = await Promise.all(
            params.ids.map((id) => dataProvider.delete(resource, { id }))
        );
        return { data: results.map((r) => r.data.id) };
    },

    // Special method
    changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.put("/profile/password", { currentPassword, newPassword });
    return res.data;
  },
};

export default dataProvider;