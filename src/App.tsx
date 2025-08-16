import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Login from "./components/Auth/Login";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Layout from "./components/Layout/Layout";
import SellersList from "./components/Sellers/SellersList";
import ManagersList from "./components/Managers/ManagersList";
import Analytics from "./components/Analytics/Analytics";
import ThemesList from "./components/Themes/ThemesList";
import PayoutsList from "./components/Payouts/PayoutsList";
import Profile from "./components/Profile/Profile";
import AdminForgotPassword from "./components/Auth/AdminForgotPassword";
import { Campaigns, CreateCampaign, CampaignDetails } from "./components/Campaigns";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="h-screen bg-gray-50 overflow-hidden">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin-forgot-password"
              element={<AdminForgotPassword />}
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/dashboard/analytics" replace />}
              />
              <Route path="sellers" element={<SellersList />} />
              <Route path="managers" element={<ManagersList />} />
              <Route path="payouts" element={<PayoutsList />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="themes" element={<ThemesList />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Campaign Routes */}
            <Route
              path="/campaigns"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Campaigns />} />
              <Route path="new" element={<CreateCampaign />} />
              <Route path=":id" element={<CampaignDetails />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
