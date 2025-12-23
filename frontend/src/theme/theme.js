import { createTheme } from "@mui/material/styles";
import { blue, cyan, grey } from "@mui/material/colors";

// Define your custom theme
const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: blue[600],
            light: blue[400],
            dark: blue[800],
            contrastText: "#ffffff",
        },
        secondary: {
            main: cyan[600],
            light: cyan[400],
            dark: cyan[800],
            contrastText: "#ffffff",
        },
        background: {
            default: "#ffffff",
            paper: "#ffffff",
        },
        text: {
            primary: grey[900],
            secondary: grey[600],
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h2: { fontWeight: 700 },
        h4: { fontWeight: 600, color: grey[900] },
        h5: { fontWeight: 500, color: grey[700] },
        h6: { fontWeight: 600, color: grey[900] },
        body2: { color: grey[700] },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 6,
                },
                containedPrimary: {
                    boxShadow: `0 4px 12px 0 ${blue[400]}40`,
                    "&:hover": {
                        boxShadow: `0 6px 16px 0 ${blue[500]}50`,
                        backgroundColor: blue[700],
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {},
            },
        },
        MuiAppBar: {
            defaultProps: {
                elevation: 0,
                color: "inherit",
            },
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    borderBottom: `1px solid ${grey[200]}`,
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {},
            },
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) => ({
                    border: `1px solid ${grey[200]}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: theme.spacing(3, 2),
                    borderRadius: theme.shape.borderRadius,
                }),
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: ({ theme }) => ({
                    flexGrow: 1,
                    padding: theme.spacing(1, 0),
                    width: "100%",
                }),
            },
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    padding: "0 16px 16px",
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    color: blue[600],
                    textDecorationColor: blue[200],
                    "&:hover": {
                        textDecorationColor: blue[600],
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: { backgroundColor: grey[50] },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: blue[100],
                    color: blue[600],
                    marginBottom: theme.spacing(2),
                    width: 50,
                    height: 50,
                }),
            },
        },
    },
});

export default theme;
