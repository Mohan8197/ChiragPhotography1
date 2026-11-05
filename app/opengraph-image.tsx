
import { ImageResponse } from "next/og";
import { studio } from "@/data/site";

export const alt = `${studio.name} — ${studio.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
          color: "#F4F1EC",
          background: "#141413",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 6 }}>
          Wedding &amp; event photography — Bengaluru
        </div>
        <div style={{ fontSize: 120, marginTop: 16 }}>
          {studio.shortName}
        </div>
        <div style={{ fontSize: 34, marginTop: 12 }}>
          {studio.tagline}
        </div>
      </div>
    ),
    size
  );
}
