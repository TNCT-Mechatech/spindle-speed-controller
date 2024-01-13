import CssBaseline from '@mui/material/CssBaseline';
import {Box, createTheme, ThemeProvider, Typography} from "@mui/material";

export default function App() {
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

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
            </Box>
        </ThemeProvider>
    );
}
