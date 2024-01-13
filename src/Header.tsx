import {AppBar, Button, Toolbar} from "@mui/material";
import {Page} from "./App.tsx";

export type HeaderProps = {
    setPage: (page: Page) => void
}

export default function Header(props: HeaderProps) {
    return (
        <AppBar position={"absolute"}>
            <Toolbar>
                <Button
                    size="large"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={() => {
                        props.setPage(Page.Dashboard)
                    }}
                >
                    Dashboard
                </Button>
                <Button
                    size="large"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={() => {
                        props.setPage(Page.Settings)
                    }}
                >
                    Settings
                </Button>
            </Toolbar>
        </AppBar>
    )
}