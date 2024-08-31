// App.js
import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./components/Login"; // Import the Login component
// Import role-based dashboards if needed

export const ToggledContext = createContext(null);
export const AuthContext = createContext(null); // Create a context for authentication

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const [user, setUser] = useState(null); // State to store logged-in user
  const values = { toggled, setToggled };

  // Function to handle login
  const handleLogin = (user) => {
    setUser(user);
    // Uncomment and configure navigation when ready to implement role-based redirection
    /*
    switch (user.role) {
      case 'drugSupplier':
        navigate('/supplier-dashboard');
        break;
      case 'medicalAdministrator':
        navigate('/medical-admin-dashboard');
        break;
      // Add other cases for different roles
      default:
        navigate('/'); // Redirect to home or error page if role not recognized
    }
    */
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <AuthContext.Provider value={{ user, handleLogin }}> {/* Provide user and handleLogin */}
            {user ? ( // Check if user is logged in
              <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
                <SideBar />
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    maxWidth: "100%",
                  }}
                >
                  <Navbar />
                  <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                    {/* <Routes> */}
                      {/* Define routes as needed */}
                      {/* <Route path="*" element={<h1>Welcome to the Dashboard</h1>} /> Default route */}
                      <Outlet />
                    {/* </Routes> */}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Login /> // Show login page if not logged in
            )}
          </AuthContext.Provider>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;