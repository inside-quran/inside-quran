// src/components/admin/AdminRoute.tsx
// Route guard: redirects to login if not authenticated

import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '@/utils/adminApi';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
