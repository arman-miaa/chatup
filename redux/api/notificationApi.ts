/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    sendNotification: builder.mutation({
      query: (data: any) => ({
        url: "/notification/send-notification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getAllEventByNotification: builder.query({
      query: () => ({
        url: "/notification/event",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    recentActivities: builder.query({
      query: () => ({
        url: "/recent-activities/admin/recent-activities",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getMyNotifications: builder.query({
      query: () => ({
        url: "/notification/my-notifications",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useSendNotificationMutation,
  useGetAllEventByNotificationQuery,
  useRecentActivitiesQuery,
  useGetMyNotificationsQuery,
} = notificationApi;
