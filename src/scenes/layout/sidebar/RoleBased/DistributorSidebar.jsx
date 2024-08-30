// components/Sidebar/RoleBased/DistributorSidebar.js
import React from 'react';
import { Menu } from "react-pro-sidebar";
import {
  DashboardOutlined,
  LocalShippingOutlined,
  TimelineOutlined,
  StoreOutlined,
  AssessmentOutlined,
  PeopleAltOutlined,
  AssignmentOutlined,
  SyncOutlined,
} from "@mui/icons-material";
import Item from "../Item";

const DistributorSidebar = ({ colors }) => (
  <Menu
    menuItemStyles={{
      button: {
        ":hover": { color: "#868dfb", background: "transparent", transition: ".4s ease" },
      },
    }}
  >
    <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
    <Item title="Distribute Drugs" path="/distribute-drugs" colors={colors} icon={<LocalShippingOutlined />} />
    <Item title="Track Shipments" path="/track-shipments" colors={colors} icon={<SyncOutlined />} />
    <Item title="Warehouse Management" path="/warehouse-management" colors={colors} icon={<StoreOutlined />} />
    <Item title="Live Distribution Reports" path="/live-distribution-reports" colors={colors} icon={<AssessmentOutlined />} />
    <Item title="Collaboration" path="/collaboration" colors={colors} icon={<PeopleAltOutlined />} />
    <Item title="Task Management" path="/task-management" colors={colors} icon={<AssignmentOutlined />} />
  </Menu>
);

export default DistributorSidebar;
