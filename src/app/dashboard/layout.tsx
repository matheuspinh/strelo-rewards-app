'use client';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <RoleBasedGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
