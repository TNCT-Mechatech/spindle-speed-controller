import {Box, Divider, Grid, Stack} from "@mui/material";
import TargetSetting from "./TargetSetting.tsx";
import Operation from "./Operation.tsx";

export default function Dashboard() {
    return (
        <Box mx={"10px"} my={"10px"}>
            <Grid container width={"100%"} spacing={1}>
                <Grid item width={"50%"}>
                </Grid>
                <Grid item width={"50%"}>
                    <Stack spacing={2}>
                        <TargetSetting/>
                        <Divider/>
                        <Operation/>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}