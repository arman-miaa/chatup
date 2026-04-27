/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
}

export interface EventsResponse {
  success: boolean;
  data: Event[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/admin/events",
        method: "POST",
        body: credentials,
      }),
      // invalidatesTags: ["Events"],
    }),

    registerEvents: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/register-events",
        method: "POST",
        body: credentials,
      }),
      // invalidatesTags: ["Events"],
    }),

    getAllEvents: builder.query<
      EventsResponse,
      { page?: number; limit?: number; currentStatus?: string }
    >({
      query: ({ page = 1, limit = 8, currentStatus } = {}) => ({
        url: `/admin/events?page=${page}&limit=${limit}&status=${currentStatus}`,
        method: "GET",
      }),
      // providesTags: ["Events"],
    }),

    getSingleEvent: builder.query({
      query: (id) => ({
        url: `/admin/events/${id}`,
        method: "GET",
      }),
    }),
    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/events/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/admin/events/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["Events"],
    }),

    getUpcommingEvents: builder.query<EventsResponse, { searchDate?: string }>({
      query: ({ searchDate }) => ({
        url: `/events/upcoming-events${
          searchDate ? `?searchDate=${searchDate}` : ""
        }`,
        method: "GET",
      }),
    }),
    getSingleEventData: builder.query<EventsResponse, { id?: string }>({
      query: ({ id }) => ({
        url: `/events/${id}`,
        method: "GET",
      }),
    }),
    getEventStatus: builder.query({
      query: () => ({
        url: `/register-events/event-stats`,
        method: "GET",
      }),
    }),
    todayEvents: builder.query({
      query: () => ({
        url: `/events/today-events`,
        method: "GET",
      }),
    }),
    getAllSpeaker: builder.query({
      query: () => ({
        url: `/admin/speakers`,
        method: "GET",
      }),
    }),
    createSpeaker: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/speakers",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetAllEventsQuery,
  useGetSingleEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetUpcommingEventsQuery,
  useGetSingleEventDataQuery,
  useGetEventStatusQuery,
  useTodayEventsQuery,
  useRegisterEventsMutation,
  useGetAllSpeakerQuery,
  useCreateSpeakerMutation,
} = eventApi;
