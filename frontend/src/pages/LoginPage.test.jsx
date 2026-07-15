import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../store/useAuthStore";
import LoginPage from "./LoginPage";

vi.mock("../store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  const loginMock = vi.fn();

  beforeEach(() => {
    loginMock.mockReset();
    useAuthStore.mockReturnValue({ login: loginMock, isLoggingIn: false });
  });

  it("renders the email and password fields with a submit button", () => {
    renderLoginPage();

    expect(screen.getByPlaceholderText("johndoe@gmail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("updates the email and password fields as the user types", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText("johndoe@gmail.com");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    await user.type(emailInput, "jane@example.com");
    await user.type(passwordInput, "secret123");

    expect(emailInput).toHaveValue("jane@example.com");
    expect(passwordInput).toHaveValue("secret123");
  });

  it("calls login with the current form data on submit", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByPlaceholderText("johndoe@gmail.com"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(loginMock).toHaveBeenCalledWith({
      email: "jane@example.com",
      password: "secret123",
    });
  });

  it("submits the form (and calls login) even with empty fields, without a page reload", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(loginMock).toHaveBeenCalledWith({ email: "", password: "" });
  });

  it("disables the submit button and shows a loading spinner while logging in", () => {
    useAuthStore.mockReturnValue({ login: loginMock, isLoggingIn: true });
    renderLoginPage();

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });

  it("enables the submit button and shows the label when not logging in", () => {
    renderLoginPage();

    const button = screen.getByRole("button", { name: "Sign In" });
    expect(button).not.toBeDisabled();
  });

  it("renders a link to the signup page", () => {
    renderLoginPage();

    const link = screen.getByRole("link", {
      name: /don't have an account\? sign up/i,
    });
    expect(link).toHaveAttribute("href", "/signup");
  });

  it("renders the login illustration image referenced from the public folder", () => {
    renderLoginPage();

    const image = screen.getByAltText("People using mobile devices");
    expect(image).toHaveAttribute("src", "/login.png");
  });
});