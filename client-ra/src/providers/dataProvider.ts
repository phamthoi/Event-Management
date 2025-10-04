// src/providers/dataProvider.ts
import profileDataProvider from "./profileDataProvider"; // file cũ của bạn
import eventDataProvider from "./eventDataProvider";     // file events
import { DataProvider, GetListParams, GetOneParams, UpdateParams, CreateParams, DeleteParams } from "react-admin";

const dataProvider: DataProvider = {
  getList: async (resource, params: GetListParams) => {
    if (resource === "events") return eventDataProvider.getList(resource, params);
    return profileDataProvider.getList(resource, params);
  },

  getOne: async (resource, params: GetOneParams) => {
    if (resource === "events") return eventDataProvider.getOne(resource, params);
    return profileDataProvider.getOne(resource, params);
  },

  create: async (resource, params: CreateParams) => {
    if (resource === "events") return eventDataProvider.create(resource, params);
    return profileDataProvider.create(resource, params);
  },

  update: async (resource, params: UpdateParams) => {
    if (resource === "events") return eventDataProvider.update(resource, params);
    return profileDataProvider.update(resource, params);
  },

  delete: async (resource, params: DeleteParams<any>) => {
    if (resource === "events") return eventDataProvider.delete(resource, params);
    return profileDataProvider.delete(resource, params);
  },

  deleteMany: async (resource, params) => {
    if (resource === "events") return eventDataProvider.deleteMany(resource, params);
    return profileDataProvider.deleteMany(resource, params);
  },

  getMany: async (resource, params) => {
    if (resource === "events" && eventDataProvider.getMany) return eventDataProvider.getMany(resource, params);
    return profileDataProvider.getMany(resource, params);
  },

  getManyReference: async (resource, params) => {
    if (resource === "events" && eventDataProvider.getManyReference) return eventDataProvider.getManyReference(resource, params);
    return profileDataProvider.getManyReference(resource, params);
  },

  updateMany: async (resource, params) => {
    if (resource === "events" && eventDataProvider.updateMany) return eventDataProvider.updateMany(resource, params);
    return profileDataProvider.updateMany(resource, params);
  },
};

export default dataProvider;
