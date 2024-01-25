import CssBaseline from '@mui/material/CssBaseline';
import {Box, createTheme, ThemeProvider, Toolbar} from "@mui/material";
import Header from "./Header.tsx";
import {useState} from "react";
import Dashboard from "./Dashboard.tsx";
import Settings from "./Settings.tsx";

const theme = createTheme({
    palette: {
        mode: 'light'
    },
    typography: {
        fontFamily: [
            'Roboto',
            '"Noto Sans JP"',
            '"Helvetica"',
            'Arial',
            'sans-serif',
        ].join(','),
    }
})

export enum Page {
    Dashboard,
    Settings
}

export default function App() {
    const [pageState, setPageState] = useState<Page>(Page.Dashboard);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <Header setPage={setPageState}/>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    {pageState === Page.Dashboard && <Dashboard/>}
                    {pageState === Page.Settings && <Settings/>}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
