// components/Sidebar/RoleBased/DrugSupplierSidebar.js
import React from 'react';
import { Menu } from "react-pro-sidebar";
import {
  DashboardOutlined,
  InventoryOutlined,
  ContactsOutlined,
  TimelineOutlined,
  NotificationsOutlined,
  AssignmentOutlined,
  ChatBubbleOutlineOutlined,
  InsightsOutlined,
} from "@mui/icons-material";
import Item from "../Item";

const DrugSupplierSidebar = ({ colors }) => (
  <Menu
    menuItemStyles={{
      button: {
        ":hover": { color: "#868dfb", background: "transparent", transition: ".4s ease" },
      },
    }}
  >
    <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
    <Item title="Manage Inventory" path="/manage-inventory" colors={colors} icon={<InventoryOutlined />} />
    <Item title="Order History" path="/order-history" colors={colors} icon={<ContactsOutlined />} />
    <Item title="Supply Chain Overview" path="/supply-chain-overview" colors={colors} icon={<TimelineOutlined />} />
    <Item title="Real-Time Alerts" path="/real-time-alerts" colors={colors} icon={<NotificationsOutlined />} />
    <Item title="Task Management" path="/task-management" colors={colors} icon={<AssignmentOutlined />} />
    <Item title="Communication" path="/communication" colors={colors} icon={<ChatBubbleOutlineOutlined />} />
    <Item title="Predictive Insights" path="/predictive-insights" colors={colors} icon={<InsightsOutlined />} />
  </Menu>
);

export default DrugSupplierSidebar;
