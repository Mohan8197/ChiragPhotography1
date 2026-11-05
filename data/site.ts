/** Studio-wide copy. Edit here to rebrand the site. */

export const studio = {
  name: "Chirag Photography",
  shortName: "Chirag Photography",
  tagline: "Every celebration, beautifully captured.",
  description: "Chirag Photography captures weddings, pre-wedding sessions, birthdays and all kinds of events in Bengaluru and beyond.",
  founded: 2020,
  base: "Bengaluru",
  reach: "Karnataka & beyond",
  email: "Contact us on WhatsApp",
  phone: "+91 90363 43493",
  address: ["Bengaluru, Karnataka, India"],
  availability: "Now accepting bookings for weddings, birthdays and all events in Bengaluru.",
  instagram: { handle: "@chirag__photography.__", url: "https://www.instagram.com/chirag__photography.__/" },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohan8197.github.io/Chirag/",
} as const;

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Journal", href: "/#journal" },
  { label: "Contact", href: "/#contact" },
] as const;

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/chirag__photography.__/" },
  { label: "WhatsApp", href: "https://wa.me/919036343493" },
] as const;

/** `*words*` render as italic serif emphasis. */
export const intro =
  "We capture the celebrations that become family stories — *weddings, birthdays and every meaningful gathering* — with a candid eye and care for every detail.";

export const about = {
  heading: ["Chirag", "Photography."],
  paragraphs: [
    "Chirag Photography is a Bengaluru-based photography service covering weddings, pre-wedding sessions, birthdays, engagements, family celebrations and all kinds of events.",
    "Our approach is simple: capture genuine emotions, thoughtful details and the moments that make every celebration personal. Get in touch to discuss your event and photography requirements.",
    "Bengaluru, Karnataka, India · WhatsApp: +91 90363 43493",
  ],
  stats: [
    { value: "01", label: "Personal approach" },
    { value: "All", label: "Types of events" },
    { value: "BLR", label: "Based in Bengaluru" },
  ],
  press: ["Weddings", "Pre-weddings", "Birthdays", "Engagements", "Family Events", "Celebrations"],
  awards: [],
} as const;

export const testimonials = [
  { quote: "Every celebration has a story. We focus on the people, details and candid moments that make yours unique.", author: "Chirag Photography", event: "Our approach", place: "Bengaluru" },
  { quote: "From the first moments to the final celebration, our aim is to create photographs you will enjoy revisiting.", author: "Chirag Photography", event: "Our promise", place: "All events" },
  { quote: "Tell us about your plans, your venue and the moments that matter most. We will help plan the coverage around your event.", author: "Chirag Photography", event: "Let's plan", place: "Bengaluru" },
] as const;
