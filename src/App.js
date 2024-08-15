import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddSales from './pages/AddSales'; 
import AddPurchase from './pages/AddPurchase'; 
import Stocks from './pages/Stocks';
import BrandDetails from './pages/BrandDetails';
import Settings from './pages/Settings';
import Search from './pages/Search';
import AddBrand from './pages/AddBrand';
import AddCategory from './pages/AddCategory';
import EditBrand from './pages/ViewBrand';
import EditCategory from './pages/ViewCategory';
import ViewPerformance from './pages/ViewPerformance';
import ChangePassword from './pages/ChangePassword';
import DetailsPage from './pages/DetailsPage';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AddUser from './admin/AddUser';
import ViewUsers from './admin/ViewUsers';
import AdminSettings from './admin/Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-sales" element={<AddSales />} />
          <Route path="/add-purchase" element={<AddPurchase />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/brandDetails/:brandName" element={<BrandDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/search" element={<Search />} />
          <Route path="/add-brand" element={<AddBrand />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/view-brand" element={<EditBrand />} />
          <Route path="/view-category" element={<EditCategory />} />
          <Route path="/view-performance" element={<ViewPerformance />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/details/:brandId/:modelId" element={<DetailsPage />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/addusers" element={<AddUser />} />
          <Route path="/admin/viewuser" element={<ViewUsers />} />
            <Route path="/admin/Settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
