import {invoke} from "@tauri-apps/api/tauri";
import {useState} from "react";
import {useAsync} from "react-use";
import {Box, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

export default function SerialPortSelector() {
    const [availablePorts, setAvailablePorts] = useState<string[]>([])
    const [selectedPort, setSelectedPort] = useState<string>("")

    useAsync(async () => {
        setAvailablePorts(await getAvailablePorts())
        getSelectedPort()
            .then((port) => setSelectedPort(port))
    })

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedPort(event.target.value as string);

        //  rust
        invoke("set_port", {path: event.target.value as string})
            .then((res) => console.log(res))
    };

    return (
        <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-around"}
            alignItems={"center"}

        >
            <IconButton
                aria-label="reload"
                size={"medium"}
                onClick={() => {
                    getAvailablePorts()
                        .then((ports) => setAvailablePorts(ports))
                }}
            >
                <RefreshIcon/>
            </IconButton>
            <FormControl sx={{ width: "80%" }}>
                <InputLabel id="serial-port-select-label">Serial Port</InputLabel>
                <Select
                    labelId="serial-port-select-label"
                    id="serial-port-select"
                    value={selectedPort}
                    label="Serial Port"

                    onChange={handleChange}
                >
                    {availablePorts.map((port) => (
                        <MenuItem key={port} value={port}>
                            {port}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>

    )
}

const getAvailablePorts = async (): Promise<string[]> => {
    return invoke("get_available_ports")
}

const getSelectedPort = async (): Promise<string> => {
    return invoke("get_selected_port")
}
