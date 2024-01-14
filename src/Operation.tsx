import {Button, Container, Grid, Stack} from "@mui/material";
import {invoke} from "@tauri-apps/api/tauri";
import EmergencyStop from "./EmergencyStop.tsx";

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

    return (
        <Container>
            <Stack spacing={1}>
                <Grid
                    container
                    direction={"row"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                >
                    <Grid item xs={4}>
                        <Button
                            variant={"contained"}
                            color={"success"}
                            onClick={onStartHandle}
                            fullWidth
                        >
                            Start
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant={"contained"}
                            color={"error"}
                            onClick={onStopHandle}
                            fullWidth
                        >
                            Stop
                        </Button>
                    </Grid>
                </Grid>

                <EmergencyStop/>
            </Stack>
        </Container>
    )
}