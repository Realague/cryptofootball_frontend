import {createTheme} from '@mui/material'

export const lightTheme = createTheme({
	palette: {
		mode: 'light',
	},
})

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
			light: '#3c3c3c',
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
			fontWeight: 700,
		},
		h5: {
			fontSize: 16,
			fontWeight: 400,
		},
		subtitle1: {
			fontSize: 14,
			fontWeight: 400,
			lineHeight: 1,
		},
		subtitle2: {
			fontSize: 14,
			fontWeight: 700,
			lineHeight: 1,
		},
		body1: {
			fontSize: 12,
			fontWeight: 400,
			lineHeight: 1,
		},
		body2: {
			fontSize: 12,
			fontWeight: 700,
			lineHeight: 1,
		},
		button: {
			fontSize: 12,
		},

	}
})

export default theme
