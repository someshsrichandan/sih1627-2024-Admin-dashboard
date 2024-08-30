/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme, Badge } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
  LocalShippingOutlined,
  StoreOutlined,
  InventoryOutlined,
  ReportOutlined,
  HealingOutlined,
  NotificationsOutlined,
  AssignmentOutlined,
  InsightsOutlined,
  SettingsOutlined,
  ChatBubbleOutlineOutlined,
  SyncOutlined,
  AssessmentOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import avatar from "../../../assets/images/avatar.png";
import logo from "../../../assets/images/logo.png";
import Item from "./Item";
import { ToggledContext, AuthContext } from "../../../App"; // Import AuthContext to access user role

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const { user } = useContext(AuthContext); // Get the current user from AuthContext
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define sidebar items based on user role with real-time and advanced features
  const getMenuItems = () => {
    switch (user?.role) {
      case 'drugSupplier':
        return (
          <>
            <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
            <Item title="Manage Inventory" path="/manage-inventory" colors={colors} icon={<InventoryOutlined />} />
            <Item title="Order History" path="/order-history" colors={colors} icon={<ContactsOutlined />} />
            <Item title="Supply Chain Overview" path="/supply-chain-overview" colors={colors} icon={<TimelineOutlined />} />
            <Item title="Real-Time Alerts" path="/real-time-alerts" colors={colors} icon={<Badge badgeContent={4} color="secondary"><NotificationsOutlined /></Badge>} />
            <Item title="Task Management" path="/task-management" colors={colors} icon={<AssignmentOutlined />} />
            <Item title="Communication" path="/communication" colors={colors} icon={<ChatBubbleOutlineOutlined />} />
            <Item title="Predictive Insights" path="/predictive-insights" colors={colors} icon={<InsightsOutlined />} />
          </>
        );
      case 'government':
        return (
          <>
            <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
            <Item title="Monitor Distribution" path="/monitor-distribution" colors={colors} icon={<MapOutlined />} />
            <Item title="Policy Management" path="/policy-management" colors={colors} icon={<HelpOutlineOutlined />} />
            <Item title="Reports" path="/reports" colors={colors} icon={<BarChartOutlined />} />
            <Item title="Emergency Response" path="/emergency-response" colors={colors} icon={<HealingOutlined />} />
            <Item title="Analytics & Insights" path="/analytics" colors={colors} icon={<InsightsOutlined />} />
            <Item title="Alerts & Notifications" path="/alerts" colors={colors} icon={<Badge badgeContent={3} color="secondary"><NotificationsOutlined /></Badge>} />
            <Item title="Security Settings" path="/security-settings" colors={colors} icon={<SecurityOutlined />} />
          </>
        );
      case 'distributor':
        return (
          <>
            <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
            <Item title="Distribute Drugs" path="/distribute-drugs" colors={colors} icon={<LocalShippingOutlined />} />
            <Item title="Track Shipments" path="/track-shipments" colors={colors} icon={<SyncOutlined />} />
            <Item title="Warehouse Management" path="/warehouse-management" colors={colors} icon={<StoreOutlined />} />
            <Item title="Live Distribution Reports" path="/live-distribution-reports" colors={colors} icon={<AssessmentOutlined />} />
            <Item title="Collaboration" path="/collaboration" colors={colors} icon={<PeopleAltOutlined />} />
            <Item title="Task Management" path="/task-management" colors={colors} icon={<AssignmentOutlined />} />
          </>
        );
      case 'distributorLowLevel':
        return (
          <>
            <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
            <Item title="Local Distribution" path="/local-distribution" colors={colors} icon={<LocalShippingOutlined />} />
            <Item title="Monitor Stock Levels" path="/monitor-stock" colors={colors} icon={<InventoryOutlined />} />
            <Item title="Local Distribution Reports" path="/local-reports" colors={colors} icon={<ReportOutlined />} />
            <Item title="Real-Time Updates" path="/real-time-updates" colors={colors} icon={<SyncOutlined />} />
            <Item title="Notifications" path="/notifications" colors={colors} icon={<Badge badgeContent={2} color="secondary"><NotificationsOutlined /></Badge>} />
          </>
        );
      case 'medicalAdministrator':
        return (
          <>
            <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
            <Item title="Receive Drugs" path="/receive-drugs" colors={colors} icon={<DonutLargeOutlined />} />
            <Item title="Stock Management" path="/stock-management" colors={colors} icon={<ReceiptOutlined />} />
            <Item title="Patient Distribution" path="/patient-distribution" colors={colors} icon={<PeopleAltOutlined />} />
            <Item title="Usage Reports" path="/usage-reports" colors={colors} icon={<ReportOutlined />} />
            <Item title="Alerts & Notifications" path="/alerts" colors={colors} icon={<Badge badgeContent={5} color="secondary"><NotificationsOutlined /></Badge>} />
            <Item title="User Profile" path="/profile" colors={colors} icon={<PersonOutlined />} />
            <Item title="Settings" path="/settings" colors={colors} icon={<SettingsOutlined />} />
          </>
        );
      default:
        return (
          <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
        );
    }
  };

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
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
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          {getMenuItems()} {/* Render menu items based on the user role */}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
