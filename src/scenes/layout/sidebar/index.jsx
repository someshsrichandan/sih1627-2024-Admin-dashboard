// src/components/Sidebar/Sidebar.js
import React, { useContext, useState } from "react";
import { Box, IconButton, Typography, useTheme, Avatar } from "@mui/material";
import { Sidebar, MenuItem, Menu } from "react-pro-sidebar";
import { MenuOutlined } from "@mui/icons-material";
import { tokens } from "../../../theme";
import logo from "../../../assets/images/logo.png";
import avatar from "../../../assets/images/avatar.png";
import { ToggledContext } from "../../../App"; // Ensure correct import path for ToggledContext
import { AuthContext } from "../../../context/AuthContext"; // Ensure correct import path for AuthContext
import RoleBasedSidebar from "./RoleBasedSidebar"; // Role-based sidebar component

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const { user } = useContext(AuthContext); // Access current user from AuthContext
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{ border: 0, height: "100%" }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src={logo}
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  Argon
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={avatar}
            sx={{ width: "100px", height: "100px" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              {user?.username || "User Name"}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              {user?.role || "User Role"}
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <RoleBasedSidebar role={user?.role} colors={colors} /> {/* Render role-based sidebar */}
      </Box>
    </Sidebar>
  );
};

export default SideBar;
