import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../store/useAuthStore";
import ChatPage from "./ChatPage";

vi.mock("../store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("ChatPage", () => {
  const logoutMock = vi.fn();

  beforeEach(() => {
    logoutMock.mockReset();
    useAuthStore.mockReturnValue({ logout: logoutMock });
  });

  it("renders a logout button", () => {
    render(<ChatPage />);

    expect(screen.getByRole("button", { name: "logout" })).toBeInTheDocument();
  });

  it("does not call logout on render", () => {
    render(<ChatPage />);

    expect(logoutMock).not.toHaveBeenCalled();
  });

  it("calls logout when the logout button is clicked", () => {
    render(<ChatPage />);

    fireEvent.click(screen.getByRole("button", { name: "logout" }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it("calls logout again on subsequent clicks", () => {
    render(<ChatPage />);

    const button = screen.getByRole("button", { name: "logout" });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(logoutMock).toHaveBeenCalledTimes(2);
  });
});