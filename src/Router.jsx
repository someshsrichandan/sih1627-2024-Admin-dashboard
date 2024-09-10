import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";

// import Dashboard from "./pages/Dashboard";
import DistributeDrugs from './pages/DistributeDrugs';
import TrackShipments from './pages/TrackShipments';
import WarehouseManagement from './pages/WarehouseManagement';
import LiveDistributionReports from './pages/LiveDistributionReports';
import Collaboration from './pages/Collaboration';
import TaskManagement from './pages/TaskManagement';
import ManageInventory from './pages/ManageInventory';
import OrderHistory from './pages/OrderHistory';
import SupplyChainOverview from './pages/SupplyChainOverview';
import RealTimeAlerts from './pages/RealTimeAlerts';
import Communication from './pages/Communication';
import PredictiveInsights from './pages/PredictiveInsights';
import MonitorDistribution from './pages/MonitorDistribution';
import PolicyManagement from './pages/PolicyManagement';
import Reports from './pages/Reports';
import EmergencyResponse from './pages/EmergencyResponse';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import SecuritySettings from './pages/SecuritySettings';
import LocalDistribution from './pages/LocalDistribution';
import MonitorStock from './pages/MonitorStock';
import LocalReports from './pages/LocalReports';
import RealTimeUpdates from './pages/RealTimeUpdates';
import ReceiveDrugs from './pages/ReceiveDrugs';
import StockManagement from './pages/StockManagement';
import PatientDistribution from './pages/PatientDistribution';
import UsageReports from './pages/UsageReports';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import EmergencyCare from './pages/EmergencyCare';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route path="/" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/line" element={<Line />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/geography" element={<Geography />} /> */}
          <Route path="/" element={<Dashboard />} />
                {/* <Route path="/distribute-drugs" element={<DistributeDrugs />} /> */}
                <Route path="/track-shipments" element={<TrackShipments />} />
                <Route path="/warehouse-management" element={<WarehouseManagement />} />
                <Route path="/live-distribution-reports" element={<LiveDistributionReports />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/task-management" element={<TaskManagement />} />
                <Route path="/manage-inventory" element={<ManageInventory />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/supply-chain-overview" element={<SupplyChainOverview />} />
                <Route path="/real-time-alerts" element={<RealTimeAlerts />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/predictive-insights" element={<PredictiveInsights />} />
                <Route path="/monitor-distribution" element={<MonitorDistribution />} />
                <Route path="/policy-management" element={<PolicyManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/emergency-response" element={<EmergencyResponse />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/security-settings" element={<SecuritySettings />} />
                {/* <Route path="/local-distribution" element={<LocalDistribution />} /> */}
                <Route path="/monitor-stock" element={<MonitorStock />} />
                <Route path="/local-reports" element={<LocalReports />} />
                <Route path="/real-time-updates" element={<RealTimeUpdates />} />
                <Route path="/receive-drugs" element={<ReceiveDrugs />} />
                <Route path="/stock-management" element={<StockManagement />} />
                <Route path="/patient-distribution" element={<PatientDistribution />} />
                <Route path="/usage-reports" element={<UsageReports />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/emergency-care" element={<EmergencyCare />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
