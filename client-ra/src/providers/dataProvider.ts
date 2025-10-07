// src/providers/dataProvider.ts
import profileDataProvider from "./profileDataProvider";
import eventDataProvider from "./eventDataProvider";
import memberDataProvider from "./memberDataProvider";
import statsDataProvider from "./statsDataProvider";
import attendanceDataProvider from "./attendanceDataProvider";

import {
  DataProvider,
  GetListParams,
  GetOneParams,
  UpdateParams,
  CreateParams,
  DeleteParams,
  DeleteResult,
  RaRecord,
} from "react-admin";

const dataProvider: DataProvider = {
  // 🟢 GET LIST
  getList: async (resource, params: GetListParams) => {
    if (
      resource === "events" ||
      resource === "upcoming-events" ||
      resource === "member-events"
    ) {
      return eventDataProvider.getList(resource, params);
    }

    // Dữ liệu liên quan điểm danh / đăng ký
    if (resource === "registrations" || resource === "attendance-events") {
      return attendanceDataProvider.getList(resource, params);
    }

    if (resource === "members" || resource === "membersPublic") {
      return memberDataProvider.getList(resource, params);
    }

    if (resource === "dashboardStats" || resource === "memberStats") {
      return statsDataProvider.getList(resource);
    }

    return profileDataProvider.getList(resource, params);
  },

  // 🟢 GET ONE
  getOne: async (resource, params: GetOneParams) => {
    if (
      resource === "events" ||
      resource === "upcoming-events" ||
      resource === "member-events"
    ) {
      return eventDataProvider.getOne(resource, params);
    }

    if (resource === "registrations" || resource === "attendance-events") {
      // hiện tại attendanceDataProvider chưa có getOne nên reject
      return attendanceDataProvider.getOne(resource, params);
    }

    if (resource === "members" || resource === "membersPublic") {
      return memberDataProvider.getOne(resource, params);
    }

    if (resource === "dashboardStats" || resource === "memberStats") {
      return statsDataProvider.getOne(resource, params);
    }

    return profileDataProvider.getOne(resource, params);
  },

  // 🟢 CREATE
  create: async (resource, params: CreateParams) => {
    if (
      resource === "events" ||
      resource === "upcoming-events" ||
      resource === "event-register" ||
      resource === "member-events"
    ) {
      return eventDataProvider.create(resource, params);
    }

    if (resource === "registrations" || resource === "attendance-events") {
      return attendanceDataProvider.create(resource, params);
    }

    if (resource === "members") {
      return memberDataProvider.create(resource, params);
    }

    return profileDataProvider.create(resource, params);
  },

  // 🟢 UPDATE
  update: async (resource, params: UpdateParams) => {
    if (resource === "events") {
      return eventDataProvider.update(resource, params);
    }

    if (resource === "registrations" || resource === "attendance-events") {
      return attendanceDataProvider.update(resource, params);
    }

    if (resource === "members") {
      return memberDataProvider.update(resource, params);
    }

    return profileDataProvider.update(resource, params);
  },

  // 🟢 DELETE
  delete: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<DeleteResult<RecordType>> => {
    if (
      resource === "events" ||
      resource === "upcoming-events" ||
      resource === "member-events" ||
      resource === "event-register"
    ) {
      return (await eventDataProvider.delete(
        resource,
        params
      )) as DeleteResult<RecordType>;
    }

    if (resource === "registrations" || resource === "attendance-events") {
      return (await attendanceDataProvider.delete(
        resource,
        params
      )) as DeleteResult<RecordType>;
    }

    if (resource === "members") {
      return (await memberDataProvider.delete(
        resource,
        params
      )) as DeleteResult<RecordType>;
    }

    return (await profileDataProvider.delete(
      resource,
      params
    )) as DeleteResult<RecordType>;
  },

  // 🟢 DELETE MANY
  deleteMany: async <RecordType extends RaRecord = any>(
    resource: string,
    params: any
  ): Promise<{ data: any[] }> => {
    if (resource === "events" || resource === "upcoming-events") {
      await eventDataProvider.deleteMany(resource, params);
      return { data: params.ids };
    }

    if (resource === "registrations" || resource === "attendance-events") {
      await attendanceDataProvider.deleteMany(resource, params);
      return { data: params.ids };
    }

    if (resource === "members") {
      await memberDataProvider.deleteMany(resource, params);
      return { data: params.ids };
    }

    await profileDataProvider.deleteMany(resource, params);
    return { data: params.ids };
  },

  // 🟢 GET MANY
  getMany: async (resource, params) => {
    if (
      (resource === "events" || resource === "member-events") &&
      eventDataProvider.getMany
    )
      return eventDataProvider.getMany(resource, params);

    if (
      (resource === "registrations" || resource === "attendance-events") &&
      attendanceDataProvider.getMany
    )
      return attendanceDataProvider.getMany(resource, params);

    if (resource === "members" && memberDataProvider.getMany)
      return memberDataProvider.getMany(resource, params);

    return profileDataProvider.getMany(resource, params);
  },

  // 🟢 GET MANY REFERENCE
  getManyReference: async (resource, params) => {
    if (
      (resource === "events" || resource === "member-events") &&
      eventDataProvider.getManyReference
    )
      return eventDataProvider.getManyReference(resource, params);

    if (
      (resource === "registrations" || resource === "attendance-events") &&
      attendanceDataProvider.getManyReference
    )
      return attendanceDataProvider.getManyReference(resource, params);

    if (resource === "members" && memberDataProvider.getManyReference)
      return memberDataProvider.getManyReference(resource, params);

    return profileDataProvider.getManyReference(resource, params);
  },

  // 🟢 UPDATE MANY
  updateMany: async (resource, params) => {
    if (
      (resource === "events" || resource === "member-events") &&
      eventDataProvider.updateMany
    )
      return eventDataProvider.updateMany(resource, params);

    if (
      (resource === "registrations" || resource === "attendance-events") &&
      attendanceDataProvider.updateMany
    )
      return attendanceDataProvider.updateMany(resource, params);

    if (resource === "members" && memberDataProvider.updateMany)
      return memberDataProvider.updateMany(resource, params);

    return profileDataProvider.updateMany(resource, params);
  },
};

export default dataProvider;
