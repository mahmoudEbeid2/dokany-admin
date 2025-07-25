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
import SellerDetails from "./components/Sellers/SellerDetails";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/analytics" replace />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="sellers" element={<SellersList />} />
              <Route path="sellers/:id" element={<SellerDetails />} />
              <Route path="managers" element={<ManagersList />} />
              <Route path="payouts" element={<PayoutsList />} />
              <Route path="themes" element={<ThemesList />} />
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
