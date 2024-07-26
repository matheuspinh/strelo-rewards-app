'use client';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import { UsersProvider } from '../contexts/users/users-provider';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <RoleBasedGuard>
        <UsersProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </UsersProvider>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
