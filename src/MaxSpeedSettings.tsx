import {Container, TextField, Typography} from "@mui/material";
import {ChangeEvent, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import {useAsync} from "react-use";

const getMaxSpeed = async (): Promise<number> => {
    return await invoke("get_max_spindle_speed");
}

export default function MaxSpeedSettings() {
    const [maxSpeed, setMaxSpeed] = useState<String>("")

    useAsync(async () => {
        getMaxSpeed()
            .then((res) => {
                console.log(res)
                setMaxSpeed(res.toString())
            })
    })

    const onChangeHandle = async (e: ChangeEvent<HTMLInputElement>) => {
        const result = Math.abs(Number(e.target.value)).toString();

        if (result === "NaN") {
            setMaxSpeed("");
        } else {
            setMaxSpeed(result);

            //  save
            await invoke("set_max_spindle_speed", {speed: Number(result)})
        }
    }

    return (
        <Container>
            <Typography variant={"h6"}>最大回転速度 [RPM]</Typography>
            <TextField
                required={true}
                value={maxSpeed}
                onChange={onChangeHandle}
                inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*"
                }}
            />
        </Container>
    )
}