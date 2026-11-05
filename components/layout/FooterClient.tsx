"use client";

import { useSyncExternalStore } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { scrollTo } from "@/lib/scroll";

const londonTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
});

function subscribeMinute(onTick: () => void) {
  const id = window.setInterval(onTick, 15_000);
  return () => window.clearInterval(id);
}

/** Local time in Bengaluru (blank until hydrated). */
export function LocalTime() {
  const time = useSyncExternalStore(
    subscribeMinute,
    () => londonTime.format(new Date()),
    () => "",
  );
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time || "--:--"}
    </span>
  );
}

export function BackToTop() {
  return (
    <Magnetic strength={0.45}>
      <button
        type="button"
        onClick={() => scrollTo(0)}
        className="group flex size-24 flex-col items-center justify-center gap-1 rounded-full border border-paper/25 transition-colors duration-500 hover:border-champagne hover:bg-champagne hover:text-ink md:size-28"
      >
        <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-1">
          ↑
        </span>
        <span className="label">Top</span>
        <span className="sr-only">Back to top</span>
      </button>
    </Magnetic>
  );
}
