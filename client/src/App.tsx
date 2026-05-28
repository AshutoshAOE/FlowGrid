import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

import { Warehouses } from './pages/domains/Warehouses';
import { Products } from './pages/domains/Products';
import { Inventory } from './pages/domains/Inventory';
import { Drivers } from './pages/domains/Drivers';
import { Shipments } from './pages/domains/Shipments';
import { Intelligence } from './pages/domains/Intelligence';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="warehouses" element={<Warehouses />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="intelligence" element={<Intelligence />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
