// src/services/dataProvider/statsDataProvider.ts
import api from "../services/axios";

const statsDataProvider = {
  getList: async (resource: string) => {
    switch (resource) {
      case "dashboardStats": {
        const response = await api.get("/admin/stats/dashboard");
        return { data: [{ id: 1, ...response.data }], total: 1 }; // admin
      }
      case "memberStats": {
        const response = await api.get("/member/stats/dashboard");
        return { data: [{ id: 1, ...response.data.data }], total: 1 }; // member
      }
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getOne: async (resource: string, params: { id: string | number }) => {
    switch (resource) {
      case "dashboardStats": {
        const response = await api.get("/admin/stats/dashboard");
        return { data: { id: params.id, ...response.data } };
      }
      case "memberStats": {
        const response = await api.get("/member/stats/dashboard");
        return { data: { id: params.id, ...response.data.data } };
      }
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },
};

export default statsDataProvider;
