import {ChangeEvent, FormEvent, useState} from "react";
import {
    Box, Button, Container,
    FormControl,
    FormControlLabel,
    FormLabel, InputLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField
} from "@mui/material";
import {invoke} from "@tauri-apps/api/tauri";

export default function TargetSetting() {
    const [target, setTarget] = useState<String>("")
    const [direction, setDirection] = useState<String>("forward")

    const onTargetChangeHandle = async (e: ChangeEvent<HTMLInputElement>) => {
        const result = Math.abs(Number(e.target.value)).toString();

        if (result === "NaN") {
            setTarget("");
        } else {
            setTarget(result);
        }
    }

    const onSubmitHandle = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        invoke("set_spindle_target", {direction: direction != "forward", speed: Number(target)})
            .then((res) => {
                console.log(res)
            })
    }

    return (
        <Container>
            <Stack component={"form"} onSubmit={onSubmitHandle} spacing={2}>
                <FormControl>
                    <FormLabel id="controlled-direction-radio">Direction</FormLabel>
                    <RadioGroup
                        aria-labelledby="controlled-direction-radio"
                        name="controlled-direction-radio"
                        value={direction}
                        onChange={(event) => setDirection(event.target.value)}
                    >
                        <FormControlLabel value="forward" control={<Radio/>} label="Forward"/>
                        <FormControlLabel value="reverse" control={<Radio/>} label="Reverse"/>
                    </RadioGroup>
                </FormControl>
                <Box>
                    <InputLabel>Target Speed [RPM]</InputLabel>
                    <TextField
                        required={true}
                        value={target}
                        onChange={onTargetChangeHandle}
                        inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*"
                        }}
                    />
                </Box>
                <Button
                    variant={"contained"}
                    type={"submit"}
                    sx={{
                        maxWidth: "100px"
                    }}
                >
                    Send
                </Button>
            </Stack>
        </Container>
    )
}