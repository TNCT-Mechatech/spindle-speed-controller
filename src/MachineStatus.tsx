import {Box, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {invoke} from "@tauri-apps/api/tauri";
import {useAsync, useInterval} from "react-use";
import {useState} from "react";

export default function MachineStatus() {
    const [spindleState, setSpindleState] = useState<SpindleState>({
        State: "Offline",
        Direction: false,
        TargetSpeed: 0,
        Speed: 0,
        Power: 0,
    })

    useAsync(async () => {
        const state = await getSpindleState()
        setSpindleState(state)
    })

    useInterval(async () => {
        getSpindleState()
            .then(state => setSpindleState(state))
            .catch(() => setSpindleState({
                State: "Offline",
                Direction: false,
                TargetSpeed: 0,
                Speed: 0,
                Power: 0,
            }))
    }, 500)

    return (
        <Stack>
            <Card>
                <CardContent>
                    <Stack spacing={1}>
                        <Box>
                            <Typography variant={"h6"}>
                                Status:
                            </Typography>
                            <Typography
                                variant={"body1"}
                                color={getStateColor(spindleState.State)}
                            >
                                {spindleState.State}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant={"h6"}>
                                Target Speed:
                            </Typography>
                            <Typography
                                variant={"body1"}
                                color={"gray"}
                            >
                                {spindleState.Direction ? "Reverse" : "Forward"} {spindleState.TargetSpeed} [RPM]
                            </Typography>
                        </Box>
                        <Grid
                            container
                            direction={"row"}
                            justifyContent={"space-between"}
                        >
                            <Grid item xs={5}>
                                <Typography variant={"h6"}>
                                    Current Speed:
                                </Typography>
                                <Typography
                                    variant={"body1"}
                                    color={"gray"}
                                >
                                    {spindleState.Speed} [RPM]
                                </Typography>
                            </Grid>

                            <Grid item xs={5}>
                                <Typography variant={"h6"}>
                                    Current Power:
                                </Typography>
                                <Typography
                                    variant={"body1"}
                                    color={"gray"}
                                >
                                    {spindleState.Power} [%]
                                </Typography>
                            </Grid>
                        </Grid>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}

type SpindleState = {
    State: "Stopped" | "Running" | "EmergencyStop" | "Error" | "Offline",
    Direction: boolean,
    TargetSpeed: number,
    Speed: number,
    Power: number,
}

const getSpindleState = async (): Promise<SpindleState> => {
    return invoke("get_spindle_state")
}

const getStateColor = (state: SpindleState["State"]) => {
    switch (state) {
        case "Stopped":
            return "red"
        case "Running":
            return "green"
        case "EmergencyStop":
            return "orange"
        case "Error":
            return "orange"
        case "Offline":
            return "grey"
    }
}