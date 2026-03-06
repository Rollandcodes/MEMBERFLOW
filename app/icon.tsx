import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
    width: 512,
    height: 512,
};

export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "#16213e",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        color: "white",
                        fontSize: 260,
                        fontWeight: "bold",
                    }}
                >
                    MF
                </div>
            </div>
        ),
        { ...size }
    );
}
