import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#2196f3', // Blue color
    },
    secondary: {
      main: '#00bcd4', // Cyan-blue color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Button styles
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#00bcd4', // Slider color
        },
      },
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
