"use client";

import { useActionState, useRef, useState, type ReactNode } from "react";
import { submitInquiry, type InquiryField, type InquiryState } from "@/app/actions";
import { Magnetic } from "@/components/motion/Magnetic";
import { categories } from "@/data/categories";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

const inputClass =
  "w-full bg-transparent py-3 text-lg text-paper outline-none placeholder:text-paper/35 [color-scheme:dark]";

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: InquiryField;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="field" data-invalid={error ? "" : undefined}>
        <label htmlFor={id} className="label block pt-2 text-stone">
          {label}
        </label>
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#e7957f]">
          {error}
        </p>
      )}
    </div>
  );
}

function Form({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const successRef = useRef<HTMLDivElement>(null);
  const e = state.errors ?? {};
  const v = state.values ?? {};
  const a11y = (id: InquiryField) => ({
    id,
    name: id,
    "aria-invalid": e[id] ? true : undefined,
    "aria-describedby": e[id] ? `${id}-error` : undefined,
    defaultValue: v[id],
  });

  useGSAP(
    () => {
      if (state.status !== "success" || prefersReducedMotion()) return;
      gsap.from("[data-success-line]", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.1 });
    },
    { dependencies: [state.status], scope: successRef },
  );

  if (state.status === "success") {
    return (
      <div ref={successRef} role="status" className="flex min-h-[28rem] flex-col justify-center">
        <div className="overflow-hidden">
          <p data-success-line className="font-serif text-h2">
            Thank you{state.firstName ? `, ${state.firstName}` : ""}.
          </p>
        </div>
        <div className="mt-6 overflow-hidden">
          <p data-success-line className="max-w-[44ch] text-lg text-paper/80">
            Your inquiry is with us. Expect a personal reply within two working days — usually sooner.
          </p>
        </div>
        <button type="button" onClick={onReset} className="label u-link mt-10 w-fit">
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
      <Field id="name" label="Your name" error={e.name}>
        <input type="text" autoComplete="name" required className={inputClass} {...a11y("name")} />
      </Field>
      <Field id="email" label="Email" error={e.email}>
        <input type="email" autoComplete="email" required className={inputClass} {...a11y("email")} />
      </Field>
      <Field id="eventType" label="Event type" error={e.eventType}>
        <select required className={cn(inputClass, "appearance-none")} {...a11y("eventType")} defaultValue={v.eventType ?? ""}>
          <option value="" disabled className="bg-charcoal">
            Select…
          </option>
          {categories.map((c) => (
            <option key={c.slug} value={c.label} className="bg-charcoal">
              {c.label}
            </option>
          ))}
          <option value="Other" className="bg-charcoal">
            Something else
          </option>
        </select>
      </Field>
      <Field id="date" label="Event date" error={e.date}>
        <input type="date" className={inputClass} {...a11y("date")} />
      </Field>
      <Field id="location" label="Location" error={e.location}>
        <input type="text" placeholder="City or venue" className={inputClass} {...a11y("location")} />
      </Field>
      <Field id="guests" label="Guest count" error={e.guests}>
        <input type="number" inputMode="numeric" min={1} placeholder="Approx." className={inputClass} {...a11y("guests")} />
      </Field>
      <Field id="message" label="Tell us about it" error={e.message} className="md:col-span-2">
        <textarea rows={4} required className={cn(inputClass, "resize-none")} {...a11y("message")} />
      </Field>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-center justify-between gap-6 md:col-span-2">
        <p className="max-w-[32ch] text-sm text-paper/60">We reply personally to every inquiry within two working days.</p>
        <Magnetic strength={0.4}>
          <button
            type="submit"
            disabled={pending}
            className="grid size-32 place-items-center rounded-full bg-paper text-ink transition-colors duration-500 hover:bg-champagne disabled:opacity-60 md:size-36"
          >
            <span className="label">{pending ? "Sending…" : "Send inquiry"}</span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
}

export function InquiryForm() {
  const [key, setKey] = useState(0);
  return <Form key={key} onReset={() => setKey((k) => k + 1)} />;
}
