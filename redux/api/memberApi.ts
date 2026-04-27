import { baseApi } from "./baseApi";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
}

export interface MemberResponse {
  success: boolean;
  data: Event[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMembers: builder.query<
      MemberResponse,
      { adminApprovedStatus: string; page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10, adminApprovedStatus = "" }) => ({
        url: `admin/members?page=${page}&limit=${limit}&adminApprovedStatus=${adminApprovedStatus}`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),

    approvedMember: builder.mutation({
      query: (id) => ({
        url: `/admin/members/approve-member/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Events"],
    }),

    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/admin/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
    rejectMember: builder.mutation({
      query: (id) => ({
        url: `/admin/members/reject-member/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Events"],
    }),
    getAllmembersByUser: builder.query({
      query: () => ({
        url: `/members`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
  }),
});

export const {
  useGetAllMembersQuery,
  useDeleteMemberMutation,
  useRejectMemberMutation,
  useApprovedMemberMutation,
  useGetAllmembersByUserQuery,
} = memberApi;
