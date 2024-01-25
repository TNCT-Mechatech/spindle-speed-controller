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
    const [isError, setIsError] = useState<boolean>(false)

    const onTargetChangeHandle = async (e: ChangeEvent<HTMLInputElement>) => {
        const result = Math.abs(Number(e.target.value)).toString();

        if (result === "NaN") {
            setTarget("");
        } else {
            setTarget(result);
        }
    }

    const onSubmitHandle = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        //  check if target speed is under max speed
        const maxSpeed = await getMaxSpeed()
        if (Number(target) > maxSpeed) {
            setIsError(true)
            return
        }

        //  reset error
        setIsError(false)

        invoke("set_spindle_target", {direction: direction != "forward", speed: Number(target)})
            .then((res) => {
                console.log(res)
            })
    }

    return (
        <Container>
            <Stack component={"form"} onSubmit={onSubmitHandle} spacing={1}>
                <FormControl>
                    <FormLabel id="controlled-direction-radio">回転方向</FormLabel>
                    <RadioGroup
                        aria-labelledby="controlled-direction-radio"
                        name="controlled-direction-radio"
                        value={direction}
                        onChange={(event) => setDirection(event.target.value)}
                    >
                        <FormControlLabel value="forward" control={<Radio/>} label="正回転"/>
                        <FormControlLabel value="reverse" control={<Radio/>} label="逆回転"/>
                    </RadioGroup>
                </FormControl>
                <Box>
                    <InputLabel>目標速度 [RPM]</InputLabel>
                    <TextField
                        error={isError}
                        helperText="目標回転速度は最大回転数よりも大きくできません"
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
                    送信
                </Button>
            </Stack>
        </Container>
    )
}

const getMaxSpeed = async (): Promise<number> => {
    return await invoke("get_max_spindle_speed");
}
