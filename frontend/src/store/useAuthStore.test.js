import { beforeEach, describe, expect, it, vi } from "vitest";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

vi.mock("../lib/axios.js", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      authUser: null,
      isCheckingAuth: true,
      isSigningUp: false,
      isLoggingIn: false,
    });
  });

  it("initializes isLoggingIn to false", () => {
    expect(useAuthStore.getState().isLoggingIn).toBe(false);
  });

  describe("login", () => {
    it("sets isLoggingIn to true while the request is in flight", async () => {
      let resolvePost;
      axiosInstance.post.mockReturnValue(
        new Promise((resolve) => {
          resolvePost = resolve;
        }),
      );

      const loginPromise = useAuthStore.getState().login({
        email: "jane@example.com",
        password: "secret123",
      });

      expect(useAuthStore.getState().isLoggingIn).toBe(true);

      resolvePost({ data: { _id: "1", email: "jane@example.com" } });
      await loginPromise.catch(() => {});

      expect(useAuthStore.getState().isLoggingIn).toBe(false);
    });

    it("posts the submitted credentials to /auth/login", async () => {
      axiosInstance.post.mockResolvedValue({
        data: { _id: "1", email: "jane@example.com" },
      });
      const credentials = { email: "jane@example.com", password: "secret123" };

      await useAuthStore.getState().login(credentials).catch(() => {});

      expect(axiosInstance.post).toHaveBeenCalledWith("/auth/login", credentials);
    });

    it("stores the returned user and shows a success toast on success", async () => {
      const userData = { _id: "1", email: "jane@example.com" };
      axiosInstance.post.mockResolvedValue({ data: userData });

      // NOTE: the current implementation calls `get().connectSocket()` but
      // `get` is never destructured from the zustand creator, so a
      // successful login currently rejects with a ReferenceError/TypeError
      // once it reaches that line. This test pins down that existing
      // behaviour: the user/toast updates that happen *before* the crash
      // still take effect.
      await expect(
        useAuthStore.getState().login({
          email: "jane@example.com",
          password: "secret123",
        }),
      ).rejects.toThrow();

      expect(useAuthStore.getState().authUser).toEqual(userData);
      expect(toast.success).toHaveBeenCalledWith("Logged in successfully");
      expect(useAuthStore.getState().isLoggingIn).toBe(false);
    });

    it("shows an error toast with the server message when login fails", async () => {
      axiosInstance.post.mockRejectedValue({
        response: { data: { message: "Invalid credentials" } },
      });

      await useAuthStore.getState().login({
        email: "jane@example.com",
        password: "wrong-password",
      });

      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
      expect(useAuthStore.getState().authUser).toBeNull();
    });

    it("resets isLoggingIn to false even when the request fails", async () => {
      axiosInstance.post.mockRejectedValue({
        response: { data: { message: "Server error" } },
      });

      await useAuthStore.getState().login({
        email: "jane@example.com",
        password: "wrong-password",
      });

      expect(useAuthStore.getState().isLoggingIn).toBe(false);
    });
  });

  describe("logout", () => {
    it("posts to /auth/logout and clears the authenticated user", async () => {
      useAuthStore.setState({
        authUser: { _id: "1", email: "jane@example.com" },
      });
      axiosInstance.post.mockResolvedValue({});

      await useAuthStore.getState().logout();

      expect(axiosInstance.post).toHaveBeenCalledWith("/auth/logout");
      expect(useAuthStore.getState().authUser).toBeNull();
      expect(toast.success).toHaveBeenCalledWith("Logged out successfully");
    });

    it("also surfaces an error toast due to the unimplemented socket disconnect", async () => {
      // Same root cause as the login test above: `get().disconnectSocket()`
      // throws because `get` isn't available in this store, so the catch
      // block runs even though the logout request itself succeeded.
      useAuthStore.setState({
        authUser: { _id: "1", email: "jane@example.com" },
      });
      axiosInstance.post.mockResolvedValue({});

      await useAuthStore.getState().logout();

      expect(toast.error).toHaveBeenCalledWith("Error logging out");
    });

    it("keeps the previous auth user and shows only an error toast when the request fails", async () => {
      const currentUser = { _id: "1", email: "jane@example.com" };
      useAuthStore.setState({ authUser: currentUser });
      axiosInstance.post.mockRejectedValue(new Error("network down"));

      await useAuthStore.getState().logout();

      expect(toast.error).toHaveBeenCalledWith("Error logging out");
      expect(toast.success).not.toHaveBeenCalled();
      expect(useAuthStore.getState().authUser).toEqual(currentUser);
    });
  });
});