import { ImageResponse } from "next/og";

// Size matches the requirement
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
                    background: "linear-gradient(to bottom right, #1a1a2e, #16213e)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "20%",
                }}
            >
                <div
                    style={{
                        color: "white",
                        fontSize: 260,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    MF
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
