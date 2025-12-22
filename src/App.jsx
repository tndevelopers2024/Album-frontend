import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Admin from './pages/Admin';
import UsersList from './pages/UsersList';
import UserDetails from './pages/UserDetails';
import ProductsList from './pages/ProductsList';
import ProductForm from './pages/ProductForm';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import OrderForm from './pages/OrderForm';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetails from './pages/AdminOrderDetails';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import MainLayout from './components/layouts/MainLayout';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-zg-bg text-zg-primary font-body">
          <Routes>
            {/* All Public Routes with Main Layout (including Auth) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:productId" element={<ProductDetails />} />
              <Route path="/shop/:productId/customize" element={<OrderForm />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />
            <Route path="/admin/products" element={<ProductsList />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/:id" element={<ProductForm />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
