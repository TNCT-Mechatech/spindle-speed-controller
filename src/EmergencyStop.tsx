import {invoke} from "@tauri-apps/api/tauri";
import {Typography} from "@mui/material";

export default function EmergencyStop() {

    const onEmergencyStopHandle = () => {
        invoke("emergency_stop").then((res) => {
            console.log(res)
        })
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "10px",
            }}>
            <Typography variant={"h6"}>
                ↓ 緊急停止 ↓
            </Typography>
            <div
                style={{
                    display: "flex",
                    padding: "20px",
                    backgroundColor: "yellow",
                    borderRadius: "20px",
                    WebkitBoxShadow: "6px 6px 6px 0px rgba(0, 0, 0, 0.45)",
                }}
            >
                <div
                    onClick={onEmergencyStopHandle}
                    style={{
                        backgroundColor: "red",
                        borderRadius: "50%",
                        padding: "40px"
                    }}
                ></div>
            </div>

        </div>

    )
}