import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("CHECK AUTH RESPONSE:", res.data);
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      onsole.log("Success message");
      toast.success("Accout created successfully");
    } catch (error) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Something went wrong. Please try again";
      toast.error(msg);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
