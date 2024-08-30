// components/Sidebar/RoleBased/LowLevelDistributorSidebar.js
import React from 'react';
import { Menu } from "react-pro-sidebar";
import {
  DashboardOutlined,
  LocalShippingOutlined,
  InventoryOutlined,
  ReportOutlined,
  NotificationsOutlined,
  SyncOutlined,
} from "@mui/icons-material";
import Item from "../Item";

const LowLevelDistributorSidebar = ({ colors }) => (
  <Menu
    menuItemStyles={{
      button: {
        ":hover": { color: "#868dfb", background: "transparent", transition: ".4s ease" },
      },
    }}
  >
    <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
    <Item title="Local Distribution" path="/local-distribution" colors={colors} icon={<LocalShippingOutlined />} />
    <Item title="Monitor Stock Levels" path="/monitor-stock" colors={colors} icon={<InventoryOutlined />} />
    <Item title="Local Distribution Reports" path="/local-reports" colors={colors} icon={<ReportOutlined />} />
    <Item title="Real-Time Updates" path="/real-time-updates" colors={colors} icon={<SyncOutlined />} />
    <Item title="Notifications" path="/notifications" colors={colors} icon={<NotificationsOutlined />} />
  </Menu>
);

export default LowLevelDistributorSidebar;
