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
  DeleteResult,
  RaRecord,
  UpdateResult,
  GetManyReferenceParams,
} from "react-admin";

// Lấy user hiện tại từ localStorage
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const dataProvider: DataProvider & { changePassword?: Function } = {
  // ===== GET LIST =====
  getList: async (resource: string, params: GetListParams) => {
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;
    const query: Record<string, any> = { page, limit: perPage, ...params.filter };
    const queryString = new URLSearchParams(query as any).toString();

    // ---- Event ----
    if (
      resource === "events" ||
      resource === "upcoming-events" ||
      resource === "member-events"
    ) {
      let res;
      if (resource === "upcoming-events") {
        res = await api.get(`/event/upcoming?page=${page}&limit=${perPage}`);
      } else if (resource === "member-events") {
        res = await api.get(`/event`);
      } else {
        res = await api.get(`/admin/events/list?${queryString}`);
      }
      const data = res.data.events
        ? res.data.events.map((ev: any) => ({ ...ev, id: ev.id.toString() }))
        : res.data.map((ev: any) => ({ ...ev, id: ev.id.toString() }));
      const total = res.data.total || data.length;
      return { data, total };
    }

    // ---- Member ----
    if (resource === "members" || resource === "membersPublic") {
      let res;
      if (resource === "members") res = await api.get(`/admin/members/list?${queryString}`);
      else {
        const { email = "", fullName = "" } = params.filter || {};
        const serviceQuery = new URLSearchParams({
          page: page.toString(),
          limit: perPage.toString(),
          ...(email && { email }),
          ...(fullName && { fullName }),
        }).toString();
        res = await api.get(`/member/members?${serviceQuery}`);
      }
      const data = (res.data.members || []).map((m: any) => ({ ...m, id: String(m.id) }));
      const total = res.data.total || data.length;
      return { data, total };
    }

    // ---- Attendance ----
    if (resource === "attendance-events") {
      const res = await api.get("/admin/events/ongoing");
      const events = res.data?.events || res.data || [];
      return { data: events.map((e: any) => ({ id: e.id, ...e })), total: events.length };
    }

    if (resource === "registrations") {
      const eventId = params.filter?.eventId;
      if (!eventId) return { data: [], total: 0 };
      const res = await api.get(`/admin/events/registrations/${eventId}`);
      const registrations = (res.data?.registrations || res.data || []).map((reg: any) => ({
        id: reg.id,
        user: reg.user,
        depositPaid: reg.depositPaid ?? false,
        attended: reg.attended ?? false,
      }));
      return { data: registrations, total: registrations.length };
    }

    // ---- Stats ----
    if (resource === "dashboardStats") {
      const response = await api.get("/admin/stats/dashboard");
      return { data: [{ id: 1, ...response.data }], total: 1 };
    }
    if (resource === "memberStats") {
      const response = await api.get("/member/stats/dashboard");
      return { data: [{ id: 1, ...response.data.data }], total: 1 };
    }

    // ---- Profile ----
    if (resource === "admin") throw new Error("getList not implemented for profile");

    throw new Error(`getList not implemented for resource: ${resource}`);
  },

  // ===== GET ONE =====
  getOne: async (resource: string, params: GetOneParams) => {
    // ---- Profile ----
    if (resource === "admin" && params.id === "profile") {
      const { data } = await api.get("/profile");
      return { data: { ...data, id: "profile" } };
    }

    // ---- Event ----
    if (
      resource === "events" ||
      resource === "upcoming-events" ||
      resource === "member-events"
    ) {
      let res;
      if (resource === "upcoming-events" || resource === "member-events") {
        res = await api.get(`/event/${params.id}`);
        return { data: { ...res.data, id: params.id } };
      } else {
        res = await api.get(`/admin/events/detail/${params.id}`);
        return { data: { ...res.data.event, id: params.id } };
      }
    }

    // ---- Member ----
    if (resource === "members" || resource === "membersPublic") {
      const res =
        resource === "members"
          ? await api.get(`/admin/members/${params.id}`)
          : await api.get(`/member/members/${params.id}`);
      const member = res.data.member || res.data;
      return { data: { id: String(member.id), ...member } };
    }

    // ---- Attendance ----
    if (resource === "attendance-events") {
      const res = await api.get(`/admin/events/ongoing`);
      const event = res.data.events?.find((e: any) => e.id === params.id) || null;
      return { data: { ...event, id: params.id } };
    }
    if (resource === "registrations") throw new Error("getOne not implemented for registrations");

    // ---- Stats ----
    if (resource === "dashboardStats") {
      const response = await api.get("/admin/stats/dashboard");
      return { data: { id: params.id, ...response.data } };
    }
    if (resource === "memberStats") {
      const response = await api.get("/member/stats/dashboard");
      return { data: { id: params.id, ...response.data.data } };
    }

    throw new Error(`getOne not implemented for resource: ${resource}`);
  },

  // ===== CREATE =====
  create: async (resource: string, params: CreateParams) => {
    // ---- Event ----
    if (resource === "event-register") {
      const { eventId } = params.data;
      const res = await api.post(`/event/${eventId}/register`);
      return { data: { id: eventId, ...res.data } };
    }
    if (resource === "events") {
      const res = await api.post("/admin/events/create", params.data);
      const eventData = res.data.event;
      return { data: { ...eventData, id: eventData.id.toString() } };
    }

    // ---- Member ----
    if (resource === "members") {
      const res = await api.post(`/admin/members/create`, params.data);
      return { data: { id: String(res.data.id), ...res.data } };
    }

    // ---- Attendance ----
    if (resource === "registrations") {
      const { memberId, eventId } = params.data;
      const res = await api.post(`/admin/member/registrations/${memberId}/${eventId}`);
      return { data: { id: res.data.id, ...res.data } };
    }

    throw new Error(`create not implemented for resource: ${resource}`);
  },

  // ===== UPDATE =====
  update: async <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateParams<RecordType>
  ): Promise<UpdateResult<RecordType>> => {
    // Profile
    if (resource === "admin" && params.id === "profile") {
      const { data } = await api.put("/profile", params.data);
      return { data: { ...data, id: "profile" } as RecordType };
    }

    // Event
    if (resource === "events") {
      const res = await api.put(`/admin/events/edit/${params.id}`, params.data);
      return { data: { ...res.data.event, id: params.id.toString() } as RecordType };
    }

    // Member
    if (resource === "members") {
      const res = await api.put(`/admin/members/${params.id}`, params.data);
      return { data: { id: String(res.data.id), ...res.data } as RecordType };
    }

    // Attendance - cập nhật 1 registration
    if (resource === "registrations") {
      const { id, data } = params;
      const updates = [{ registrationId: id, ...data }];
      await api.put("/admin/events/registrations/update-status", { updates });
      const updatedRecord = { ...params.previousData, ...data, id } as RecordType;
      return { data: updatedRecord };
    }

    throw new Error(`update not implemented for resource: ${resource}`);
  },

  // ===== DELETE =====
  delete: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<DeleteResult<RecordType>> => {
    const user = getUser();

    // Event / cancel registration
    if (
      resource === "events" ||
      resource === "upcoming-events" ||
      resource === "member-events" ||
      resource === "event-register"
    ) {
      if (resource === "events") {
        if (!user || user.role !== "ADMIN") throw new Error("Only admin can delete events");
        await api.delete(`/admin/events/delete/${params.id}`);
        return { data: params.previousData as RecordType };
      }
      await api.delete(`/event/${params.id}/register`);
      return { data: { id: params.id } as unknown as RecordType };
    }

    // Member
    if (resource === "members") {
      const res = await api.delete(`/admin/members/${params.id}`);
      return { data: { id: String(res.data.id), ...res.data } };
    }

    // Attendance - hủy đăng ký
    if (resource === "registrations") {
      //const { memberId, eventId } = params.previousData;
      const memberId = params.previousData?.memberId;
      const eventId = params.previousData?.eventId;
      if (!memberId || !eventId) throw new Error("Missing memberId or eventId in previousData");
      const res = await api.delete(`/admin/member/registrations/${memberId}/${eventId}`);
      return { data: { id: eventId, ...res.data } as unknown as RecordType };
    }

    throw new Error(`delete not implemented for resource: ${resource}`);
  },

  // ===== UPDATE MANY =====
  updateMany: async (resource: string, params: UpdateManyParams) => {
    if (resource === "registrations") {
      const updates = params.ids.map((id) => ({ registrationId: id, ...params.data }));
      await api.put("/admin/events/registrations/update-status", { updates });
      return { data: params.ids };
    }
    throw new Error(`updateMany not implemented for resource: ${resource}`);
  },

  // ===== DELETE MANY =====
  deleteMany: async (resource: string, params: any) => {
    const user = getUser();
    if (resource === "events" || resource === "upcoming-events") {
      if (!user || user.role !== "ADMIN") throw new Error("Only admin can delete events");
      await Promise.all(
        params.ids.map((id: string) =>
          api.delete(`/admin/events/delete/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === "registrations") {
      await Promise.all(
        params.ids.map((id: string) =>
          api.put("/admin/events/registrations/update-status", {
            updates: [{ registrationId: id, ...params.data }],
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === "members") {
      await Promise.all(params.ids.map((id: string) => api.delete(`/admin/members/${id}`)));
      return { data: params.ids };
    }

    throw new Error(`deleteMany not implemented for resource: ${resource}`);
  },

  // ===== GET MANY REFERENCE =====
  getManyReference: async (resource: string, params: GetManyReferenceParams) => {
    if (resource === "registrations" && params.target === "memberId") {
      const memberId = params.id;
      const res = await api.get(`/admin/member/registrations/${memberId}`);
      const registrations = res.data?.registrations || res.data || [];
      return { data: registrations.map((r: any) => ({ id: r.id, ...r })), total: registrations.length };
    }
    throw new Error(`getManyReference not implemented for resource: ${resource}`);
  },

  // ===== GET MANY =====
  getMany: async () => ({ data: [] }),

  // ===== SPECIAL METHOD: CHANGE PASSWORD =====
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put("/profile/password", { currentPassword, newPassword });
    return data;
  },
};

export default dataProvider;
