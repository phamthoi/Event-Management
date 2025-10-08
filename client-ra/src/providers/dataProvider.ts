// src/providers/dataProvider.ts
import api from "../services/axios";
import {
  DataProvider,
  GetListParams,
  GetOneParams,
  UpdateParams,
  UpdateManyParams,
  CreateParams,
  DeleteParams,
  RaRecord,
  Identifier,
} from "react-admin";

// -----------------------
// Helpers
// -----------------------
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const toRaRecord = <T extends { id: number | string }>(obj: T) => ({
  ...obj,
  id: String(obj.id),
});

/**
 * Hàm buildQuery nhận một limit mặc định tùy chỉnh.
 * @param params Tham số GetListParams từ react-admin.
 * @param defaultLimit Giới hạn mặc định cho mỗi trang nếu không được cung cấp trong params.
 * @returns Chuỗi query string.
 */
const buildQuery = (params: GetListParams, defaultLimit: number = 10) => {
  const page = params.pagination?.page ?? 1;
  const perPage = params.pagination?.perPage ?? defaultLimit;
  const filter = params.filter ?? {};
  
  const searchParams = new URLSearchParams({ 
    page: page.toString(), 
    limit: perPage.toString() 
  });
  
  Object.keys(filter).forEach(key => {
      const value = filter[key];
      if (value !== undefined && value !== null && typeof value !== 'object') {
          searchParams.append(key, value.toString());
      }
  });

  return searchParams.toString();
};


// role -> URL prefix mapping
const rolePrefixMap: Record<string, string> = {
  admin: "admin",
  member: "member",
}

const getBaseUrlByRole = (resource: string) => {
  const user = getUser();
  const role = user?.role?.toLowerCase();
  
  const specialResources = ["upcoming-events", "member-events", "attendance-events", "registrations", "dashboardStats", "memberStats", "admin", "events", "members"]; 

  if (role && rolePrefixMap[role] && !specialResources.includes(resource)) {
    return `${rolePrefixMap[role]}/${resource}`; 
  }

  return `/${resource}`;
}

// -----------------------
// Generic Handlers
// -----------------------
const genericGetList = async (resource: string, params: GetListParams) => {
  // Sử dụng limit mặc định là 10 cho generic handler
  const query = buildQuery(params, 10); 
  const baseUrl = getBaseUrlByRole(resource);
  const res = await api.get(`${baseUrl}?${query}`);
  const data = (res.data[resource] || res.data || []).map(toRaRecord);
  const total = res.data.total ?? res.data.count ?? data.length; 
  return { data, total };
};

const genericGetOne = async (resource: string, params: GetOneParams) => {
  const baseUrl = getBaseUrlByRole(resource);
  const res = await api.get(`${baseUrl}/${params.id}`);
  return { data: toRaRecord(res.data[resource] ?? res.data) };
};

const genericCreate = async (resource: string, params: CreateParams) => {
  const baseUrl = getBaseUrlByRole(resource);
  const res = await api.post(baseUrl, params.data);
  return { data: toRaRecord(res.data[resource] ?? res.data) };
};

const genericUpdate = async (resource: string, params: UpdateParams) => {
  const baseUrl = getBaseUrlByRole(resource);
  const res = await api.put(`${baseUrl}/${params.id}`, params.data);
  return { data: toRaRecord(res.data[resource] ?? res.data) };
};

const genericDelete = async (resource: string, params: any) => {
  const baseUrl = getBaseUrlByRole(resource);
  await api.delete(`${baseUrl}/${params.id}`);
  return { data: params.ids ? params.ids : [params.id] };
};

// -----------------------
// DataProvider
// -----------------------
const dataProvider: DataProvider & { changePassword?: Function } = {
  // GET LIST
  getList: async (resource, params) => {
    switch (resource) {
      case "upcoming-events": {
        const page = params.pagination?.page ?? 1;
        const perPage = params.pagination?.perPage ?? 10; 
        const res = await api.get(`/event/upcoming?page=${page}&limit=${perPage}`);
        const data = (res.data.events || []).map(toRaRecord);
        return { data, total: res.data.total ?? data.length };
      }
      case "member-events": {
        const res = await api.get(`/event`); 
        const data = (res.data.events || res.data || []).map(toRaRecord);
        return { data, total: res.data.total ?? data.length };
      }
      case "attendance-events": {
        const res = await api.get("/admin/events/ongoing"); 
        const data = (res.data.events || res.data || []).map(toRaRecord);
        return { data, total: data.length };
      }
      case "registrations": {
        const eventId = params.filter?.eventId;
        if (!eventId) return { data: [], total: 0 };
        const res = await api.get(`/admin/events/registrations/${eventId}`); 
        const data = (res.data.registrations || res.data || []).map(toRaRecord);
        return { data, total: data.length };
      }
      case "dashboardStats": {
        const res = await api.get("/admin/stats/dashboard");
        return { data: [{ id: 1, ...res.data }], total: 1 };
      }
      case "memberStats": {
        const res = await api.get("/member/stats/dashboard");
        return { data: [{ id: 1, ...res.data.data }], total: 1 };
      }
      // === ĐIỀU CHỈNH LIMIT VÀ ROUTE CHO EVENTS ===
      case "events": { 
          // Limit mặc định là 5
          const query = buildQuery(params, 5); 
          // Giả định backend gắn admin/event.routes.js ở /admin/events
          const res = await api.get(`/admin/events/list?${query}`); 
          const data = (res.data.events || res.data || []).map(toRaRecord);
          const total = res.data.total ?? res.data.count ?? data.length;
          return { data, total };
      }
      // === ĐIỀU CHỈNH LIMIT VÀ ROUTE CHO MEMBERS (SỬA LỖI 404) ===
      case "members": { 
          // Limit mặc định là 5
          const query = buildQuery(params, 5); 
          // Sửa '/admin/member/list' thành '/admin/members/list'
          const res = await api.get(`/admin/members/list?${query}`); 
          const data = (res.data.members || res.data || []).map(toRaRecord);
          const total = res.data.total ?? res.data.count ?? data.length;
          return { data, total };
      }

      case "membersPublic": {
          const defaultLimit = 5;
          const page = params.pagination?.page ?? 1;
          const perPage = params.pagination?.perPage ?? defaultLimit;
          const { email = "", fullName = "" } = params.filter || {};
          
          // Tạo query string thủ công chỉ với filter email/fullName
          const serviceQuery = new URLSearchParams({
            page: page.toString(),
            limit: perPage.toString(),
            ...(email && { email: email.toString() }),
            ...(fullName && { fullName: fullName.toString() }),
          }).toString();
          
          // Endpoint: /member/members
          const res = await api.get(`/member/members?${serviceQuery}`);

          const data = (res.data.members || res.data || []).map(toRaRecord);
          const total = res.data.total ?? res.data.count ?? data.length;
          return { data, total };
      }
      // ===========================================
      default:
        return genericGetList(resource, params);
    }
  },

  // GET ONE
  getOne: async (resource, params) => {
    if (resource === "admin" && params.id === "profile") {
      const res = await api.get("/profile");
      return { data: { ...res.data, id: "profile" } };
    }
    if (resource === "attendance-events") {
      const res = await api.get("/admin/events/ongoing");
      const event = res.data.events?.find((e: any) => e.id === params.id);
      return { data: toRaRecord(event ?? { id: params.id }) };
    }
    if (["upcoming-events", "member-events", "events"].includes(resource)) {
      const endpoint = resource === "events" ? `/admin/events/detail/${params.id}` : `/event/${params.id}`;
      const res = await api.get(endpoint);
      return { data: toRaRecord(res.data.event ?? res.data) };
    }
    // === SỬA LỖI ROUTE CHO MEMBERS ===
    if (resource === "members") { 
      // Sửa '/admin/member/:id' thành '/admin/members/:id'
      const res = await api.get(`/admin/members/${params.id}`);
      return { data: toRaRecord(res.data.member ?? res.data) };
    }
    // ===========================================
    return genericGetOne(resource, params);
  },

  // CREATE
  create: async (resource, params) => {
    if (resource === "registrations") {
      const { memberId, eventId } = params.data;
      // Giả định route này là đúng
      const res = await api.post(`/admin/member/registrations/${memberId}/${eventId}`);
      return { data: toRaRecord(res.data) };
    }
    if (resource === "events") {
      const res = await api.post("/admin/events/create", params.data);
      return { data: toRaRecord(res.data.event) };
    }
    // === SỬA LỖI ROUTE CHO MEMBERS ===
    if (resource === "members") {
      // Sửa '/admin/member/create' thành '/admin/members/create'
      const res = await api.post("/admin/members/create", params.data);
      return { data: toRaRecord(res.data.member ?? res.data) };
    }

     // ---- Event ----
    if (resource === "event-register") {
      const { eventId } = params.data;
      const res = await api.post(`/event/${eventId}/register`);
      return { data: { id: eventId, ...res.data } };
    }
    // ===========================================
    return genericCreate(resource, params);
  },

  // UPDATE
  update: async (resource, params) => {
    if (resource === "admin" && params.id === "profile") {
      const res = await api.put("/profile", params.data);
      return { data: { ...res.data, id: "profile" } };
    }
    if (resource === "registrations") {
      await api.put("/admin/events/registrations/update-status", {
        updates: [{ registrationId: params.id, ...params.data }],
      });
      return { data: { ...params.previousData, ...params.data, id: params.id } };
    }
    if (resource === "events") {
      const res = await api.put(`/admin/events/edit/${params.id}`, params.data);
      return { data: toRaRecord(res.data.event) };
    }
    // Thêm logic update cho members nếu cần, giả định endpoint là /admin/members/:id
    /* if (resource === "members") {
        const res = await api.put(`/admin/members/${params.id}`, params.data); 
        return { data: toRaRecord(res.data.member ?? res.data) };
    } */

    return genericUpdate(resource, params);
  },

  // DELETE
  delete: async (resource, params: DeleteParams) => {
    const user = getUser();
    if (resource === "registrations") {
      const memberId = params.previousData?.memberId; 
      const eventId = params.previousData?.eventId;
      if (!memberId || !eventId) throw new Error("Missing memberId or eventId");
      // Giả định route này là đúng
      await api.delete(`/admin/member/registrations/${memberId}/${eventId}`); 
      return { data: [params.id] };
    }
   if (
      resource === "events" ||
      resource === "upcoming-events" ||
      resource === "member-events" ||
      resource === "event-register"
    ) {
      if (resource === "events") {
        if (!user || user.role !== "ADMIN") throw new Error("Only admin can delete events");
        await api.delete(`/admin/events/delete/${params.id}`);
        return { data: [params.id] };
      }
      await api.delete(`/event/${params.id}/register`);
      return { data: [params.id] };
    }
    // Thêm logic delete cho members nếu cần, giả định endpoint là /admin/members/:id
    /* if (resource === "members") {
        await api.delete(`/admin/members/${params.id}`);
        return { data: [params.id] };
    } */

    return genericDelete(resource, params);
  },

  // UPDATE MANY
  updateMany: async (resource, params: UpdateManyParams) => {
    if (resource === "registrations") {
      const updates = params.ids.map((id) => ({ registrationId: id, ...params.data }));
      await api.put("/admin/events/registrations/update-status", { updates });
      return { data: params.ids };
    }
    throw new Error(`updateMany not implemented for resource: ${resource}`);
  },

  // DELETE MANY
  deleteMany: async (resource, params: any) => {
    const user = getUser();
    if (resource === "events" && (!user || user.role !== "ADMIN")) {
      throw new Error("Only admin can delete events");
    }
    if (resource === "registrations") {
      await Promise.all(
        params.ids.map(async (id: Identifier) => {
          const registration = params.previousData?.find((item: any) => item.id === id);
          if (!registration?.memberId || !registration?.eventId) {
            throw new Error("Missing memberId or eventId");
          }
          await api.delete(`/admin/member/registrations/${registration.memberId}/${registration.eventId}`);
        })
      );
      return { data: params.ids };
    }
    
    if (resource === "events") {
        await Promise.all(
            params.ids.map((id: Identifier) => api.delete(`/admin/events/delete/${id.toString()}`))
        );
        return { data: params.ids };
    }
    
    // Thêm logic deleteMany cho members nếu cần, giả định endpoint là /admin/members/:id
    /* if (resource === "members") {
        await Promise.all(
            params.ids.map((id: Identifier) => api.delete(`/admin/members/${id.toString()}`))
        );
        return { data: params.ids };
    } */

    const baseUrl = getBaseUrlByRole(resource);
    await Promise.all(
      params.ids.map((id: Identifier) => api.delete(`${baseUrl}/${id.toString()}`))
    );
    return { data: params.ids };
  },

  // GET MANY REFERENCE
  getManyReference: async (resource, params) => {
    if (resource === "registrations" && params.target === "memberId") {
      const res = await api.get(`/admin/member/registrations/${params.id}`);
      const data = (res.data.registrations || res.data || []).map(toRaRecord);
      return { data, total: data.length };
    }
    throw new Error(`getManyReference not implemented for resource: ${resource}`);
  },

  // GET MANY
  getMany: async () => ({ data: [] }),

  // Special method
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.put("/profile/password", { currentPassword, newPassword });
    return res.data;
  },
};

export default dataProvider;