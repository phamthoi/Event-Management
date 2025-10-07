// src/providers/eventDataProvider.ts
import api from "../services/axios";
import {
  DeleteResult,
  RaRecord,
  DataProvider,
  GetListParams,
  GetOneParams,
  UpdateParams,
  CreateParams,
  DeleteParams,
} from "react-admin";

// Giả sử lưu thông tin user trong localStorage
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const eventDataProvider: DataProvider = {
  // GET /list
  getList: async (resource: string, params: GetListParams) => {
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;

    const query: Record<string, any> = {
      page,
      limit: perPage,
      ...params.filter,
    };

    const queryString = new URLSearchParams(query as any).toString();

    let res;
    if (resource === "upcoming-events") {
      // API riêng cho upcoming events
      res = await api.get(`/event/upcoming?page=${page}&limit=${perPage}`);
    } else if (resource === "member-events") {
      // API lấy events đã đăng ký cho member
      res = await api.get(`/event`);
    } else {
      // API admin list
      res = await api.get(`/admin/events/list?${queryString}`);
    }

    const data = res.data.events
      ? res.data.events.map((ev: any) => ({ ...ev, id: ev.id.toString() }))
      : res.data.map((ev: any) => ({ ...ev, id: ev.id.toString() }));

    const total = res.data.total || data.length;

    return { data, total };
  },

  // GET /detail/:id
  getOne: async (resource: string, params: GetOneParams) => {
    let res;
    if (resource === "upcoming-events" || resource === "member-events") {
      res = await api.get(`/event/${params.id}`);
      return { data: { ...res.data, id: params.id } };
    } else {
      res = await api.get(`/admin/events/detail/${params.id}`);
      return { data: { ...res.data.event, id: params.id } };
    }
  },

  // POST /create hoặc POST /register
  create: async (resource: string, params: CreateParams) => {
    if (!params.data) throw new Error("Missing data in create");

    if (resource === "event-register") {
      const { eventId } = params.data;
      const res = await api.post(`/event/${eventId}/register`);
      return { data: { id: eventId, ...res.data } };
    } else if (resource === "events") {
      const res = await api.post("/admin/events/create", params.data);
      const eventData = res.data.event;
      return { data: { ...eventData, id: eventData.id.toString() } };
    }

    throw new Error(`Unknown create resource: ${resource}`);
  },

  // PUT /edit/:id
  update: async (resource: string, params: UpdateParams) => {
    if (resource === "events") {
      const res = await api.put(`/admin/events/edit/${params.id}`, params.data);
      return { data: { ...res.data.event, id: params.id.toString() } };
    }
    throw new Error(`Unknown update resource: ${resource}`);
  },

  // DELETE /delete/:id hoặc cancel registration
  delete: async <RecordType extends RaRecord>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<DeleteResult<RecordType>> => {
    if (resource === "events") {
      const user = getUser();
      if (!user || user.role !== "ADMIN") {
        throw new Error("Only admin can delete events");
      }
      await api.delete(`/admin/events/delete/${params.id}`);
      return { data: params.previousData as RecordType };
    }

    if (resource === "event-register" || resource === "member-events") {
      // cancel registration
      await api.delete(`/event/${params.id}/register`);
      return { data: { id: params.id } as unknown as RecordType };
    }

    return { data: params.previousData as RecordType };
  },

  // Bulk delete (admin only)
  deleteMany: async (resource: string, params: any) => {
    const user = getUser();
    if (!user || user.role !== "ADMIN") {
      throw new Error("Only admin can delete events");
    }

    try {
      await Promise.all(
        params.ids.map((id: string) =>
          api.delete(`/admin/events/delete/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
        )
      );
      return { data: params.ids };
    } catch (error: any) {
      console.error("Bulk delete failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Bulk delete failed");
    }
  },

  // Optional
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] }),
};

export default eventDataProvider;
