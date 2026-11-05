import { ImageResponse } from "next/og";

export const alt = "Chirag Photography - Bengaluru";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#171512",
          color: "#ffffff",
          fontSize: 76,
        }}
      >
        <div>CHIRAG PHOTOGRAPHY</div>
        <div style={{ fontSize: 30, marginTop: 24 }}>
          Weddings • Birthdays • Events • Bengaluru
        </div>
      </div>
    ),
    size
  );
}
