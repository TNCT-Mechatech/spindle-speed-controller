import {Button, Container, Stack} from "@mui/material";
import {invoke} from "@tauri-apps/api/tauri";

export default function Operation() {

    const onStartHandle = () => {
        invoke("start_spindle").then((res) => {
            console.log(res)
        })
    }

    const onStopHandle = () => {
        invoke("stop_spindle").then((res) => {
            console.log(res)
        })
    }

    const onEmergencyStopHandle = () => {
        invoke("emergency_stop").then((res) => {
            console.log(res)
        })
    }

    return (
        <Container>
            <Stack spacing={4}>
                <Button
                    variant={"contained"}
                    color={"success"}
                    onClick={onStartHandle}
                >
                    Start
                </Button>

                <Button
                    variant={"contained"}
                    color={"error"}
                    onClick={onStopHandle}
                >
                    Stop
                </Button>

                <Button
                    variant={"contained"}
                    color={"warning"}
                    onClick={onEmergencyStopHandle}
                >
                    Emergency Stop
                </Button>
            </Stack>
        </Container>
    )
}