import {createTheme} from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            light: '#3f4576',
            main: '#111e4a',
            dark: '#000023',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#ffde65',
            main: '#d0ad34',
            dark: '#9b7e00',
            contrastText: '#000000',
        },
        background: {
            default: '#272727',
            dark: '#181818',
        },
    },
    typography: {
        fontFamily: [
            'noto-sans',
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
        ].join(','),
        h6: {
            fontSize: 16,
        }
    }
});

export default theme
