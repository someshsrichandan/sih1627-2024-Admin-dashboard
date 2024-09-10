// components/Sidebar/RoleBased/MedicalAdminSidebar.jsx
import React from 'react';
import { Menu } from "react-pro-sidebar";
import {
  DashboardOutlined,
  DonutLargeOutlined,
  ReceiptOutlined,
  PeopleAltOutlined,
  ReportOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SettingsOutlined,
  HealingOutlined,
} from "@mui/icons-material";
import Item from "../Item";

const MedicalAdminSidebar = ({ colors }) => (
  <Menu
    menuItemStyles={{
      button: {
        ":hover": { color: "#868dfb", background: "transparent", transition: ".4s ease" },
      },
    }}
  >
    <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
    <Item title="Receive Drugs" path="/receive-drugs" colors={colors} icon={<DonutLargeOutlined />} />
    <Item title="Stock Management" path="/stock-management" colors={colors} icon={<ReceiptOutlined />} />
    <Item title="Patient Distribution" path="/patient-distribution" colors={colors} icon={<PeopleAltOutlined />} />
    <Item title="Usage Reports" path="/usage-reports" colors={colors} icon={<ReportOutlined />} />
    <Item title="Alerts & Notifications" path="/alerts" colors={colors} icon={<NotificationsOutlined />} />
    <Item title="User Profile" path="/profile" colors={colors} icon={<PersonOutlined />} />
    <Item title="Settings" path="/settings" colors={colors} icon={<SettingsOutlined />} />
    <Item title="Emergency Care" path="/emergency-care" colors={colors} icon={<HealingOutlined />} />
  </Menu>
);

export default MedicalAdminSidebar;
