"use server";

export type InquiryField = "name" | "email" | "eventType" | "date" | "location" | "guests" | "message";

export interface InquiryState {
  status: "idle" | "error" | "success";
  errors?: Partial<Record<InquiryField, string>>;
  values?: Partial<Record<InquiryField, string>>;
  firstName?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the inquiry form. To actually deliver inquiries, send `values`
 * with your email/CRM provider where marked below (see README → "Contact form").
 */
export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // Honeypot: real visitors never fill this hidden field.
  if (String(formData.get("company") ?? "")) return { status: "success", firstName: "" };

  const read = (key: InquiryField) => String(formData.get(key) ?? "").trim().slice(0, 2000);
  const values = {
    name: read("name"),
    email: read("email"),
    eventType: read("eventType"),
    date: read("date"),
    location: read("location"),
    guests: read("guests"),
    message: read("message"),
  };

  const errors: InquiryState["errors"] = {};
  if (!values.name) errors.name = "Please tell us your name.";
  if (!EMAIL.test(values.email)) errors.email = "Please enter a valid email address.";
  if (!values.eventType) errors.eventType = "Please choose an event type.";
  if (values.guests && !/^\d{1,5}$/.test(values.guests)) errors.guests = "Guest count should be a number.";
  if (values.message.length < 10) errors.message = "A few words about your plans, please.";

  if (Object.keys(errors).length) return { status: "error", errors, values };

  // → Deliver `values` here (e.g. Resend, Formspree, HubSpot).

  return { status: "success", firstName: values.name.split(" ")[0] };
}
