import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";

export const sendWelcomeEmail = async (email, name, clientUrl) => {
  console.log("Inside sendWelcomeEmail");

  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: [email],
    subject: "Welcome to chat application",
    html: createWelcomeEmailTemplate(name, clientUrl),
  });

  console.log("Resend response:", { data, error });

  if (error) {
    throw error;
  }

  console.log("Email sent");
};
