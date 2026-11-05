import { ImageResponse } from "next/og";
import { studio } from "@/data/site";

export const alt = `${studio.name} — ${studio.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#141413" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 64,
            color: "#F4F1EC",
            background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.65) 100%)",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
            Wedding &amp; event photography — Bengaluru
          </div>
          <div style={{ fontSize: 120, lineHeight: 1, marginTop: 16, fontFamily: "serif" }}>{studio.shortName}</div>
          <div style={{ fontSize: 34, marginTop: 12, fontStyle: "italic", fontFamily: "serif" }}>{studio.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
