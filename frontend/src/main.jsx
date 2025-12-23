import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme/theme'
import { AnalysisProvider } from './context/AnalysisContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <AnalysisProvider>
                    <CssBaseline />
                    <App />
                </AnalysisProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
