import {Box, Divider, Grid, Stack} from "@mui/material";
import TargetSetting from "./TargetSetting.tsx";
import Operation from "./Operation.tsx";
import MachineStatus from "./MachineStatus.tsx";
import SerialPortSelector from "./SerialPortSelector.tsx";

export default function Dashboard() {
    return (
        <Box mx={"10px"} my={"10px"}>
            <Grid container width={"100%"} spacing={1}>
                <Grid item width={"50%"}>
                    <Stack spacing={1}>
                        <SerialPortSelector/>
                        <MachineStatus/>
                    </Stack>
                </Grid>
                <Grid item width={"50%"}>
                    <Stack spacing={1}>
                        <TargetSetting/>
                        <Divider/>
                        <Operation/>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}