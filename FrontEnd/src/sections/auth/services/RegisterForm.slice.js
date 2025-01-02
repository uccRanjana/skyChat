import { apiSlice } from "../../../services/apiSlice";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies

export const registerform = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetUsers: builder.query({
      query: (userId) => ({
        url: `/v1/chats/list/${userId}`,
        method: "GET",
      }),
    }),

    RegisterUser: builder.mutation({
      query: (user) => ({
        url: `/v1/auth/signup`,
        method: "POST",
        body: user,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    LoginUser: builder.mutation({
      query: (user) => ({
        url: `v1/auth/login`,
        method: "POST",
        body: user,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // Get the response data
          const { token, userId } = data;

          if (token) {
            Cookies.set("token", token, {
              expires: 1, // Cookie will expire in 1 day
              secure: process.env.NODE_ENV === "production", // Secure flag in production
              httpOnly: false, // Client-side accessible
            });
          }

          if (userId) {
            Cookies.set("userId", userId, {
              expires: 1, // Same expiry as token
              secure: process.env.NODE_ENV === "production",
              httpOnly: false,
            });
          }
        } catch (error) {
          console.error("Login failed", error);
        }
      },
    }),
    
    getConversation: builder.query({
      query: ({ userId,chatId }) => ({
        url: `/v1/chats/conversation/${chatId}?userId=${userId}`, // Include userId as a query parameter
        method: 'GET',
      }),
    }),
    

    // New Search Users API
    SearchUsers: builder.query({
      query: (searchQuery) => ({
        url: `/v1/auth/search?query=${searchQuery}`,
        method: "GET",
      }),
    }),
    
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useSearchUsersQuery,
  useGetConversationQuery, // Export search users query hook
} = registerform;