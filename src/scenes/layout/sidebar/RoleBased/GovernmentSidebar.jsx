// components/Sidebar/RoleBased/GovernmentSidebar.js
import React from 'react';
import { Menu } from "react-pro-sidebar";
import {
  DashboardOutlined,
  MapOutlined,
  HelpOutlineOutlined,
  BarChartOutlined,
  HealingOutlined,
  InsightsOutlined,
  NotificationsOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import Item from "../Item";

const GovernmentSidebar = ({ colors }) => (
  <Menu
    menuItemStyles={{
      button: {
        ":hover": { color: "#868dfb", background: "transparent", transition: ".4s ease" },
      },
    }}
  >
    <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
    <Item title="Monitor Distribution" path="/monitor-distribution" colors={colors} icon={<MapOutlined />} />
    <Item title="Policy Management" path="/policy-management" colors={colors} icon={<HelpOutlineOutlined />} />
    <Item title="Reports" path="/reports" colors={colors} icon={<BarChartOutlined />} />
    <Item title="Emergency Response" path="/emergency-response" colors={colors} icon={<HealingOutlined />} />
    <Item title="Analytics & Insights" path="/analytics" colors={colors} icon={<InsightsOutlined />} />
    <Item title="Alerts & Notifications" path="/alerts" colors={colors} icon={<NotificationsOutlined />} />
    <Item title="Security Settings" path="/security-settings" colors={colors} icon={<SecurityOutlined />} />
  </Menu>
);

export default GovernmentSidebar;
